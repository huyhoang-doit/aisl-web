/**
 * Staff Service
 * Service layer cho staff/users API - lấy danh sách nhân viên kỹ thuật
 */
import { api } from '@/shared/lib/api/client';
import type { Staff } from '../types/staff.types';

export interface StaffListResponse {
  data: {
    users?: Staff[];
    staffs?: Staff[];
    pagination?: { page: number; limit: number; total: number };
  };
}

export interface StaffListParams {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
}

export const staffService = {
  /**
   * Lấy danh sách staff/users
   * Có thể dùng GET /users?role=TECHNICAL_STAFF hoặc GET /staff tùy backend
   */
  getAll: async (params?: StaffListParams): Promise<StaffListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set('page', String(params.page));
    if (params?.limit != null) searchParams.set('limit', String(params.limit));
    if (params?.role) searchParams.set('role', params.role);
    if (params?.status) searchParams.set('status', params.status);

    const query = searchParams.toString();
    const url = query ? `/users?${query}` : '/users';
    const response = await api.get<StaffListResponse>(url);
    return response;
  },

  /**
   * Lấy danh sách nhân viên kỹ thuật (technical staff)
   */
  getTechnicalStaff: async (params?: StaffListParams): Promise<Staff[]> => {
    const response = await staffService.getAll({
      ...params,
      role: 'TECHNICAL_STAFF',
      status: 'active',
    });
    const data = response.data;
    const list = data?.users ?? data?.staffs ?? [];
    return Array.isArray(list) ? list : [];
  },
};
