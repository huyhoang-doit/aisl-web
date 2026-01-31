/**
 * Locker Service
 * Service layer cho locker API calls
 */
import { api } from '@/shared/lib/api/client';
import type { Locker } from '../types/locker.types';
import type { Pagination } from '@/shared/types/pagination.types';

export type LockerStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';

export interface CreateLockerPayload {
  cabinetId: string;
  sizeId: string;
  row: number;
  column: number;
  status: LockerStatus;
  isActive: boolean;
}

export interface UpdateLockerPayload extends CreateLockerPayload {}

export interface LockerResponse {
  data: Locker;
}

export interface LockerListResponse {
  data: {
    lockers: Locker[];
    pagination: Pagination;
  };
}

export interface LockerListParams {
  page?: number;
  limit?: number;
  cabinetId?: string;
  status?: LockerStatus;
  isActive?: boolean;
  search?: string;
}

export const lockerService = {
  /**
   * Lấy danh sách lockers với phân trang và filter
   */
  getAll: async (params?: LockerListParams): Promise<LockerListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set('page', String(params.page));
    if (params?.limit != null) searchParams.set('limit', String(params.limit));
    if (params?.cabinetId) searchParams.set('cabinetId', params.cabinetId);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.isActive !== undefined) searchParams.set('isActive', String(params.isActive));
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString();
    const url = query ? `/lockers?${query}` : '/lockers';
    return api.get<LockerListResponse>(url);
  },

  /**
   * Lấy thông tin locker theo ID
   */
  getById: async (id: string): Promise<LockerResponse> => {
    return api.get<LockerResponse>(`/lockers/${id}`);
  },

  /**
   * Tạo locker mới
   */
  create: async (data: CreateLockerPayload): Promise<LockerResponse> => {
    return api.post<LockerResponse>('/lockers', data);
  },

  /**
   * Cập nhật locker
   */
  update: async (id: string, data: UpdateLockerPayload): Promise<LockerResponse> => {
    return api.put<LockerResponse>(`/lockers/${id}`, data);
  },

  /**
   * Xóa locker
   */
  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/lockers/${id}`);
  },
};
