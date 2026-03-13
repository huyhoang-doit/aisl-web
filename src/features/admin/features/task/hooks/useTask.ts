/**
 * Hook quản lý danh sách task: fetch, pagination, filter.
 * Pattern giống useUser: service trả { data: { tasks, pagination } }, hook dùng trực tiếp.
 */
import type { Dispatch, SetStateAction } from "react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { TaskDetail } from "../types/task.types";
import { taskService, type TaskListParams } from "../services/task.service";
import type { FilterConfig } from "@/shared/components/DataTable";

export interface UseTaskOptions {
  defaultPageSize?: number;
  fetchOnMount?: boolean;
  /** Lọc theo status task (OPEN, IN_PROGRESS, COMPLETED, VERIFIED) - từ tab */
  status?: string;
}

export interface UseTaskReturn {
  tasks: TaskDetail[];
  total: number;
  isLoading: boolean;
  page: number;
  pageSize: number;
  filters: FilterConfig[];
  refetch: () => void;
  setTasks: Dispatch<SetStateAction<TaskDetail[]>>;
  setPage: Dispatch<SetStateAction<number>>;
  setPageSize: Dispatch<number>;
  handleFilter: Dispatch<FilterConfig[]>;
  handleClearFilters: () => void;
}

function getFilterValue(filters: FilterConfig[], key: string): string | undefined {
  const f = filters.find((x) => x.key === key);
  return f?.value?.trim() || undefined;
}

export function useTask(options: UseTaskOptions = {}): UseTaskReturn {
  const { defaultPageSize = 10, fetchOnMount = true, status } = options;

  const [tasks, setTasks] = useState<TaskDetail[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(defaultPageSize);
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const params = useMemo<TaskListParams>(
    () => ({
      page,
      limit: pageSize,
      status: status ?? undefined,
      taskType: getFilterValue(filters, "taskType"),
      priority: getFilterValue(filters, "priority"),
      assignedToId: getFilterValue(filters, "assignedToId"),
    }),
    [page, pageSize, status, filters]
  );

  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await taskService.getAll(params);
      setTasks(response.data.tasks ?? []);
      setTotal(response.data.pagination?.total ?? 0);
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast.error("Có lỗi xảy ra khi tải danh sách task");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (!fetchOnMount) return;
    loadTasks();
  }, [loadTasks, refreshKey, fetchOnMount]);

  const refetch = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setPage(1);
  }, []);

  const handleFilter = useCallback((newFilters: FilterConfig[]) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters([]);
    setPage(1);
  }, []);

  return {
    tasks,
    total,
    isLoading,
    page,
    pageSize,
    filters,
    refetch,
    setTasks,
    setPage,
    setPageSize,
    handleFilter,
    handleClearFilters,
  };
}
