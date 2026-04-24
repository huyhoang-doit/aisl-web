/**
 * Task Service
 * Service layer cho maintenance tasks API: CRUD task, danh sách, chi tiết.
 * Response chuẩn { data: { tasks?, pagination? } } do service xử lý, hook dùng trực tiếp.
 */
import { api } from "@/shared/lib/api/client";
import type { TaskDetail, TaskDetailResponse, TaskListResponse, WorkLogListResponse } from "../types/task.types";
import type { Pagination } from "@/shared/types/pagination.types";

export type TaskType = "REPAIR" | "INSPECTION" | "SETUP" | "MAINTENANCE" | string;
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface CreateTaskPayload {
  incidentReportId?: string;
  assignedToId: string;
  taskType: TaskType;
  priority: TaskPriority;
  assignedByName?: string;
  techNote?: string;
  locationId?: string;
}

export interface UpdateTaskStatusPayload {
  status: string;
}

export interface TaskResponse {
  data: TaskDetail;
}

export interface TaskListParams {
  page?: number;
  limit?: number;
  status?: string;
  taskType?: string;
  priority?: string;
  assignedToId?: string;
  locationId?: string;
}

/** Backend có thể trả { statusCode, message, data } */
interface ApiListBody {
  data?: {
    tasks?: TaskDetail[];
    pagination?: Pagination;
  };
}

export const taskService = {
  /**
   * Lấy chi tiết task theo ID
   * GET /maintenance/tasks/{id}
   */
  getById: async (id: string): Promise<TaskDetailResponse> => {
    const response = await api.get<{ data?: TaskDetail }>(`/maintenance/tasks/${id}`);
    const data = response?.data;
    if (!data) throw new Error("Không có dữ liệu task");
    return { data };
  },

  /**
   * Tạo task mới (phân công nhân viên)
   * POST /maintenance/tasks
   */
  create: async (data: CreateTaskPayload): Promise<TaskResponse> => {
    return api.post<TaskResponse>("/maintenance/tasks", data);
  },

  /**
   * Lấy danh sách tasks. Luôn trả TaskListResponse để hook dùng response.data.tasks / response.data.pagination.
   * GET /maintenance/tasks
   */
  getAll: async (params?: TaskListParams): Promise<TaskListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set("page", String(params.page));
    if (params?.limit != null) searchParams.set("limit", String(params.limit));
    if (params?.status) searchParams.set("status", params.status);
    if (params?.taskType) searchParams.set("taskType", params.taskType);
    if (params?.priority) searchParams.set("priority", params.priority);
    if (params?.assignedToId) searchParams.set("assignedToId", params.assignedToId);
    if (params?.locationId) searchParams.set("locationId", params.locationId);
    const query = searchParams.toString();
    const url = query ? `/maintenance/tasks?${query}` : "/maintenance/tasks";
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
   * Lấy danh sách tasks được phân công cho tôi
   * GET /maintenance/tasks/my-tasks
   */
  getMyTasks: async (params?: TaskListParams): Promise<TaskListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set("page", String(params.page));
    if (params?.limit != null) searchParams.set("limit", String(params.limit));
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

  /**
   * Lấy danh sách work logs theo taskId
   * GET /maintenance/work-logs/task/{taskId}
   */
  getWorkLogsByTaskId: async (taskId: string): Promise<WorkLogListResponse> => {
    const response = await api.get<WorkLogListResponse>(`/maintenance/work-logs/task/${taskId}`);
    return response;
  },
};
