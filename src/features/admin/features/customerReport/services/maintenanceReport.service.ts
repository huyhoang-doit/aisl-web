/**
 * Maintenance Report Service
 * Service layer cho maintenance reports API
 */
import { api } from '@/shared/lib/api/client';
import type { CustomerReport } from '../types/customerReport.types';
import type { Pagination } from '@/shared/types/pagination.types';

/** Payload tạo báo cáo – gửi dạng multipart/form-data */
export interface CreateReportPayload {
  lockerId: string;
  cabinetId: string;
  title: string;
  description: string;
  photos?: File[];
}

export interface UpdateReportStatusPayload {
  status: string;
}

export interface ReportResponse {
  data: CustomerReport;
}

export interface ReportListResponse {
  data: {
    reports?: CustomerReport[];
    pagination?: Pagination;
  };
}

export interface ReportListParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  orderBy?: string;
  orderDirection?: "ASC" | "DESC";
}

export const maintenanceReportService = {
  /**
   * Lấy danh sách reports (khách hàng)
   * GET /maintenance/reports
   */
  getAll: async (params?: ReportListParams): Promise<ReportListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set('page', String(params.page));
    if (params?.limit != null) searchParams.set('limit', String(params.limit));
    if (params?.status) searchParams.set('status', params.status);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.orderBy) searchParams.set('orderBy', params.orderBy);
    if (params?.orderDirection) searchParams.set('orderDirection', params.orderDirection);

    const query = searchParams.toString();
    const url = query ? `/maintenance/reports?${query}` : '/maintenance/reports';
    const response = await api.get<ReportListResponse>(url);
    return response;
  },

  /**
   * Lấy danh sách reports của tôi
   * GET /maintenance/reports/my-reports
   */
  getMyReports: async (params?: ReportListParams): Promise<ReportListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set('page', String(params.page));
    if (params?.limit != null) searchParams.set('limit', String(params.limit));

    const query = searchParams.toString();
    const url = query ? `/maintenance/reports/my-reports?${query}` : '/maintenance/reports/my-reports';
    return api.get<ReportListResponse>(url);
  },

  /**
   * Lấy report theo ID
   * GET /maintenance/reports/{id}
   */
  getById: async (id: string): Promise<ReportResponse> => {
    return api.get<ReportResponse>(`/maintenance/reports/${id}`);
  },

  /**
   * Tạo report mới (multipart/form-data).
   * Body: lockerId, cabinetId, title, description, photos (array – nhiều file cùng key "photos").
   * POST /maintenance/reports
   */
  create: async (data: CreateReportPayload): Promise<ReportResponse> => {
    const formData = new FormData();
    formData.append('lockerId', data.lockerId);
    formData.append('cabinetId', data.cabinetId);
    formData.append('title', data.title);
    formData.append('description', data.description);
    if (data.photos?.length) {
      data.photos.forEach((file) => {
        formData.append('photos', file);
      });
    }

    return api.post<ReportResponse>('/maintenance/reports', formData);
  },

  /**
   * Cập nhật trạng thái report
   * PATCH /maintenance/reports/{id}/status
   */
  updateStatus: async (id: string, data: UpdateReportStatusPayload): Promise<ReportResponse> => {
    return api.patch<ReportResponse>(`/maintenance/reports/${id}/status`, data);
  },

  /**
   * Xóa report
   * DELETE /maintenance/reports/{id}
   */
  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/maintenance/reports/${id}`);
  },
};
