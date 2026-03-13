/**
 * Subscription Service
 * Service layer cho subscription API calls
 * Đăng ký dịch vụ: user đăng ký gói plan
 */
import { api } from "@/shared/lib/api/client";
import type { Subscription, SubscriptionStatusValue } from "../types/subscription.types";
import type { Pagination } from "@/shared/types/pagination.types";

export interface CreateSubscriptionPayload {
  userId: string;
  planId: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface UpdateSubscriptionPayload {
  status?: string;
  startDate?: string;
  endDate?: string;
}

/** Response get-by-id / getDetail / create / update: data là subscription trực tiếp */
export interface SubscriptionResponse {
  data: Subscription;
}

export interface SubscriptionListResponse {
  data: {
    subscriptions: Subscription[];
    pagination: Pagination;
  };
}

export interface SubscriptionListParams {
  page?: number;
  limit?: number;
  userId?: string;
  planId?: string;
  status?: SubscriptionStatusValue | string;
  search?: string;
  orderBy?: string;
  orderDirection?: "ASC" | "DESC";
}

export const subscriptionService = {
  /**
   * Lấy danh sách đăng ký dịch vụ với phân trang và filter
   */
  getAll: async (params?: SubscriptionListParams): Promise<SubscriptionListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set("page", String(params.page));
    if (params?.limit != null) searchParams.set("limit", String(params.limit));
    if (params?.userId) searchParams.set("userId", params.userId);
    if (params?.planId) searchParams.set("planId", params.planId);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.search) searchParams.set("search", params.search);
    if (params?.orderBy) searchParams.set("orderBy", params.orderBy);
    if (params?.orderDirection) searchParams.set("orderDirection", params.orderDirection);

    const query = searchParams.toString();
    const url = query ? `/subscriptions?${query}` : "/subscriptions";
    return api.get<SubscriptionListResponse>(url);
  },

  /**
   * Lấy thông tin đăng ký theo ID
   */
  getById: async (id: string): Promise<SubscriptionResponse> => {
    return api.get<SubscriptionResponse>(`/subscriptions/${id}`);
  },

  /**
   * Lấy chi tiết đăng ký
   */
  getDetail: async (id: string): Promise<SubscriptionResponse> => {
    return api.get<SubscriptionResponse>(`/subscriptions/${id}`);
  },

  /**
   * Tạo đăng ký mới
   */
  create: async (data: CreateSubscriptionPayload): Promise<SubscriptionResponse> => {
    return api.post<SubscriptionResponse>("/subscriptions", data);
  },

  /**
   * Cập nhật đăng ký
   */
  update: async (id: string, data: UpdateSubscriptionPayload): Promise<SubscriptionResponse> => {
    return api.put<SubscriptionResponse>(`/subscriptions/${id}`, data);
  },

  /**
   * Hủy đăng ký
   */
  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/subscriptions/${id}`);
  },
};
