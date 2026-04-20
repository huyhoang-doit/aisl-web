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
  roles: string[];
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
  roles?: string[];
  status?: UserStatus;
  isVerified?: boolean;
  notificationType?: NotificationType;
  /** Chỉ gửi khi đổi mật khẩu */
  password?: string;
  /** Avatar – gửi trong field "files", dùng multipart/form-data */
  file?: File;
}

export interface UserResponse {
  data: {
    user: User;
  };
}

export interface UserListResponse {
  data: {
    items: User[];
    pagination: Pagination;
  };
}

export interface UserListParams {
  page?: number;
  limit?: number;
  roles?: string[];
  status?: UserStatusValue | string;
  search?: string;
  orderBy?: string;
  orderDirection?: "ASC" | "DESC";
}

export interface Role {
  id: string;
  name: string;
}

export interface RolesResponse {
  data: {
    roles: Role[];
  };
}

export const userService = {
  /**
   * Lấy danh sách users với phân trang và filter
   */
  getAll: async (params?: UserListParams): Promise<UserListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set("page", String(params.page));
    if (params?.limit != null) searchParams.set("limit", String(params.limit));
    if (params?.roles && params.roles.length > 0) {
      params.roles.forEach(role => searchParams.append("roles", role));
    }
    if (params?.status) searchParams.set("status", params.status);
    if (params?.search) searchParams.set("search", params.search);
    if (params?.orderBy) searchParams.set("orderBy", params.orderBy);
    if (params?.orderDirection) searchParams.set("orderDirection", params.orderDirection);

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
   * Cập nhật user.
   * Có file (avatar) → multipart/form-data, field "files".
   * Không có file → JSON.
   */
  update: async (keycloakUserId: string, data: UpdateUserPayload): Promise<UserResponse> => {
    const { file, ...rest } = data;
    if (file) {
      const formData = new FormData();
      Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      formData.append("files", file);
      return api.put<UserResponse>(`/users/${keycloakUserId}`, formData);
    }
    return api.put<UserResponse>(`/users/${keycloakUserId}`, rest);
  },

  /**
   * Xóa user
   */
  delete: async (keycloakUserId: string): Promise<void> => {
    return api.delete<void>(`/users/${keycloakUserId}`);
  },

  /**
   * Cập nhật trạng thái Courier
   */
  updateCourierStatus: async (
    keycloakUserId: string,
    data: { status: "NONE" | "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED" | "BLACKLISTED"; reason?: string }
  ): Promise<UserResponse> => {
    return api.put<UserResponse>(`/users/${keycloakUserId}/courier-status`, data);
  },

  /**
   * Lấy danh sách vai trò (roles)
   */
  getRoles: async (): Promise<RolesResponse> => {
    return api.get<RolesResponse>("/roles");
  },
};
