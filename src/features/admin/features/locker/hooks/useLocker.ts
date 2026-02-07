/**
 * Hook quản lý danh sách locker: fetch, pagination, filter, search.
 */
import type { Dispatch, SetStateAction } from "react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { Locker } from "../types/locker.types";
import {
  lockerService,
  type LockerListParams,
  type LockerStatus,
} from "../services/locker.service";
import type { FilterConfig } from "@/shared/components/DataGrid";

function buildListParams(
  page: number,
  limit: number,
  searchQuery: string,
  filters: FilterConfig[],
  cabinetId?: string
): LockerListParams {
  const params: LockerListParams = {
    page,
    limit,
  };
  if (cabinetId) params.cabinetId = cabinetId;
  if (searchQuery.trim()) params.search = searchQuery.trim();
  filters.forEach((filter) => {
    if (filter.key === "status" && filter.value)
      params.status = filter.value as LockerStatus;
    if (filter.key === "isActive" && filter.value !== undefined)
      params.isActive = String(filter.value).toLowerCase() === "true";
  });
  return params;
}

export interface UseLockerOptions {
  defaultPageSize?: number;
  fetchOnMount?: boolean;
  cabinetId?: string;
}

export interface UseLockerReturn {
  lockers: Locker[];
  total: number;
  isLoading: boolean;
  page: number;
  pageSize: number;
  searchQuery: string;
  filters: FilterConfig[];
  params: LockerListParams;
  refetch: () => void;
  setLockers: Dispatch<SetStateAction<Locker[]>>;
  setTotal: Dispatch<SetStateAction<number>>;
  setPage: (pageOrUpdater: number | ((prev: number) => number)) => void;
  setPageSize: (newSize: number) => void;
  handleSearch: (searchValue: string) => void;
  handleFilter: (filterList: FilterConfig[]) => void;
  handleClearFilters: () => void;
}

export function useLocker(options: UseLockerOptions = {}): UseLockerReturn {
  const {
    defaultPageSize = 10,
    fetchOnMount = true,
    cabinetId,
  } = options;

  const [lockers, setLockers] = useState<Locker[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(defaultPageSize);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const params = useMemo(
    () => buildListParams(page, pageSize, searchQuery, filters, cabinetId),
    [page, pageSize, searchQuery, filters, cabinetId]
  );

  const loadLockers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await lockerService.getAll(params);
      setLockers(response.data.lockers || []);
      setTotal(response.data.pagination?.total ?? 0);
    } catch (error) {
      console.error("Error loading lockers:", error);
      toast.error("Có lỗi xảy ra khi tải danh sách locker");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (!fetchOnMount) return;
    loadLockers();
  }, [loadLockers, refreshKey, fetchOnMount]);

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

  return {
    lockers,
    total,
    isLoading,
    page,
    pageSize,
    searchQuery,
    filters,
    params,
    refetch,
    setLockers,
    setTotal,
    setPage,
    setPageSize,
    handleSearch,
    handleFilter,
    handleClearFilters,
  };
}
