/* eslint-disable no-unused-vars */
/**
 * Hook quản lý danh sách transaction: fetch, pagination, filter, search.
 * Theo mẫu useUser.ts
 */
import type { Dispatch, SetStateAction } from "react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { Transaction, TransactionStatus, TransactionType } from "../types/transaction.types";
import {
  transactionService,
  type TransactionListParams,
} from "../services/transaction.service";
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
): TransactionListParams {
  const params: TransactionListParams = {
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
      const statusMap: Record<string, TransactionStatus> = {
        "Thành công": "SUCCESS",
        "Đang chờ": "PENDING",
        "Thất bại": "FAILED",
      };
      params.status = (statusMap[filter.value] ?? filter.value) as TransactionStatus;
    }
    if (filter.key === "type" && filter.value) {
      const typeMap: Record<string, TransactionType> = {
        "Nạp tiền": "DEPOSIT",
        "Top-up": "TOP_UP",
        "Trừ tiền thuê": "RENTAL_DEDUCTION",
        "Trừ tiền vận chuyển": "LOGISTICS_DEDUCTION",
        "Phạt quá hạn": "OVERDUE_PENALTY",
        "Hoàn tiền": "REFUND",
        "Rút tiền": "WITHDRAW",
      };
      params.type = (typeMap[filter.value] ?? filter.value) as TransactionType;
    }
    if (filter.key === "sortOrder" && filter.value && SORT_ORDER_MAP[filter.value]) {
      params.orderDirection = SORT_ORDER_MAP[filter.value];
    }
  });

  return params;
}

export interface UseTransactionOptions {
  defaultPageSize?: number;
  fetchOnMount?: boolean;
  defaultParams?: Partial<TransactionListParams>;
  initialFilters?: FilterConfig[];
}

export interface UseTransactionReturn {
  transactions: Transaction[];
  total: number;
  isLoading: boolean;
  page: number;
  pageSize: number;
  searchQuery: string;
  filters: FilterConfig[];
  params: TransactionListParams;
  refetch: () => void;
  setTransactions: Dispatch<SetStateAction<Transaction[]>>;
  setTotal: Dispatch<SetStateAction<number>>;
  setPage: (pageOrUpdater: number | ((prev: number) => number)) => void;
  setPageSize: (newSize: number) => void;
  handleSearch: (searchValue: string) => void;
  handleFilter: (filterList: FilterConfig[]) => void;
  handleClearFilters: () => void;
}

export function useTransaction(
  options: UseTransactionOptions = {}
): UseTransactionReturn {
  const {
    defaultPageSize = 10,
    fetchOnMount = true,
    defaultParams,
    initialFilters = [],
  } = options;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(defaultPageSize);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterConfig[]>(initialFilters);
  const [refreshKey, setRefreshKey] = useState(0);

  const params = useMemo(() => {
    const built = buildListParams(page, pageSize, searchQuery, filters);
    return { ...defaultParams, ...built } as TransactionListParams;
  }, [page, pageSize, searchQuery, filters, defaultParams]);

  const loadTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await transactionService.getAll(params);
      setTransactions(response.data.transactions || []);
      setTotal(response.data.total ?? 0);
    } catch (error) {
      console.error("Error loading transactions:", error);
      toast.error("Có lỗi xảy ra khi tải danh sách giao dịch");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (!fetchOnMount) return;
    loadTransactions();
  }, [loadTransactions, refreshKey, fetchOnMount]);

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
    transactions,
    total,
    isLoading,
    page,
    pageSize,
    searchQuery,
    filters,
    params,
    refetch,
    setTransactions,
    setTotal,
    setPage,
    setPageSize,
    handleSearch,
    handleFilter,
    handleClearFilters,
  };
}
