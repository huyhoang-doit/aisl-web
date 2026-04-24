import { useState, useCallback, useEffect } from "react";
import { sizeService, type SizeListParams } from "../services/size.service";
import type { Size } from "../types/size.types";
import { toast } from "sonner";

interface UseSizeProps {
  defaultPageSize?: number;
  search?: string;
}

export const useSize = (props: UseSizeProps = {}) => {
  const { defaultPageSize = 10, search: initialSearch = "" } = props;

  const [sizes, setSizes] = useState<Size[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [search, setSearch] = useState(initialSearch);
  const [filters, setFilters] = useState<Partial<SizeListParams>>({});

  const fetchSizes = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: SizeListParams = {
        page,
        limit: pageSize,
        search: search.trim() || undefined,
        ...filters,
      };
      const response = await sizeService.getAll(params);
      setSizes(response.data.sizes ?? []);
      setTotal(response.data.pagination?.total ?? 0);
    } catch (error) {
      console.error("Error fetching sizes:", error);
      toast.error("Không tải được danh sách kích thước");
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, search, filters]);

  useEffect(() => {
    fetchSizes();
  }, [fetchSizes]);

  const refetch = useCallback(() => {
    fetchSizes();
  }, [fetchSizes]);

  const handleSearch = useCallback((query: string) => {
    setSearch(query);
    setPage(1);
  }, []);

  const handleFilter = useCallback((newFilters: Partial<SizeListParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setSearch("");
    setPage(1);
  }, []);

  return {
    sizes,
    total,
    isLoading,
    page,
    pageSize,
    search,
    refetch,
    setSizes,
    setTotal,
    setPage,
    setPageSize,
    handleSearch,
    handleFilter,
    handleClearFilters,
  };
};
