import React, { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useFcmToken } from "./useFcmToken";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";

const FCM_DISMISSED_KEY = "fcm_popup_dismissed";

/**
 * FcmHandler Component
 * Handles FCM registration and foreground notifications
 * Should be placed inside authenticated layouts (Admin/Staff)
 */
export const FcmHandler = () => {
  const { token: jwt, isAuthenticated } = useAuthStore();
  const registerFcmToken = useFcmToken(jwt);
  // Compute initial dialog state synchronously to avoid unnecessary renders
  const shouldShowDialog = useCallback(() => {
    if (!isAuthenticated || !jwt) return false;
    if (typeof Notification === "undefined") return false;
    if (Notification.permission !== "default") return false;
    return !sessionStorage.getItem(FCM_DISMISSED_KEY);
  }, [isAuthenticated, jwt]);

  const [showDialog, setShowDialog] = useState(shouldShowDialog);

  // Auto-register FCM token when permission is already granted
  useEffect(() => {
    if (!isAuthenticated || !jwt) return;
    if (typeof Notification === "undefined") return;

    if (Notification.permission === "granted") {
      registerFcmToken();
    }
  }, [isAuthenticated, jwt, registerFcmToken]);

  // Update dialog visibility when auth state changes
  useEffect(() => {
    setShowDialog(shouldShowDialog());
  }, [shouldShowDialog]);

  const handleAllowNotifications = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent auto-close so we can close after async work
    const success = await registerFcmToken();
    if (success) {
      toast.success("Đã bật thông báo thành công!");
    } else {
      toast.error("Không thể bật thông báo. Vui lòng kiểm tra cài đặt trình duyệt.");
    }
    setShowDialog(false);
  };

  const handleDenyNotifications = () => {
    // Save to sessionStorage so popup won't re-appear during this session
    sessionStorage.setItem(FCM_DISMISSED_KEY, "true");
    setShowDialog(false);
    toast.info("Bạn có thể bật thông báo sau trong phần Cài đặt.");
  };

  if (!showDialog) return null;

  return (
    <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bật thông báo</AlertDialogTitle>
          <AlertDialogDescription>
            Cho phép gửi thông báo để nhận cập nhật về đơn hàng, bảo trì và các
            hoạt động quan trọng khác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleDenyNotifications}>
            Để sau
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleAllowNotifications}>
            Cho phép
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
