/**
 * My Task Service - API cho technician: danh sách task được assign, chi tiết, cập nhật status.
 */
import { api } from "@/shared/lib/api/client";
import type { TaskDetail, TaskDetailResponse, TaskListResponse } from "../types/myTask.types";
import type { Pagination } from "@/shared/types/pagination.types";

export interface UpdateTaskStatusPayload {
  status: string;
  techNote?: string;
}

export interface TaskListParams {
  page?: number;
  limit?: number;
  status?: string;
}

interface ApiListBody {
  data?: {
    tasks?: TaskDetail[];
    pagination?: Pagination;
  };
}

export const myTaskService = {
  /**
   * Lấy danh sách task được assign cho technician đang đăng nhập
   * GET /maintenance/tasks/my-tasks
   */
  getMyTasks: async (params?: TaskListParams): Promise<TaskListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set("page", String(params.page));
    if (params?.limit != null) searchParams.set("limit", String(params.limit));
    if (params?.status) searchParams.set("status", params.status);
    const query = searchParams.toString();
    const url = query ? `/maintenance/tasks/my-tasks?${query}` : "/maintenance/tasks/my-tasks";
    const res = await api.get<ApiListBody>(url);
    const data = res?.data;
    return {
      data: {
        tasks: data?.tasks ?? [],
        pagination: data?.pagination ?? { page: 1, limit: 10, total: 0 },
      },
    };
  },

  /**
   * Chi tiết task
   * GET /maintenance/tasks/:id
   */
  getById: async (id: string): Promise<TaskDetailResponse> => {
    const response = await api.get<{ data?: TaskDetail }>(`/maintenance/tasks/${id}`);
    const data = response?.data;
    if (!data) throw new Error("Không có dữ liệu task");
    return { data };
  },

  /**
   * Cập nhật trạng thái task (technician)
   * PATCH /maintenance/tasks/:id/status
   */
  updateStatus: async (
    id: string,
    payload: UpdateTaskStatusPayload
  ): Promise<TaskDetailResponse> => {
    return api.patch<TaskDetailResponse>(`/maintenance/tasks/${id}/status`, payload);
  },
};
