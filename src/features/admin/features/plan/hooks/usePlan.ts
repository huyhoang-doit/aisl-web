/**
 * Hook quản lý danh sách plan: fetch, pagination, filter, search.
 */
import type { Dispatch, SetStateAction } from "react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { Plan } from "../types/plan.types";
import {
  planService,
  type PlanListParams,
  type PlanStatus,
} from "../services/plan.service";
import type { FilterConfig } from "@/shared/components/DataGrid";

function buildListParams(
  page: number,
  limit: number,
  searchQuery: string,
  filters: FilterConfig[]
): PlanListParams {
  const params: PlanListParams = {
    page,
    limit,
  };
  if (searchQuery.trim()) params.search = searchQuery.trim();
  filters.forEach((filter) => {
    if (filter.key === "status" && filter.value)
      params.status = filter.value as PlanStatus;
  });
  return params;
}

export interface UsePlanOptions {
  defaultPageSize?: number;
  fetchOnMount?: boolean;
}

export interface UsePlanReturn {
  plans: Plan[];
  total: number;
  isLoading: boolean;
  page: number;
  pageSize: number;
  searchQuery: string;
  filters: FilterConfig[];
  params: PlanListParams;
  refetch: () => void;
  setPlans: Dispatch<SetStateAction<Plan[]>>;
  setTotal: Dispatch<SetStateAction<number>>;
  setPage: (pageOrUpdater: number | ((prev: number) => number)) => void;
  setPageSize: (newSize: number) => void;
  handleSearch: (searchValue: string) => void;
  handleFilter: (filterList: FilterConfig[]) => void;
  handleClearFilters: () => void;
}

export function usePlan(options: UsePlanOptions = {}): UsePlanReturn {
  const {
    defaultPageSize = 12,
    fetchOnMount = true,
  } = options;

  const [plans, setPlans] = useState<Plan[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(defaultPageSize);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const params = useMemo(
    () => buildListParams(page, pageSize, searchQuery, filters),
    [page, pageSize, searchQuery, filters]
  );

  const loadPlans = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await planService.getAll(params);
      setPlans(response.data.plans || []);
      setTotal(response.data.pagination?.total ?? 0);
    } catch (error) {
      console.error("Error loading plans:", error);
      toast.error("Có lỗi xảy ra khi tải danh sách gói đăng ký");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (!fetchOnMount) return;
    loadPlans();
  }, [loadPlans, refreshKey, fetchOnMount]);

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
    plans,
    total,
    isLoading,
    page,
    pageSize,
    searchQuery,
    filters,
    params,
    refetch,
    setPlans,
    setTotal,
    setPage,
    setPageSize,
    handleSearch,
    handleFilter,
    handleClearFilters,
  };
}
