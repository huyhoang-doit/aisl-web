/**
 * Maintenance Task Service
 * Service layer cho maintenance tasks API (phân công nhân viên)
 */
import { api } from '@/shared/lib/api/client';
import type { TechnicalStaffReport } from '../types/customerReport.types';
import type { Pagination } from '@/shared/types/pagination.types';

export type TaskType = 'REPAIR' | 'INSPECTION' | 'CLEANING' | string;
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface CreateTaskPayload {
  incidentReportId: string;
  assignedToId: string;
  taskType: TaskType;
  priority: TaskPriority;
}

export interface UpdateTaskStatusPayload {
  status: string;
}

export interface TaskResponse {
  data: TechnicalStaffReport & { id: string };
}

export interface TaskListResponse {
  data: {
    tasks?: Array<TechnicalStaffReport & { id: string }>;
    pagination?: Pagination;
  };
}

export interface TaskListParams {
  page?: number;
  limit?: number;
  status?: string;
}

export const maintenanceTaskService = {
  /**
   * Tạo task mới (phân công nhân viên)
   * POST /maintenance/tasks
   */
  create: async (data: CreateTaskPayload): Promise<TaskResponse> => {
    return api.post<TaskResponse>('/maintenance/tasks', data);
  },

  /**
   * Lấy danh sách tasks
   * GET /maintenance/tasks
   */
  getAll: async (params?: TaskListParams): Promise<TaskListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set('page', String(params.page));
    if (params?.limit != null) searchParams.set('limit', String(params.limit));
    if (params?.status) searchParams.set('status', params.status);


    const query = searchParams.toString();
    const url = query ? `/maintenance/tasks?${query}` : '/maintenance/tasks';
    return api.get<TaskListResponse>(url);
  },

  /**
   * Lấy danh sách tasks được phân công cho tôi
   * GET /maintenance/tasks/my-tasks
   */
  getMyTasks: async (params?: TaskListParams): Promise<TaskListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set('page', String(params.page));
    if (params?.limit != null) searchParams.set('limit', String(params.limit));

    const query = searchParams.toString();
    const url = query ? `/maintenance/tasks/my-tasks?${query}` : '/maintenance/tasks/my-tasks';
    return api.get<TaskListResponse>(url);
  },

  /**
   * Lấy task theo ID
   * GET /maintenance/tasks/{id}
   */
  getById: async (id: string): Promise<TaskResponse> => {
    return api.get<TaskResponse>(`/maintenance/tasks/${id}`);
  },

  /**
   * Cập nhật trạng thái task
   * PATCH /maintenance/tasks/{id}/status
   */
  updateStatus: async (id: string, data: UpdateTaskStatusPayload): Promise<TaskResponse> => {
    return api.patch<TaskResponse>(`/maintenance/tasks/${id}/status`, data);
  },

  /**
   * Xóa task
   * DELETE /maintenance/tasks/{id}
   */
  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/maintenance/tasks/${id}`);
  },
};
