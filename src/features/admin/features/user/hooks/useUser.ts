/**
 * Hook quản lý danh sách user: fetch, pagination, filter, search.
 */
import type { Dispatch, SetStateAction } from "react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { User, UserStatusValue } from "../types/user.types";
import {
  userService,
  type UserListParams,
} from "../services/user.service";
import type { FilterConfig } from "@/shared/components/DataTable";
import { roles } from "@/shared/configs/role";

function buildListParams(
  page: number,
  limit: number,
  searchQuery: string,
  filters: FilterConfig[]
): UserListParams {
  const params: UserListParams = {
    page,
    limit,
  };
  if (searchQuery.trim()) params.search = searchQuery.trim();
  filters.forEach((filter) => {
    if (filter.key === "role" && filter.value) {
      params.role = filter.value === "Quản trị viên" ? roles.ADMIN : roles.STAFF;
    }
    if (filter.key === "status" && filter.value) {
      const statusMap: Record<string, UserStatusValue> = {
        "Hoạt động": "ACTIVE",
        "Không hoạt động": "INACTIVE",
        "Đã khóa": "LOCKED",
      };
      params.status = statusMap[filter.value];
    }
  });
  return params;
}

export interface UseUserOptions {
  defaultPageSize?: number;
  fetchOnMount?: boolean;
}

export interface UseUserReturn {
  users: User[];
  total: number;
  isLoading: boolean;
  page: number;
  pageSize: number;
  searchQuery: string;
  filters: FilterConfig[];
  params: UserListParams;
  refetch: () => void;
  setUsers: Dispatch<SetStateAction<User[]>>;
  setTotal: Dispatch<SetStateAction<number>>;
  setPage: (pageOrUpdater: number | ((prev: number) => number)) => void;
  setPageSize: (newSize: number) => void;
  handleSearch: (searchValue: string) => void;
  handleFilter: (filterList: FilterConfig[]) => void;
  handleClearFilters: () => void;
}

export function useUser(options: UseUserOptions = {}): UseUserReturn {
  const { defaultPageSize = 10, fetchOnMount = true } = options;

  const [users, setUsers] = useState<User[]>([]);
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

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await userService.getAll(params);
      setUsers(response.data.users || []);
      setTotal(response.data.pagination?.total ?? 0);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Có lỗi xảy ra khi tải danh sách người dùng");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (!fetchOnMount) return;
    loadUsers();
  }, [loadUsers, refreshKey, fetchOnMount]);

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
    users,
    total,
    isLoading,
    page,
    pageSize,
    searchQuery,
    filters,
    params,
    refetch,
    setUsers,
    setTotal,
    setPage,
    setPageSize,
    handleSearch,
    handleFilter,
    handleClearFilters,
  };
}
