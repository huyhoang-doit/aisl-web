/**
 * Hook quản lý danh sách report khách hàng: fetch, pagination, filter, create, assign.
 */
import type { Dispatch, SetStateAction } from "react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { CustomerReport } from "../types/customerReport.types";
import { maintenanceReportService, type CreateReportPayload } from "../services/maintenanceReport.service";
import { maintenanceTaskService, type CreateTaskPayload } from "../services/maintenanceTask.service";
import type { FilterConfig } from "@/shared/components/DataTable";

export interface ReportListParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  orderBy?: string;
  orderDirection?: "ASC" | "DESC";
}

function extractReports(response: unknown): CustomerReport[] {
  const data = (response as { data?: unknown })?.data;
  if (!data) return [];
  if (Array.isArray(data)) return data as CustomerReport[];
  const reports =
    (data as { reports?: unknown })?.reports ??
    (data as { content?: unknown })?.content ??
    (data as { data?: unknown })?.data;
  return Array.isArray(reports) ? reports : [];
}

function extractPagination(response: unknown): { total: number } {
  const data = (response as { data?: Record<string, unknown> })?.data;
  if (!data) return { total: 0 };
  const pagination = data.pagination as { total?: number } | undefined;
  return {
    total:
      pagination?.total ??
      (data.total as number) ??
      (data.totalElements as number) ??
      0,
  };
}

const SORT_ORDER_MAP: Record<string, "ASC" | "DESC"> = {
  "Mới nhất": "DESC",
  "Cũ nhất": "ASC",
};

export type IncidentReportStatusTab =
  | "PENDING"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

export interface UseCustomerReportOptions {
  defaultPageSize?: number;
  fetchOnMount?: boolean;
  /** Tab trạng thái – mỗi tab query theo status tương ứng */
  status?: IncidentReportStatusTab;
}

export interface UseCustomerReportReturn {
  reports: CustomerReport[];
  total: number;
  isLoading: boolean;
  page: number;
  pageSize: number;
  searchQuery: string;
  filters: FilterConfig[];
  refetch: () => void;
  setReports: Dispatch<SetStateAction<CustomerReport[]>>;
  setPage: (pageOrUpdater: number | ((prev: number) => number)) => void;
  setPageSize: (newSize: number) => void;
  handleSearch: (searchValue: string) => void;
  handleFilter: (filterList: FilterConfig[]) => void;
  handleClearFilters: () => void;
  createReport: (data: CreateReportPayload) => Promise<void>;
  assignTask: (payload: CreateTaskPayload) => Promise<void>;
  /** Tạo nhiều task cho một report (mỗi nhân viên một task) */
  assignTasks: (payloads: CreateTaskPayload[]) => Promise<void>;
  isCreating: boolean;
  isAssigning: boolean;
}

export function useCustomerReport(options: UseCustomerReportOptions = {}): UseCustomerReportReturn {
  const { defaultPageSize = 10, fetchOnMount = true, status: tabStatus } = options;

  const [reports, setReports] = useState<CustomerReport[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(defaultPageSize);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const params = useMemo<ReportListParams>(
    () => {
      const sortOrderFilter = filters.find((f) => f.key === "sortOrder")?.value;
      const orderDirection = sortOrderFilter && SORT_ORDER_MAP[sortOrderFilter]
        ? SORT_ORDER_MAP[sortOrderFilter]
        : "DESC";
      return {
        page,
        limit: pageSize,
        search: searchQuery.trim() || undefined,
        status: tabStatus ?? undefined,
        orderBy: "createdAt",
        orderDirection,
      };
    },
    [page, pageSize, searchQuery, filters, tabStatus]
  );

  const loadReports = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await maintenanceReportService.getAll(params);
      setReports(extractReports(response));
      setTotal(extractPagination(response).total);
    } catch (error) {
      console.error("Error loading reports:", error);
      toast.error("Có lỗi xảy ra khi tải danh sách báo cáo");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (!fetchOnMount) return;
    loadReports();
  }, [loadReports, refreshKey, fetchOnMount]);

  const refetch = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const createReport = useCallback(async (data: CreateReportPayload) => {
    try {
      setIsCreating(true);
      await maintenanceReportService.create(data);
      toast.success("Tạo báo cáo thành công");
      refetch();
    } catch (error) {
      console.error("Error creating report:", error);
      toast.error("Có lỗi xảy ra khi tạo báo cáo");
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, [refetch]);

  const assignTask = useCallback(async (payload: CreateTaskPayload) => {
    try {
      setIsAssigning(true);
      await maintenanceTaskService.create(payload);
      toast.success("Phân công nhân viên thành công");
      refetch();
    } catch (error) {
      console.error("Error assigning task:", error);
      toast.error("Có lỗi xảy ra khi phân công");
      throw error;
    } finally {
      setIsAssigning(false);
    }
  }, [refetch]);

  const assignTasks = useCallback(async (payloads: CreateTaskPayload[]) => {
    if (!payloads.length) return;
    try {
      setIsAssigning(true);
      for (const payload of payloads) {
        await maintenanceTaskService.create(payload);
      }
      toast.success(
        payloads.length === 1
          ? "Phân công nhân viên thành công"
          : `Đã tạo ${payloads.length} task phân công thành công`
      );
      refetch();
    } catch (error) {
      console.error("Error assigning tasks:", error);
      toast.error("Có lỗi xảy ra khi phân công");
      throw error;
    } finally {
      setIsAssigning(false);
    }
  }, [refetch]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  const handleFilter = useCallback((newFilters: FilterConfig[]) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters([]);
    setSearchQuery("");
    setPage(1);
  }, []);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setPage(1);
  }, []);

  return {
    reports,
    total,
    isLoading,
    page,
    pageSize,
    searchQuery,
    filters,
    refetch,
    setReports,
    setPage,
    setPageSize,
    handleSearch,
    handleFilter,
    handleClearFilters,
    createReport,
    assignTask,
    assignTasks,
    isCreating,
    isAssigning,
  };
}
