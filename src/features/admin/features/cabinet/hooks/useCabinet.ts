/**
 * Hook quản lý danh sách cabinet: fetch, pagination, filter, search.
 * Query params BE: page, limit, locationId, name, macAddress.
 */
import type { Dispatch, SetStateAction } from "react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { Cabinet } from "../types/cabinet.types";
import { cabinetService, type CabinetListParams } from "../services/cabinet.service";
import type { FilterConfig } from "@/shared/components/DataGrid";

function buildListParams(
  page: number,
  limit: number,
  searchQuery: string,
  filters: FilterConfig[],
  locationId?: string
): CabinetListParams {
  const params: CabinetListParams = {
    page,
    limit,
  };
  if (locationId) params.locationId = locationId;
  if (searchQuery.trim()) params.name = searchQuery.trim();
  filters.forEach((filter) => {
    if (filter.key === "name" && filter.value) params.name = filter.value;
    if (filter.key === "macAddress" && filter.value) params.macAddress = filter.value;
  });
  return params;
}

export interface UseCabinetOptions {
  /** Số item mặc định mỗi trang */
  defaultPageSize?: number;
  /** Gọi fetch ngay khi mount */
  fetchOnMount?: boolean;
  /** Lọc theo locationId (optional) */
  locationId?: string;
}

export interface UseCabinetReturn {
  cabinets: Cabinet[];
  total: number;
  isLoading: boolean;
  page: number;
  pageSize: number;
  searchQuery: string;
  filters: FilterConfig[];
  params: CabinetListParams;
  refetch: () => void;
  setCabinets: Dispatch<SetStateAction<Cabinet[]>>;
  setTotal: Dispatch<SetStateAction<number>>;
  setPage: (pageOrUpdater: number | ((prev: number) => number)) => void;
  setPageSize: (newSize: number) => void;
  handleSearch: (searchValue: string) => void;
  handleFilter: (filterList: FilterConfig[]) => void;
  handleClearFilters: () => void;
}

export function useCabinet(options: UseCabinetOptions = {}): UseCabinetReturn {
  const {
    defaultPageSize = 10,
    fetchOnMount = true,
    locationId,
  } = options;

  const [cabinets, setCabinets] = useState<Cabinet[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(defaultPageSize);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const params = useMemo(
    () => buildListParams(page, pageSize, searchQuery, filters, locationId),
    [page, pageSize, searchQuery, filters, locationId]
  );

  const loadCabinets = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await cabinetService.getAll(params);
      setCabinets(response.data.cabinets || []);
      setTotal(response.data.pagination?.total ?? 0);
    } catch (error) {
      console.error("Error loading cabinets:", error);
      toast.error("Có lỗi xảy ra khi tải danh sách cabinet");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (!fetchOnMount) return;
    loadCabinets();
  }, [loadCabinets, refreshKey, fetchOnMount]);

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
    cabinets,
    total,
    isLoading,
    page,
    pageSize,
    searchQuery,
    filters,
    params,
    refetch,
    setCabinets,
    setTotal,
    setPage,
    setPageSize,
    handleSearch,
    handleFilter,
    handleClearFilters,
  };
}
