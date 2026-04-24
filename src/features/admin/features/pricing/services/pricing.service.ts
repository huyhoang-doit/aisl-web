/**
 * Pricing Service
 * Service layer cho pricing API calls
 * Payload theo BE: name, blockDuration, feePerBlock, lateFeePerBlock, orderType, description, gracePeriod
 */
import { api } from "@/shared/lib/api/client";
import type { Pricing } from "../types/pricing.types";
import type { Pagination } from "@/shared/types/pagination.types";

export type OrderType = "LOGISTICS" | "PERSONAL_RENTAL";

export interface CreatePricingPayload {
  name: string;
  blockDuration: number;
  blockUnit: string;
  feePerBlock: number;
  lateFeePerBlock: number;
  orderType: OrderType;
  description?: string;
  gracePeriod: number;
  cancellationFeeRate?: number;
}

export interface UpdatePricingPayload {
  name?: string;
  blockDuration?: number;
  blockUnit?: string;
  feePerBlock?: number;
  lateFeePerBlock?: number;
  orderType?: OrderType;
  description?: string;
  gracePeriod?: number;
  cancellationFeeRate?: number;
}

/** Response get-by-id / getDetail / create / update: data là pricing  */
export interface PricingResponse {
  data: Pricing;
}

export interface PricingListResponse {
  data: {
    pricings: Pricing[];
    pagination: Pagination;
  };
}

export interface PricingListParams {
  page?: number;
  limit?: number;
  orderType?: OrderType | string;
  search?: string;
  orderBy?: string;
  orderDirection?: "ASC" | "DESC";
}

export const pricingService = {
  getAll: async (params?: PricingListParams): Promise<PricingListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set("page", String(params.page));
    if (params?.limit != null) searchParams.set("limit", String(params.limit));
    if (params?.orderType) searchParams.set("orderType", params.orderType);
    if (params?.search) searchParams.set("search", params.search);
    if (params?.orderBy) searchParams.set("orderBy", params.orderBy);
    if (params?.orderDirection) searchParams.set("orderDirection", params.orderDirection);

    const query = searchParams.toString();
    const url = query ? `/pricings?${query}` : "/pricings";
    return api.get<PricingListResponse>(url);
  },

  getById: async (id: string): Promise<PricingResponse> => {
    return api.get<PricingResponse>(`/pricings/${id}`);
  },

  getDetail: async (id: string): Promise<PricingResponse> => {
    return api.get<PricingResponse>(`/pricings/${id}`);
  },

  create: async (data: CreatePricingPayload): Promise<PricingResponse> => {
    return api.post<PricingResponse>("/pricings", data);
  },

  update: async (id: string, data: UpdatePricingPayload): Promise<PricingResponse> => {
    return api.put<PricingResponse>(`/pricings/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/pricings/${id}`);
  },
};
