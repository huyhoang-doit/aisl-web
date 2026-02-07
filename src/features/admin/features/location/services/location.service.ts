/**
 * Location Service
 * Service layer cho location API calls
 */
import { api } from '@/shared/lib/api/client';
import type { Location } from '../types/location.types';
import type { Pagination } from '@/shared/types/pagination.types';
import type { Cabinet } from '../../cabinet/types/cabinet.types';

export interface CreateLocationPayload {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description?: string;
  isActive: boolean;
  plannedCabinetQuantity: number;
  plannedLockerQuantity: number;
}

export interface UpdateLocationPayload extends CreateLocationPayload {}

export interface LocationResponse {
  data: Location;
}

export interface LocationListResponse {
  data: {
    locations: Location[];
    pagination: Pagination;
  };
}

export interface LocationListParams {
  page?: number;
  limit?: number;
  search?: string;
  name?: string;
  address?: string;
  isActive?: boolean;
}

export interface GetCabinetLocationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CabinetLocationListResponse {
  data: {
    cabinets: Cabinet[];
    pagination: Pagination;
  };
}

export const locationService = {
  /**
   * Lấy danh sách locations với phân trang và filter
   */
  getAll: async (params?: LocationListParams): Promise<LocationListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set('page', String(params.page));
    if (params?.limit != null) searchParams.set('limit', String(params.limit));
    if (params?.search) searchParams.set('search', params.search);
    if (params?.name) searchParams.set('name', params.name);
    if (params?.address) searchParams.set('address', params.address);
    if (params?.isActive !== undefined) searchParams.set('isActive', String(params.isActive));

    const query = searchParams.toString();
    const url = query ? `/locations?${query}` : '/locations';
    return api.get<LocationListResponse>(url);
  },

  /**
   * Lấy thông tin location theo ID
   */
  getById: async (id: string): Promise<LocationResponse> => {
    return api.get<LocationResponse>(`/locations/${id}`);
  },

  /**
   * Tạo location mới
   */
  create: async (data: CreateLocationPayload): Promise<LocationResponse> => {
    return api.post<LocationResponse>('/locations', data);
  },

  /**
   * Cập nhật location
   */
  update: async (id: string, data: UpdateLocationPayload): Promise<LocationResponse> => {
    return api.put<LocationResponse>(`/locations/${id}`, data);
  },

  /**
   * Xóa location
   */
  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/locations/${id}`);
  },

  /**
   * Lấy danh sách cabinet theo location ID (locations/{id}/cabinets)
   */
  getCabinetLocation: async (
    locationId: string,
    params?: GetCabinetLocationParams
  ): Promise<CabinetLocationListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set('page', String(params.page));
    if (params?.limit != null) searchParams.set('limit', String(params.limit));
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString();
    const url = query
      ? `/locations/${locationId}/cabinets?${query}`
      : `/locations/${locationId}/cabinets`;
    return api.get<CabinetLocationListResponse>(url);
  },
};
