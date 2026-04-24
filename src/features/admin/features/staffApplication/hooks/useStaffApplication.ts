import type { Dispatch, SetStateAction } from "react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type {
  StaffApplication,
  StaffReviewPayload,
} from "../types/staffApplication.types";
import { StaffApplicationStatus } from "../types/staffApplication.types";
import {
  staffApplicationService,
  type StaffApplicationListParams,
} from "../services/staffApplication.service";
import type { FilterConfig } from "@/shared/components/DataTable";

const ORDER_BY_DEFAULT = "createdAt";
const ORDER_DIRECTION_DEFAULT: "ASC" | "DESC" = "DESC";

const SORT_ORDER_MAP: Record<string, "ASC" | "DESC"> = {
  "Mới nhất": "DESC",
  "Cũ nhất": "ASC",
};

function buildListParams(
  page: number,
  limit: number,
  searchQuery: string,
  filters: FilterConfig[]
): StaffApplicationListParams {
  const params: StaffApplicationListParams = {
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
        "Chờ duyệt": StaffApplicationStatus.PENDING,
        "Đã duyệt": StaffApplicationStatus.APPROVED,
        "Đã từ chối": StaffApplicationStatus.REJECTED,
      };
      params.status = statusMap[filter.value] ?? filter.value;
    }

    if (
      filter.key === "sortOrder" &&
      filter.value &&
      SORT_ORDER_MAP[filter.value]
    ) {
      params.orderDirection = SORT_ORDER_MAP[filter.value];
    }
  });

  return params;
}

export interface UseStaffApplicationReturn {
  applications: StaffApplication[];
  total: number;
  isLoading: boolean;
  isApproving: boolean;
  isRejecting: boolean;
  page: number;
  pageSize: number;
  searchQuery: string;
  filters: FilterConfig[];
  params: StaffApplicationListParams;
  refetch: () => void;
  setApplications: Dispatch<SetStateAction<StaffApplication[]>>;
  setTotal: Dispatch<SetStateAction<number>>;
  setPage: (pageOrUpdater: number | ((prev: number) => number)) => void;
  setPageSize: (newSize: number) => void;
  handleSearch: (searchValue: string) => void;
  handleFilter: (filterList: FilterConfig[]) => void;
  handleClearFilters: () => void;
  approve: (id: string, payload?: StaffReviewPayload) => Promise<void>;
  reject: (id: string, payload?: StaffReviewPayload) => Promise<void>;
}

export function useStaffApplication(
  defaultParams?: Partial<StaffApplicationListParams>
): UseStaffApplicationReturn {
  const [applications, setApplications] = useState<StaffApplication[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const params = useMemo(() => {
    const built = buildListParams(page, pageSize, searchQuery, filters);
    return { ...defaultParams, ...built } as StaffApplicationListParams;
  }, [page, pageSize, searchQuery, filters, defaultParams]);

  const loadApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await staffApplicationService.getAll(params);
      const list =
        response.data.applications ?? response.data.staffApplications ?? [];
      setApplications(list);
      setTotal(response.data.pagination?.total ?? 0);
    } catch (error) {
      console.error("Error loading staff applications:", error);
      toast.error("Có lỗi xảy ra khi tải danh sách đơn đăng ký nhân viên");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications, refreshKey]);

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

  const approve = useCallback(
    async (id: string, payload: StaffReviewPayload = {}) => {
      try {
        setIsApproving(true);
        await staffApplicationService.approve(id, payload);
        toast.success("Đã duyệt đơn đăng ký nhân viên");
        refetch();
      } catch (error) {
        console.error("Error approving staff application:", error);
        toast.error("Có lỗi xảy ra khi duyệt đơn đăng ký nhân viên");
        throw error;
      } finally {
        setIsApproving(false);
      }
    },
    [refetch]
  );

  const reject = useCallback(
    async (id: string, payload: StaffReviewPayload = {}) => {
      try {
        setIsRejecting(true);
        await staffApplicationService.reject(id, payload);
        toast.success("Đã từ chối đơn đăng ký nhân viên");
        refetch();
      } catch (error) {
        console.error("Error rejecting staff application:", error);
        toast.error("Có lỗi xảy ra khi từ chối đơn");
        throw error;
      } finally {
        setIsRejecting(false);
      }
    },
    [refetch]
  );

  return {
    applications,
    total,
    isLoading,
    isApproving,
    isRejecting,
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
  };
}
