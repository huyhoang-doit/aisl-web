import { createContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { MessagePayload } from "firebase/messaging";
import { messaging } from "@/shared/configs/firebase";
import { onMessage } from "firebase/messaging";
import { toast } from "sonner";
import type {
  Notification,
  NotificationMessage,
  NotificationCategoryValue,
  NotificationTypeValue,
} from "@/shared/types/notification.types";
import { notificationService } from "@/shared/services/notification.service";
import { useAuthStore } from "@/features/auth/store/auth.store";

export type { Notification };

type NotificationContextType = {
  /** Combined notifications: FCM foreground + API backend */
  notifications: Notification[];
  /** Number of unread notifications (from API) */
  unreadCount: number;
  /** Loading state for API calls */
  isLoading: boolean;
  /** Add a foreground FCM notification */
  addNotification: (payload: MessagePayload) => void;
  /** Mark all as read (API + local) */
  markAllAsRead: () => void;
  /** Mark one notification as read (API + local) */
  markAsRead: (id: string) => void;
  /** Clear in-memory notifications */
  clearNotifications: () => void;
  /** Refresh notifications from API */
  refreshNotifications: () => Promise<void>;
};

export const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

/**
 * Convert API notification to local Notification format
 */
function apiToLocal(n: NotificationMessage): Notification {
  return {
    id: n.id,
    title: n.title,
    body: n.body,
    read: n.isRead,
    createdAt: n.createdAt,
    type: n.type as NotificationTypeValue,
    category: n.category as NotificationCategoryValue,
    data: n.data,
  };
}

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuthStore();

  /**
   * Fetch notifications from API
   */
  const refreshNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const [listRes, countRes] = await Promise.all([
        notificationService.getNotifications({ page: 1, limit: 20, orderBy: 'createdAt', orderDirection: 'DESC' }),
        notificationService.countUnread(),
      ]);

      const apiNotifications = (listRes.items || []).map(apiToLocal);
      setNotifications(apiNotifications);
      setUnreadCount(typeof countRes.count === 'number' ? countRes.count : 0);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Add a foreground FCM notification (prepend to list + refresh from API)
   */
  const addNotification = useCallback((payload: MessagePayload) => {
    const { notificationId, type, category } = payload.data || {};

    const newNotif: Notification = {
      id: notificationId || Date.now().toString(),
      title: payload.notification?.title || "Thông báo",
      body: payload.notification?.body || "",
      read: false,
      createdAt: new Date().toISOString(),
      type: type as NotificationTypeValue,
      category: category as NotificationCategoryValue,
      data: payload.data,
    };

    // Optimistically prepend the new notification
    setNotifications((prev) => [newNotif, ...prev]);
    setUnreadCount((prev) => prev + 1);

    // Refresh from API in background to get the persisted version
    refreshNotifications();
  }, [refreshNotifications]);

  /**
   * Listen for foreground FCM messages
   */
  useEffect(() => {
    if (typeof window === "undefined" || typeof Notification === "undefined") return;

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);
      addNotification(payload);
      toast.info(`${payload.notification?.title}: ${payload.notification?.body}`);
    });

    return () => {
      unsubscribe();
    };
  }, [addNotification]);

  /**
   * Fetch notifications when user authenticates
   */
  useEffect(() => {
    if (isAuthenticated) {
      refreshNotifications();
    } else {
      // Clear when logged out
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, refreshNotifications]);

  /**
   * Mark a single notification as read
   */
  const markAsRead = useCallback(async (id: string) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id && !n.read ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await notificationService.markAsRead(id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      // Revert on failure
      refreshNotifications();
    }
  }, [refreshNotifications]);

  /**
   * Mark all notifications as read (local only — no bulk API endpoint provided)
   */
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);

    // Mark each unread one individually via API (fire and forget)
    notifications
      .filter((n) => !n.read)
      .forEach((n) => {
        notificationService.markAsRead(n.id).catch((err) =>
          console.error("Failed to mark notification as read:", err)
        );
      });
  }, [notifications]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        addNotification,
        markAllAsRead,
        markAsRead,
        clearNotifications,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
