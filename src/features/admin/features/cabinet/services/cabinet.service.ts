/**
 * Cabinet Service
 * Service layer cho cabinet API calls
 */
import { api } from '@/shared/lib/api/client';
import type { Cabinet } from '../types/cabinet.types';
import type { Pagination } from '@/shared/types/pagination.types';

export interface CreateCabinetPayload {
  locationId?: string;
  name: string;
  macAddress: string;
  ipAddress: string;
  firmwareVersion: string;
  totalRows: number;
  totalColumns: number;
}

export interface UpdateCabinetPayload extends CreateCabinetPayload {}

export interface CabinetResponse {
  data: Cabinet;
}

export interface CabinetListResponse {
  data: {
    cabinets: Cabinet[];
    pagination: Pagination;
  };
}

export interface CabinetListParams {
  page?: number;
  limit?: number;
  locationId?: string;
  name?: string;
  macAddress?: string;
}

export const cabinetService = {
  /**
   * Lấy danh sách cabinets với phân trang và filter
   * Query: page, limit, locationId, name, macAddress
   */
  getAll: async (params?: CabinetListParams): Promise<CabinetListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set('page', String(params.page));
    if (params?.limit != null) searchParams.set('limit', String(params.limit));
    if (params?.locationId) searchParams.set('locationId', params.locationId);
    if (params?.name) searchParams.set('name', params.name);
    if (params?.macAddress) searchParams.set('macAddress', params.macAddress);

    const query = searchParams.toString();
    const url = query ? `/cabinets?${query}` : '/cabinets';
    return api.get<CabinetListResponse>(url);
  },

  /**
   * Gán danh sách locker vào cabinet
   */
  assignLockers: async (id: string, lockerIds: string[]): Promise<void> => {
    return api.post<void>(`/cabinets/${id}/assign-lockers`, { lockerIds });
  },

  /**
   * Bỏ gán danh sách locker khỏi cabinet
   */
  unassignLockers: async (id: string, lockerIds: string[]): Promise<void> => {
    return api.post<void>(`/cabinets/${id}/unassign-lockers`, { lockerIds });
  },

  /**
   * Lấy thông tin cabinet theo ID
   */
  getById: async (id: string): Promise<CabinetResponse> => {
    return api.get<CabinetResponse>(`/cabinets/${id}`);
  },

  /**
   * Tạo cabinet mới
   */
  create: async (data: CreateCabinetPayload): Promise<CabinetResponse> => {
    return api.post<CabinetResponse>('/cabinets', data);
  },

  /**
   * Cập nhật cabinet
   */
  update: async (id: string, data: UpdateCabinetPayload): Promise<CabinetResponse> => {
    return api.put<CabinetResponse>(`/cabinets/${id}`, data);
  },

  /**
   * Xóa cabinet
   */
  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/cabinets/${id}`);
  },
};
