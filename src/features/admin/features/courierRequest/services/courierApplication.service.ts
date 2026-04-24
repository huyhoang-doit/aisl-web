/**
 * Courier Application Service
 * Gọi API quản lý đơn đăng ký người chuyển phát:
 * GET /courier-applications, GET /courier-applications/{id}, GET /courier-applications/user/{userId}
 * PUT /courier-applications/{id}/approve, PUT /courier-applications/{id}/reject
 */
import { api } from "@/shared/lib/api/client";
import type { CourierApplication, CourierReviewPayload } from "../types/courierRequest.types";
import type { Pagination } from "@/shared/types/pagination.types";

export interface CourierApplicationListResponse {
  data: {
    applications: CourierApplication[];
    pagination: Pagination;
  };
}

export interface CourierApplicationDetailResponse {
  data: CourierApplication;
}

export interface CourierApplicationListParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  orderBy?: string;
  orderDirection?: "ASC" | "DESC";
}

const BASE = "/courier-applications";

export const courierApplicationService = {
  /**
   * List courier applications with pagination
   */
  getAll: async (params?: CourierApplicationListParams): Promise<CourierApplicationListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set("page", String(params.page));
    if (params?.limit != null) searchParams.set("limit", String(params.limit));
    if (params?.status) searchParams.set("status", params.status);
    if (params?.search) searchParams.set("search", params.search);
    if (params?.orderBy) searchParams.set("orderBy", params.orderBy);
    if (params?.orderDirection) searchParams.set("orderDirection", params.orderDirection);

    const query = searchParams.toString();
    const url = query ? `${BASE}?${query}` : BASE;
    return api.get<CourierApplicationListResponse>(url);
  },

  /**
   * Get courier application by ID
   */
  getById: async (id: string): Promise<CourierApplicationDetailResponse> => {
    return api.get<CourierApplicationDetailResponse>(`${BASE}/${id}`);
  },

  /**
   * Get courier application by user ID
   */
  getByUserId: async (userId: string): Promise<CourierApplicationDetailResponse> => {
    return api.get<CourierApplicationDetailResponse>(`${BASE}/user/${userId}`);
  },

  /**
   * Admin approve courier application
   */
  approve: async (id: string, payload: CourierReviewPayload): Promise<{ data?: unknown }> => {
    return api.put<{ data?: unknown }>(`${BASE}/${id}/approve`, payload);
  },

  /**
   * Admin reject courier application
   */
  reject: async (id: string, payload: CourierReviewPayload): Promise<{ data?: unknown }> => {
    return api.put<{ data?: unknown }>(`${BASE}/${id}/reject`, payload);
  },
};
