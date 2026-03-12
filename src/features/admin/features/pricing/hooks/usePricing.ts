/**
 * Hook quản lý danh sách bảng giá: fetch, pagination, filter, search.
 */
import type { Dispatch, SetStateAction } from "react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { Pricing } from "../types/pricing.types";
import {
  pricingService,
  type PricingListParams,
  type OrderType,
} from "../services/pricing.service";
import type { FilterConfig } from "@/shared/components/DataTable";

const ORDER_BY_DEFAULT = "createdAt";
const ORDER_DIRECTION_DEFAULT: "ASC" | "DESC" = "DESC";

const SORT_ORDER_MAP: Record<string, "ASC" | "DESC"> = {
  "Mới nhất": "DESC",
  "Cũ nhất": "ASC",
};

const ORDER_TYPE_MAP: Record<string, OrderType> = {
  "Logistics": "LOGISTICS",
  "Thuê cá nhân": "PERSONAL_RENTAL",
};

function buildListParams(
  page: number,
  limit: number,
  searchQuery: string,
  filters: FilterConfig[]
): PricingListParams {
  const params: PricingListParams = {
    page,
    limit,
    orderBy: ORDER_BY_DEFAULT,
    orderDirection: ORDER_DIRECTION_DEFAULT,
  };
  if (searchQuery.trim()) {
    params.search = searchQuery.trim();
  }
  filters.forEach((filter) => {
    if (filter.key === "orderType" && filter.value) {
      params.orderType = ORDER_TYPE_MAP[filter.value] ?? (filter.value as OrderType);
    }
    if (filter.key === "sortOrder" && filter.value && SORT_ORDER_MAP[filter.value]) {
      params.orderDirection = SORT_ORDER_MAP[filter.value];
    }
  });
  return params;
}

export interface UsePricingOptions {
  defaultPageSize?: number;
  fetchOnMount?: boolean;
  defaultParams?: Partial<PricingListParams>;
}

export interface UsePricingReturn {
  pricings: Pricing[];
  total: number;
  isLoading: boolean;
  page: number;
  pageSize: number;
  searchQuery: string;
  filters: FilterConfig[];
  params: PricingListParams;
  refetch: () => void;
  setPricings: Dispatch<SetStateAction<Pricing[]>>;
  setTotal: Dispatch<SetStateAction<number>>;
  setPage: (pageOrUpdater: number | ((prev: number) => number)) => void;
  setPageSize: (newSize: number) => void;
  handleSearch: (searchValue: string) => void;
  handleFilter: (filterList: FilterConfig[]) => void;
  handleClearFilters: () => void;
}

export function usePricing(options: UsePricingOptions = {}): UsePricingReturn {
  const { defaultPageSize = 10, fetchOnMount = true, defaultParams } = options;

  const [pricings, setPricings] = useState<Pricing[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(defaultPageSize);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const params = useMemo(() => {
    const built = buildListParams(page, pageSize, searchQuery, filters);
    return { ...defaultParams, ...built } as PricingListParams;
  }, [page, pageSize, searchQuery, filters, defaultParams]);

  const loadPricings = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await pricingService.getAll(params);
      setPricings(response.data.pricings || []);
      setTotal(response.data.pagination?.total ?? 0);
    } catch (error) {
      console.error("Error loading pricings:", error);
      toast.error("Có lỗi xảy ra khi tải danh sách bảng giá");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (!fetchOnMount) return;
    loadPricings();
  }, [loadPricings, refreshKey, fetchOnMount]);

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
    pricings,
    total,
    isLoading,
    page,
    pageSize,
    searchQuery,
    filters,
    params,
    refetch,
    setPricings,
    setTotal,
    setPage,
    setPageSize,
    handleSearch,
    handleFilter,
    handleClearFilters,
  };
}
