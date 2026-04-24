/**
 * Hook quản lý danh sách report nhân viên kỹ thuật (tasks): fetch, pagination, filter.
 */
import type { Dispatch, SetStateAction } from "react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { TechnicalStaffReport } from "@/features/admin/features/customerReport/types/customerReport.types";
import {
  taskService,
  type UpdateTaskStatusPayload,
  type CreateTaskPayload,
} from "@/features/admin/features/task/services/task.service";

export interface TaskListParams {
  page?: number;
  limit?: number;
  status?: string;
}

const TAB_STATUS_MAP: Record<StaffReportTab, string | undefined> = {
  pending_review: "PENDING_REVIEW",
  assigned: "IN_PROGRESS",
  all: undefined,
};

function extractTasks(response: unknown): TechnicalStaffReport[] {
  const data = (response as { data?: unknown })?.data;
  if (!data) return [];
  if (Array.isArray(data)) return data as TechnicalStaffReport[];
  const tasks = (data as { tasks?: unknown })?.tasks ?? (data as { data?: unknown })?.data;
  return Array.isArray(tasks) ? tasks : [];
}

function extractPagination(response: unknown): { total: number } {
  const data = (response as { data?: { pagination?: { total?: number } } })?.data;
  const pagination = data?.pagination;
  return { total: pagination?.total ?? 0 };
}

export type StaffReportTab = "pending_review" | "assigned" | "all";

export interface UseStaffReportOptions {
  defaultPageSize?: number;
  fetchOnMount?: boolean;
  /** Tab hiện tại - "assigned" dùng getMyTasks, "all" dùng getAll */
  tab?: StaffReportTab;
}

export interface UseStaffReportReturn {
  tasks: TechnicalStaffReport[];
  total: number;
  isLoading: boolean;
  page: number;
  pageSize: number;
  refetch: () => void;
  setTasks: Dispatch<SetStateAction<TechnicalStaffReport[]>>;
  setPage: (pageOrUpdater: number | ((prev: number) => number)) => void;
  setPageSize: (newSize: number) => void;
  updateTaskStatus: (taskId: string, payload: UpdateTaskStatusPayload) => Promise<void>;
  assignTask: (payload: CreateTaskPayload) => Promise<void>;
  isUpdating: boolean;
}

export function useStaffReport(options: UseStaffReportOptions = {}): UseStaffReportReturn {
  const { defaultPageSize = 10, fetchOnMount = true, tab = "all" } = options;

  const [tasks, setTasks] = useState<TechnicalStaffReport[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(defaultPageSize);
  const [refreshKey, setRefreshKey] = useState(0);

  const params = useMemo<TaskListParams>(
    () => ({
      page,
      limit: pageSize,
      status: TAB_STATUS_MAP[tab],
    }),
    [page, pageSize, tab]
  );

  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await taskService.getAll(params);
      setTasks(extractTasks(response));
      setTotal(extractPagination(response).total);
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast.error("Có lỗi xảy ra khi tải danh sách task");
    } finally {
      setIsLoading(false);
    }
  }, [params, tab]);

  useEffect(() => {
    if (!fetchOnMount) return;
    loadTasks();
  }, [loadTasks, refreshKey, fetchOnMount]);

  const refetch = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const updateTaskStatus = useCallback(async (taskId: string, payload: UpdateTaskStatusPayload) => {
    try {
      setIsUpdating(true);
      await taskService.updateStatus(taskId, payload);
      toast.success("Cập nhật trạng thái thành công");
      refetch();
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [refetch]);

  const assignTask = useCallback(async (payload: CreateTaskPayload) => {
    try {
      setIsAssigning(true);
      await taskService.create(payload);
      toast.success("Phân công thành công");
      refetch();
    } catch (error) {
      console.error("Error assigning task:", error);
      toast.error("Có lỗi xảy ra khi phân công");
      throw error;
    } finally {
      setIsAssigning(false);
    }
  }, [refetch]);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setPage(1);
  }, []);

  return {
    tasks,
    total,
    isLoading,
    page,
    pageSize,
    refetch,
    setTasks,
    setPage,
    setPageSize,
    updateTaskStatus,
    assignTask,
    isUpdating: isUpdating || isAssigning,
  };
}
