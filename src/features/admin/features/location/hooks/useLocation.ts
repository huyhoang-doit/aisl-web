/**
 * Hook quản lý danh sách location: fetch, pagination, filter, search.
 * Tái sử dụng logic get params và load data, tránh duplicate ở nhiều nơi.
 */
import type { Dispatch, SetStateAction } from "react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { Location } from "../types/location.types";
import { locationService, type LocationListParams } from "../services/location.service";
import type { FilterConfig } from "@/shared/components/DataGrid";

const IS_ACTIVE_MAP: Record<string, boolean> = {
  "Hoạt động": true,
  "Không hoạt động": false,
};

function buildListParams(
  page: number,
  limit: number,
  searchQuery: string,
  filters: FilterConfig[]
): LocationListParams {
  const params: LocationListParams = {
    page,
    limit,
  };
  if (searchQuery.trim()) params.search = searchQuery.trim();
  filters.forEach((filter) => {
    if (filter.key === "name" && filter.value) params.name = filter.value;
    if (filter.key === "address" && filter.value) params.address = filter.value;
    if (filter.key === "isActive") {
      const v = IS_ACTIVE_MAP[filter.value];
      if (v !== undefined) params.isActive = v;
    }
  });
  return params;
}

export interface UseLocationOptions {
  /** Số item mặc định mỗi trang */
  defaultPageSize?: number;
  /** Gọi fetch ngay khi mount */
  fetchOnMount?: boolean;
  /** Bộ lọc mặc định */
  initialFilters?: FilterConfig[];
}

export interface UseLocationReturn {
  /** Danh sách location trang hiện tại */
  locations: Location[];
  /** Tổng số bản ghi (từ API) */
  total: number;
  /** Đang loading */
  isLoading: boolean;
  /** Pagination: trang hiện tại */
  page: number;
  /** Pagination: size trang */
  pageSize: number;
  /** Search keyword */
  searchQuery: string;
  /** Bộ lọc (name, address, isActive) */
  filters: FilterConfig[];
  /** Params hiện tại đã build (để gửi API) */
  params: LocationListParams;
  /** Refetch lại danh sách */
  refetch: () => void;
  /** Cập nhật danh sách (sau update/delete local) */
  setLocations: Dispatch<SetStateAction<Location[]>>;
  /** Cập nhật total (sau delete local) */
  setTotal: Dispatch<SetStateAction<number>>;
  /** Đổi trang */
  // eslint-disable-next-line no-unused-vars -- type definition
  setPage: (pageOrUpdater: number | ((prev: number) => number)) => void;
  /** Đổi page size (sẽ reset về trang 1) */
  // eslint-disable-next-line no-unused-vars -- type definition
  setPageSize: (newSize: number) => void;
  /** Gán search → reset về trang 1 */
  // eslint-disable-next-line no-unused-vars -- type definition
  handleSearch: (searchValue: string) => void;
  /** Gán filters → reset về trang 1 */
  // eslint-disable-next-line no-unused-vars -- type definition
  handleFilter: (filterList: FilterConfig[]) => void;
  /** Xóa hết filter + search và về trang 1 */
  handleClearFilters: () => void;
}

export function useLocation(options: UseLocationOptions = {}): UseLocationReturn {
  const {
    defaultPageSize = 10,
    fetchOnMount = true,
    initialFilters = [],
  } = options;

  const [locations, setLocations] = useState<Location[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(defaultPageSize);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterConfig[]>(initialFilters);
  const [refreshKey, setRefreshKey] = useState(0);

  const params = useMemo(
    () => buildListParams(page, pageSize, searchQuery, filters),
    [page, pageSize, searchQuery, filters]
  );

  const loadLocations = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await locationService.getAll(params);
      setLocations(response.data.locations || []);
      setTotal(response.data.pagination?.total ?? 0);
    } catch (error) {
      console.error("Error loading locations:", error);
      toast.error("Có lỗi xảy ra khi tải danh sách địa điểm");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (!fetchOnMount) return;
    loadLocations();
  }, [loadLocations, refreshKey, fetchOnMount]);

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
    locations,
    total,
    isLoading,
    page,
    pageSize,
    searchQuery,
    filters,
    params,
    refetch,
    setLocations,
    setTotal,
    setPage,
    setPageSize,
    handleSearch,
    handleFilter,
    handleClearFilters,
  };
}
