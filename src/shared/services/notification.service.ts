/**
 * Notification Service
 * API calls for user notifications
 */
import { api } from '@/shared/lib/api/client';
import type {
  NotificationListParams,
  GetNotificationsResponse,
  CountUnreadResponse,
  NotificationReadResponse,
  GetAllNotificationsAdminResponse,
  NotificationDetailResponse,
  CreateSystemNotificationDto,
  UpdateNotificationDto,
  NotificationGrpcResponse,
} from '@/shared/types/notification.types';

export const notificationService = {
  /**
   * Lấy danh sách thông báo
   * GET /users/notifications
   */
  getNotifications: async (params?: NotificationListParams): Promise<GetNotificationsResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set('page', String(params.page));
    if (params?.limit != null) searchParams.set('limit', String(params.limit));
    if (params?.search) searchParams.set('search', params.search);
    if (params?.isRead !== undefined) searchParams.set('isRead', String(params.isRead));
    if (params?.orderBy) searchParams.set('orderBy', params.orderBy);
    if (params?.orderDirection) searchParams.set('orderDirection', params.orderDirection);

    const query = searchParams.toString();
    const url = query ? `/users/notifications?${query}` : '/users/notifications';
    return api.get<any>(url).then((res): GetNotificationsResponse => res.data);
  },

  /**
   * Đếm số thông báo chưa đọc
   * GET /users/notifications/unread-count
   */
  countUnread: async (): Promise<CountUnreadResponse> => {
    return api.get<any>('/users/notifications/unread-count').then((res) => res.data);
  },

  /**
   * Đánh dấu thông báo đã đọc
   * PATCH /users/notifications/:id/read
   */
  markAsRead: async (id: string): Promise<NotificationReadResponse> => {
    return api.patch<any>(`/users/notifications/${id}/read`).then((res) => res.data);
  },

  // ================= ADMIN APIs =================

  /**
   * Get all notifications (Admin)
   * GET /notifications/admin
   */
  getAllNotificationsAdmin: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    orderBy?: string;
    orderDirection?: string;
  }): Promise<GetAllNotificationsAdminResponse> => {
    return api.get<any>('users/notifications/admin', { params }).then((res) => res.data);
  },

  /**
   * Create system notification (Admin)
   * POST /notifications/system
   */
  createSystemNotification: async (data: CreateSystemNotificationDto): Promise<NotificationDetailResponse> => {
    return api.post<any>('users/notifications/system', data).then((res) => res.data);
  },

  /**
   * Update notification (Admin)
   * PUT /notifications/:id
   */
  updateNotification: async (id: string, data: UpdateNotificationDto): Promise<NotificationDetailResponse> => {
    return api.put<any>(`users/notifications/${id}`, data).then((res) => res.data);
  },

  /**
   * Delete notification (Admin)
   * DELETE /notifications/:id
   */
  deleteNotification: async (id: string): Promise<NotificationGrpcResponse> => {
    return api.delete<any>(`users/notifications/${id}`).then((res) => res.data);
  },

  /**
   * Get notification detail
   * GET /users/notifications/admin/:id
   */
  getNotificationDetail: async (id: string): Promise<NotificationDetailResponse> => {
    return api.get<any>(`users/notifications/admin/${id}`).then((res) => res.data);
  },

  /**
   * Get user notification detail
   * GET /users/notifications/:id
   */
  getUserNotificationDetail: async (id: string) => {
    return api.get<any>(`/users/notifications/${id}`).then((res) => res.data);
  },
};
