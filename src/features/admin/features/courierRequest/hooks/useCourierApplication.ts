/**
 * Hook quản lý đơn đăng ký người chuyển phát: fetch list, pagination, filter, search, approve, reject.
 */
import type { Dispatch, SetStateAction } from "react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { CourierApplication } from "../types/courierRequest.types";
import { CourierStatus, type CourierStatusValue } from "../types/courierRequest.types";
import {
  courierApplicationService,
  type CourierApplicationListParams,
} from "../services/courierApplication.service";
import type { FilterConfig } from "@/shared/components/DataTable";

const ORDER_BY_DEFAULT = "createdAt";
const ORDER_DIRECTION_DEFAULT: "ASC" | "DESC" = "DESC";

function buildListParams(
  page: number,
  limit: number,
  searchQuery: string,
  filters: FilterConfig[]
): CourierApplicationListParams {
  const params: CourierApplicationListParams = {
    page,
    limit,
    orderBy: ORDER_BY_DEFAULT,
    orderDirection: ORDER_DIRECTION_DEFAULT,
  };
  if (searchQuery.trim()) {
    params.search = searchQuery.trim();
  }
  filters.forEach((filter) => {
    if (filter.key === "status" && filter.value) {
      const statusMap: Record<string, string> = {
        "Chờ duyệt": CourierStatus.PENDING,
        "Đã duyệt": CourierStatus.APPROVED,
        "Đã từ chối": CourierStatus.REJECTED,
      };
      params.status = statusMap[filter.value] ?? filter.value;
    }
    if (filter.key === "sortOrder" && filter.value && SORT_ORDER_MAP[filter.value]) {
      params.orderDirection = SORT_ORDER_MAP[filter.value];
    }
  });
  return params;
}

const SORT_ORDER_MAP: Record<string, "ASC" | "DESC"> = {
  "Mới nhất": "DESC",
  "Cũ nhất": "ASC",
};

/** Tab trạng thái – mỗi tab query theo status tương ứng */
export type CourierStatusTab = CourierStatusValue;

export interface UseCourierApplicationOptions {
  defaultPageSize?: number;
  fetchOnMount?: boolean;
  /** Tab trạng thái – filter theo status */
  status?: CourierStatusTab;
  defaultParams?: Partial<CourierApplicationListParams>;
  initialFilters?: FilterConfig[];
}

export interface UseCourierApplicationReturn {
  applications: CourierApplication[];
  total: number;
  isLoading: boolean;
  page: number;
  pageSize: number;
  searchQuery: string;
  filters: FilterConfig[];
  params: CourierApplicationListParams;
  refetch: () => void;
  setApplications: Dispatch<SetStateAction<CourierApplication[]>>;
  setTotal: Dispatch<SetStateAction<number>>;
  setPage: (pageOrUpdater: number | ((prev: number) => number)) => void;
  setPageSize: (newSize: number) => void;
  handleSearch: (searchValue: string) => void;
  handleFilter: (filterList: FilterConfig[]) => void;
  handleClearFilters: () => void;
  approve: (id: string, payload: { reviewNote: string }) => Promise<void>;
  reject: (id: string, payload: { reviewNote: string }) => Promise<void>;
  isApproving: boolean;
  isRejecting: boolean;
}

export function useCourierApplication(
  options: UseCourierApplicationOptions = {}
): UseCourierApplicationReturn {
  const {
    defaultPageSize = 10,
    fetchOnMount = true,
    status: tabStatus,
    defaultParams,
    initialFilters = [],
  } = options;

  const [applications, setApplications] = useState<CourierApplication[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(defaultPageSize);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterConfig[]>(initialFilters);
  const [refreshKey, setRefreshKey] = useState(0);

  const params = useMemo(() => {
    const built = buildListParams(page, pageSize, searchQuery, filters);
    return { ...defaultParams, ...built, status: tabStatus ?? built.status } as CourierApplicationListParams;
  }, [page, pageSize, searchQuery, filters, defaultParams, tabStatus]);

  const loadApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await courierApplicationService.getAll(params);
      setApplications(response.data.applications ?? []);
      setTotal(response.data.pagination?.total ?? 0);
    } catch (error) {
      console.error("Error loading courier applications:", error);
      toast.error("Có lỗi xảy ra khi tải danh sách đơn đăng ký người chuyển phát");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (!fetchOnMount) return;
    loadApplications();
  }, [loadApplications, refreshKey, fetchOnMount]);

  const refetch = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

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

  const approve = useCallback(async (id: string, payload: { reviewNote: string }) => {
    try {
      setIsApproving(true);
      await courierApplicationService.approve(id, payload);
      toast.success("Đã duyệt đơn đăng ký người chuyển phát");
      refetch();
    } catch (error) {
      console.error("Error approving courier application:", error);
      toast.error("Có lỗi xảy ra khi duyệt đơn");
      throw error;
    } finally {
      setIsApproving(false);
    }
  }, [refetch]);

  const reject = useCallback(async (id: string, payload: { reviewNote: string }) => {
    try {
      setIsRejecting(true);
      await courierApplicationService.reject(id, payload);
      toast.success("Đã từ chối đơn đăng ký người chuyển phát");
      refetch();
    } catch (error) {
      console.error("Error rejecting courier application:", error);
      toast.error("Có lỗi xảy ra khi từ chối đơn");
      throw error;
    } finally {
      setIsRejecting(false);
    }
  }, [refetch]);

  return {
    applications,
    total,
    isLoading,
    page,
    pageSize,
    searchQuery,
    filters,
    params,
    refetch,
    setApplications,
    setTotal,
    setPage,
    setPageSize,
    handleSearch,
    handleFilter,
    handleClearFilters,
    approve,
    reject,
    isApproving,
    isRejecting,
  };
}
