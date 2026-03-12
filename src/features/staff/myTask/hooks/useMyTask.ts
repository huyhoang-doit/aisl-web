/**
 * Hook danh sách task được assign cho technician: getMyTasks, pagination, filter theo status.
 */
import type { Dispatch, SetStateAction } from "react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { TaskDetail } from "../types/myTask.types";
import { myTaskService, type TaskListParams } from "../services/myTask.service";
import type { FilterConfig } from "@/shared/components/DataTable";

export interface UseMyTaskOptions {
  defaultPageSize?: number;
  fetchOnMount?: boolean;
  status?: string;
}

export interface UseMyTaskReturn {
  tasks: TaskDetail[];
  total: number;
  isLoading: boolean;
  page: number;
  pageSize: number;
  filters: FilterConfig[];
  refetch: () => void;
  setTasks: Dispatch<SetStateAction<TaskDetail[]>>;
  setPage: Dispatch<SetStateAction<number>>;
  setPageSize: (size: number) => void;
  handleFilter: (newFilters: FilterConfig[]) => void;
  handleClearFilters: () => void;
}

export function useMyTask(options: UseMyTaskOptions = {}): UseMyTaskReturn {
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
    }),
    [page, pageSize, status]
  );

  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await myTaskService.getMyTasks(params);
      setTasks(response.data.tasks ?? []);
      setTotal(response.data.pagination?.total ?? 0);
    } catch (error) {
      console.error("Error loading my tasks:", error);
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
