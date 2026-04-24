/**
 * Plan Service
 * Service layer cho plan API calls
 */
import { api } from '@/shared/lib/api/client';
import type { Plan } from '../types/plan.types';
import type { Pagination } from '@/shared/types/pagination.types';

export type PlanStatus = 'ACTIVE' | 'INACTIVE';

export interface CreatePlanPayload {
  name: string;
  maxLockers: number;
  price: number;
  fixedLocker: number;
  discountLockerRental: number;
  discountFixedLockerRental: number;
  description?: string;
  status: PlanStatus;
  isFreeDefault: boolean;
  pricingIds: string[];
}

export interface UpdatePlanPayload extends Partial<CreatePlanPayload> {}

export interface PlanResponse {
  data: Plan;
}

export interface PlanListResponse {
  data: {
    plans: Plan[];
    pagination: Pagination;
  };
}

export interface PlanListParams {
  page?: number;
  limit?: number;
  status?: PlanStatus;
  search?: string;
}

export const planService = {
  /**
   * Lấy danh sách plans với phân trang và filter
   */
  getAll: async (params?: PlanListParams): Promise<PlanListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set('page', String(params.page));
    if (params?.limit != null) searchParams.set('limit', String(params.limit));
    if (params?.status) searchParams.set('status', params.status);
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString();
    const url = query ? `/plans?${query}` : '/plans';
    return api.get<PlanListResponse>(url);
  },

  /**
   * Lấy thông tin plan theo ID
   */
  getById: async (id: string): Promise<PlanResponse> => {
    return api.get<PlanResponse>(`/plans/${id}`);
  },

  /**
   * Tạo plan mới
   */
  create: async (data: CreatePlanPayload): Promise<PlanResponse> => {
    return api.post<PlanResponse>('/plans', data);
  },

  /**
   * Cập nhật plan
   */
  update: async (id: string, data: UpdatePlanPayload): Promise<PlanResponse> => {
    return api.put<PlanResponse>(`/plans/${id}`, data);
  },

  /**
   * Xóa plan
   */
  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/plans/${id}`);
  },
};
