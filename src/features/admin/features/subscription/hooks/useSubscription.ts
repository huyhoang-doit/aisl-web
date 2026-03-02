/**
 * Hook quản lý danh sách đăng ký dịch vụ: fetch, pagination, filter, search.
 */
import type { Dispatch, SetStateAction } from "react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { Subscription, SubscriptionStatusValue } from "../types/subscription.types";
import {
  subscriptionService,
  type SubscriptionListParams,
} from "../services/subscription.service";
import type { FilterConfig } from "@/shared/components/DataTable";

const ORDER_BY_DEFAULT = "createdAt";
const ORDER_DIRECTION_DEFAULT: "ASC" | "DESC" = "DESC";

const SORT_ORDER_MAP: Record<string, "ASC" | "DESC"> = {
  "Mới nhất": "DESC",
  "Cũ nhất": "ASC",
};

const STATUS_MAP: Record<string, SubscriptionStatusValue> = {
  "Đang hoạt động": "ACTIVE",
  "Tạm ngưng": "SUSPENDED",
  "Hết hạn": "EXPIRED",
  "Đã hủy": "CANCELLED",
};

function buildListParams(
  page: number,
  limit: number,
  searchQuery: string,
  filters: FilterConfig[]
): SubscriptionListParams {
  const params: SubscriptionListParams = {
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
      params.status = STATUS_MAP[filter.value] ?? filter.value;
    }
    if (filter.key === "planId" && filter.value) {
      params.planId = filter.value;
    }
    if (filter.key === "userId" && filter.value) {
      params.userId = filter.value;
    }
    if (filter.key === "sortOrder" && filter.value && SORT_ORDER_MAP[filter.value]) {
      params.orderDirection = SORT_ORDER_MAP[filter.value];
    }
  });
  return params;
}

export interface UseSubscriptionOptions {
  defaultPageSize?: number;
  fetchOnMount?: boolean;
  defaultParams?: Partial<SubscriptionListParams>;
}

export interface UseSubscriptionReturn {
  subscriptions: Subscription[];
  total: number;
  isLoading: boolean;
  page: number;
  pageSize: number;
  searchQuery: string;
  filters: FilterConfig[];
  params: SubscriptionListParams;
  refetch: () => void;
  setSubscriptions: Dispatch<SetStateAction<Subscription[]>>;
  setTotal: Dispatch<SetStateAction<number>>;
  setPage: (pageOrUpdater: number | ((prev: number) => number)) => void;
  setPageSize: (newSize: number) => void;
  handleSearch: (searchValue: string) => void;
  handleFilter: (filterList: FilterConfig[]) => void;
  handleClearFilters: () => void;
}

export function useSubscription(options: UseSubscriptionOptions = {}): UseSubscriptionReturn {
  const { defaultPageSize = 10, fetchOnMount = true, defaultParams } = options;

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(defaultPageSize);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const params = useMemo(() => {
    const built = buildListParams(page, pageSize, searchQuery, filters);
    return { ...defaultParams, ...built } as SubscriptionListParams;
  }, [page, pageSize, searchQuery, filters, defaultParams]);

  const loadSubscriptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await subscriptionService.getAll(params);
      setSubscriptions(response.data.subscriptions || []);
      setTotal(response.data.pagination?.total ?? 0);
    } catch (error) {
      console.error("Error loading subscriptions:", error);
      toast.error("Có lỗi xảy ra khi tải danh sách đăng ký dịch vụ");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (!fetchOnMount) return;
    loadSubscriptions();
  }, [loadSubscriptions, refreshKey, fetchOnMount]);

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
    subscriptions,
    total,
    isLoading,
    page,
    pageSize,
    searchQuery,
    filters,
    params,
    refetch,
    setSubscriptions,
    setTotal,
    setPage,
    setPageSize,
    handleSearch,
    handleFilter,
    handleClearFilters,
  };
}
