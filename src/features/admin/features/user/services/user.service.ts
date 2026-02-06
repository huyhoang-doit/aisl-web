/**
 * User Service
 * Service layer cho user API calls
 * Payload theo BE: keycloakUserId, email, phoneNumber, fullName, password, status, isVerified, role, notificationType
 */
import { api } from "@/shared/lib/api/client";
import type { User, UserStatus, UserStatusValue, NotificationType } from "../types/user.types";
import type { Pagination } from "@/shared/types/pagination.types";

export interface CreateUserPayload {
  /** Một số BE yêu cầu truyền kèm trong body */
  keycloakUserId?: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  password: string;
  role: string;
  status?: UserStatus;
  isVerified?: boolean;
  notificationType?: NotificationType;
}

export interface UpdateUserPayload {
  /** Một số BE yêu cầu truyền kèm trong body */
  keycloakUserId?: string;
  email?: string;
  phoneNumber?: string;
  fullName?: string;
  role?: string;
  status?: UserStatus;
  isVerified?: boolean;
  notificationType?: NotificationType;
  /** Chỉ gửi khi đổi mật khẩu */
  password?: string;
}

export interface UserResponse {
  data: {
    user: User;
  };
}

export interface UserListResponse {
  data: {
    users: User[];
    pagination: Pagination;
  };
}

export interface UserListParams {
  page?: number;
  limit?: number;
  role?: string;
  status?: UserStatusValue | string;
  search?: string;
}

export const userService = {
  /**
   * Lấy danh sách users với phân trang và filter
   */
  getAll: async (params?: UserListParams): Promise<UserListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set("page", String(params.page));
    if (params?.limit != null) searchParams.set("limit", String(params.limit));
    if (params?.role) searchParams.set("role", params.role);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.search) searchParams.set("search", params.search);

    const query = searchParams.toString();
    const url = query ? `/users?${query}` : "/users";
    return api.get<UserListResponse>(url);
  },

  /**
   * Lấy thông tin user theo keycloakUserId
   */
  getById: async (keycloakUserId: string): Promise<UserResponse> => {
    return api.get<UserResponse>(`/users/${keycloakUserId}`);
  },

  /**
   * Lấy chi tiết user (gọi API detail) – alias của getById
   */
  getDetail: async (keycloakUserId: string): Promise<UserResponse> => {
    return api.get<UserResponse>(`/users/${keycloakUserId}`);
  },

  /**
   * Tạo user mới
   */
  create: async (data: CreateUserPayload): Promise<UserResponse> => {
    return api.post<UserResponse>("/users", data);
  },

  /**
   * Cập nhật user
   */
  update: async (keycloakUserId: string, data: UpdateUserPayload): Promise<UserResponse> => {
    return api.put<UserResponse>(`/users/${keycloakUserId}`, data);
  },

  /**
   * Xóa user
   */
  delete: async (keycloakUserId: string): Promise<void> => {
    return api.delete<void>(`/users/${keycloakUserId}`);
  },
};
