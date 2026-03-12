/**
 * Work Log Service - API cho technician: tạo, xem, cập nhật, hoàn thành work log (multipart/form-data).
 */
import { api } from "@/shared/lib/api/client";
import type { WorkLogDetail, WorkLogDetailResponse } from "../types/myTask.types";

export interface WorkLogListResponse {
  data: WorkLogDetail[];
}

export interface CreateWorkLogPayload {
  technicalTaskId: string;
  workDescription: string;
  beforePhotos?: File[];
}

export interface UpdateWorkLogPayload {
  workDescription?: string;
  partsReplaced?: string;
  afterPhotos?: File[];
  techNote?: string;
}

export interface CompleteWorkLogPayload {
  afterPhotos?: File[];
  techNote?: string;
}

function buildWorkLogFormData(fields: Record<string, string | File[] | undefined>): FormData {
  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      value.forEach((file) => form.append(key, file));
    } else {
      form.append(key, value);
    }
  });
  return form;
}

export const workLogService = {
  /**
   * Tạo work log (bắt đầu công việc) - upload ảnh before
   * POST /maintenance/tasks/:taskId/work-logs
   */
  create: async (_taskId: string, payload: CreateWorkLogPayload): Promise<WorkLogDetailResponse> => {
    const form = new FormData();
    form.append("technicalTaskId", payload.technicalTaskId);
    form.append("workDescription", payload.workDescription);
    if (payload.beforePhotos?.length) {
      payload.beforePhotos.forEach((f) => form.append("beforePhotos", f));
    }
    const res = await api.post<WorkLogDetail | WorkLogDetailResponse>(
      `/maintenance/work-logs`,
      form
    );
    const data = res && typeof res === "object" && "data" in res ? (res as WorkLogDetailResponse).data : (res as WorkLogDetail);
    return { data };
  },

  /**
   * Danh sách work log theo task
   * GET /maintenance/work-logs/task/:taskId
   * Response: { data: { workLogs: WorkLogDetail[] } }
   */
  getByTaskId: async (taskId: string): Promise<WorkLogDetail[]> => {
    const res = await api.get<{ data: { workLogs?: WorkLogDetail[] } } | WorkLogDetail[]>(
      `/maintenance/work-logs/task/${taskId}`
    );
    if (Array.isArray(res)) return res;
    const data = (res as { data?: { workLogs?: WorkLogDetail[] } }).data;
    return data?.workLogs ?? [];
  },

  /**
   * Chi tiết work log
   * GET /maintenance/work-logs/:id
   */
  getById: async (id: string): Promise<WorkLogDetailResponse> => {
    const res = await api.get<{ data?: WorkLogDetail }>(`/maintenance/work-logs/${id}`);
    const data = res?.data;
    if (!data) throw new Error("Không có dữ liệu work log");
    return { data };
  },

  /**
   * Cập nhật work log - upload ảnh after
   * PATCH /maintenance/work-logs/:id
   */
  update: async (
    id: string,
    payload: UpdateWorkLogPayload
  ): Promise<WorkLogDetailResponse> => {
    const form = buildWorkLogFormData({
      workDescription: payload.workDescription,
      partsReplaced: payload.partsReplaced,
      techNote: payload.techNote,
      afterPhotos: payload.afterPhotos,
    });
    const res = await api.patch<WorkLogDetail | WorkLogDetailResponse>(`/maintenance/work-logs/${id}`, form);
    const data = res && typeof res === "object" && "data" in res ? (res as WorkLogDetailResponse).data : (res as WorkLogDetail);
    return { data };
  },

  /**
   * Hoàn thành work log - ảnh kết quả cuối, ghi chú
   * PATCH /maintenance/work-logs/:id/complete
   */
  complete: async (
    id: string,
    payload: CompleteWorkLogPayload
  ): Promise<WorkLogDetailResponse> => {
    const form = buildWorkLogFormData({
      techNote: payload.techNote,
      afterPhotos: payload.afterPhotos,
    });
    const res = await api.patch<WorkLogDetail | WorkLogDetailResponse>(`/maintenance/work-logs/${id}/complete`, form);
    const data = res && typeof res === "object" && "data" in res ? (res as WorkLogDetailResponse).data : (res as WorkLogDetail);
    return { data };
  },
};
