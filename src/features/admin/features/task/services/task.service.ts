/**
 * Task Service
 * Service layer cho task API (chi tiết task, dùng cho modal)
 */
import { api } from "@/shared/lib/api/client";
import type { TaskDetail, TaskDetailResponse } from "../types/task.types";

export const taskService = {
  /**
   * Lấy chi tiết task theo ID
   * GET /maintenance/tasks/{id}
   */
  getById: async (id: string): Promise<TaskDetailResponse> => {
    const response = await api.get<{ statusCode?: number; message?: string; data: TaskDetail }>(
      `/maintenance/tasks/${id}`
    );
    const r = response as { data?: TaskDetail };
    const data = r?.data;
    if (!data) throw new Error("Không có dữ liệu task");
    return { data };
  },
};
