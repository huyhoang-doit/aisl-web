export const NotificationType = {
  SYSTEM: "SYSTEM",
  ORDER: "ORDER",
  PROMOTION: "PROMOTION",
} as const;
export type NotificationTypeValue = typeof NotificationType[keyof typeof NotificationType];

export const NotificationCategory = {
  INFO: "INFO",
  WARNING: "WARNING",
  ERROR: "ERROR",
  SYSTEM: "SYSTEM",
} as const;
export type NotificationCategoryValue = typeof NotificationCategory[keyof typeof NotificationCategory];

/**
 * In-memory notification (from FCM foreground messages)
 */
export type Notification = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  type?: NotificationTypeValue;
  category?: NotificationCategoryValue;
  data?: Record<string, string>;
};

/**
 * API notification (from backend GET /users/notifications)
 */
export interface NotificationMessage {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  type?: NotificationTypeValue;
  category?: NotificationCategoryValue;
  data?: Record<string, string>;
  userId?: string;
}

/**
 * Query params for GET /users/notifications
 */
export interface NotificationListParams {
  page?: number;
  limit?: number;
  search?: string;
  isRead?: boolean;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

/**
 * Response from GET /users/notifications
 * Matches backend GetNotificationsResponse
 */
export interface GetNotificationsResponse {
  items: NotificationMessage[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Response from GET /users/notifications/unread-count
 */
export interface CountUnreadResponse {
  count: number;
}

/**
 * Admin Notification Types
 */
export interface NotificationDetailResponse {
  id: string;
  title: string;
  content: string;
  type: string;
  category: string;
  status: string; // PENDING, SENT, FAILED
  createdAt: string;
  updatedAt: string;
}

export interface GetAllNotificationsAdminResponse {
  items: NotificationDetailResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateSystemNotificationDto {
  title: string;
  content: string;
}

export interface UpdateNotificationDto {
  title?: string;
  content?: string;
  status?: string;
}

export interface NotificationGrpcResponse {
  success: boolean;
  message: string;
}

/**
 * Response from PATCH /users/notifications/:id/read
 */
export interface NotificationReadResponse {
  data: NotificationMessage;
}