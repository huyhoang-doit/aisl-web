import { api } from "@/shared/lib/api/client";
import type { Pagination } from "@/shared/types/pagination.types";
import type {
  StaffApplication,
  StaffReviewPayload,
} from "../types/staffApplication.types";

export interface StaffApplicationListResponse {
  data: {
    applications?: StaffApplication[];
    staffApplications?: StaffApplication[];
    pagination: Pagination;
  };
}

export interface StaffApplicationDetailResponse {
  data: StaffApplication;
}

export interface StaffApplicationListParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  orderBy?: string;
  orderDirection?: "ASC" | "DESC";
}

const BASE = "/staff-applications";

export const staffApplicationService = {
  getAll: async (
    params?: StaffApplicationListParams
  ): Promise<StaffApplicationListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set("page", String(params.page));
    if (params?.limit != null) searchParams.set("limit", String(params.limit));
    if (params?.status) searchParams.set("status", params.status);
    if (params?.search) searchParams.set("search", params.search);
    if (params?.orderBy) searchParams.set("orderBy", params.orderBy);
    if (params?.orderDirection) {
      searchParams.set("orderDirection", params.orderDirection);
    }

    const query = searchParams.toString();
    const url = query ? `${BASE}?${query}` : BASE;
    return api.get<StaffApplicationListResponse>(url);
  },

  getById: async (id: string): Promise<StaffApplicationDetailResponse> => {
    return api.get<StaffApplicationDetailResponse>(`${BASE}/${id}`);
  },

  getByUserId: async (userId: string): Promise<StaffApplicationDetailResponse> => {
    return api.get<StaffApplicationDetailResponse>(`${BASE}/user/${userId}`);
  },

  approve: async (
    id: string,
    payload: StaffReviewPayload = {}
  ): Promise<{ data?: unknown }> => {
    return api.put<{ data?: unknown }>(`${BASE}/${id}/approve`, payload);
  },

  reject: async (
    id: string,
    payload: StaffReviewPayload = {}
  ): Promise<{ data?: unknown }> => {
    return api.put<{ data?: unknown }>(`${BASE}/${id}/reject`, payload);
  },
};
