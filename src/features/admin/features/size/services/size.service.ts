/**
 * Size Service
 * Service layer cho size API calls
 */
import { api } from '@/shared/lib/api/client';
import type { Size } from '../types/size.types';
import type { Pagination } from '@/shared/types/pagination.types';

export interface CreateSizePayload {
  name: string;
  width: number;
  height: number;
  depth: number;
}

export interface UpdateSizePayload extends CreateSizePayload {}

export interface SizeResponse {
  data: Size;
}

export interface SizeListResponse {
  data: {
    sizes: Size[];
    pagination: Pagination;
  };
}

export const sizeService = {
  /**
   * Lấy danh sách tất cả sizes
   */
  getAll: async (): Promise<SizeListResponse> => {
    return api.get<SizeListResponse>('/sizes');
  },

  /**
   * Lấy thông tin size theo ID
   */
  getById: async (id: string): Promise<SizeResponse> => {
    return api.get<SizeResponse>(`/sizes/${id}`);
  },

  /**
   * Tạo size mới
   */
  create: async (data: CreateSizePayload): Promise<SizeResponse> => {
    return api.post<SizeResponse>('/sizes', data);
  },

  /**
   * Cập nhật size
   */
  update: async (id: string, data: UpdateSizePayload): Promise<SizeResponse> => {
    return api.put<SizeResponse>(`/sizes/${id}`, data);
  },

  /**
   * Xóa size
   */
  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/sizes/${id}`);
  },
};
