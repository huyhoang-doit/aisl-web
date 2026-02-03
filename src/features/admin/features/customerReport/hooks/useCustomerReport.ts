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

const STATUS_MAP: Record<string, string> = {
  "Chờ xử lý": "PENDING",
  "Đã phân công": "ASSIGNED",
  "Đang xử lý": "IN_PROGRESS",
  "Hoàn thành": "COMPLETED",
  "Từ chối": "REJECTED",
};

export interface UseCustomerReportOptions {
  defaultPageSize?: number;
  fetchOnMount?: boolean;
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
  isCreating: boolean;
  isAssigning: boolean;
}

export function useCustomerReport(options: UseCustomerReportOptions = {}): UseCustomerReportReturn {
  const { defaultPageSize = 10, fetchOnMount = true } = options;

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
      const statusFilter = filters.find((f) => f.key === "status")?.value;
      return {
        page,
        limit: pageSize,
        search: searchQuery.trim() || undefined,
        status: statusFilter ? STATUS_MAP[statusFilter] || statusFilter : undefined,
      };
    },
    [page, pageSize, searchQuery, filters]
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
    isCreating,
    isAssigning,
  };
}
