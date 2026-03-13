/**
 * Hook quản lý danh sách loại phương tiện: fetch, pagination, search.
 */
import type { Dispatch, SetStateAction } from "react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { VehicleType } from "../types/vehicleType.types";
import {
  vehicleTypeService,
  type VehicleTypeListParams,
} from "../services/vehicleType.service";

export interface UseVehicleTypesOptions {
  defaultPageSize?: number;
  fetchOnMount?: boolean;
  defaultParams?: Partial<VehicleTypeListParams>;
}

export interface UseVehicleTypesReturn {
  vehicleTypes: VehicleType[];
  total: number;
  isLoading: boolean;
  page: number;
  pageSize: number;
  searchQuery: string;
  refetch: () => void;
  setVehicleTypes: Dispatch<SetStateAction<VehicleType[]>>;
  setTotal: Dispatch<SetStateAction<number>>;
  setPage: (pageOrUpdater: number | ((prev: number) => number)) => void;
  setPageSize: (newSize: number) => void;
  handleSearch: (searchValue: string) => void;
}

export function useVehicleTypes(options: UseVehicleTypesOptions = {}): UseVehicleTypesReturn {
  const { defaultPageSize = 10, fetchOnMount = true, defaultParams } = options;

  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(defaultPageSize);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const params = useMemo((): VehicleTypeListParams => {
    return {
      page,
      limit: pageSize,
      search: searchQuery.trim() || undefined,
      ...defaultParams,
    };
  }, [page, pageSize, searchQuery, defaultParams]);

  const loadVehicleTypes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await vehicleTypeService.getAll(params);
      setVehicleTypes(response.data || []);
      setTotal(response.pagination?.total ?? response.data?.length ?? 0);
    } catch (error) {
      console.error("Error loading vehicle types:", error);
      toast.error("Có lỗi xảy ra khi tải danh sách loại phương tiện");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (!fetchOnMount) return;
    loadVehicleTypes();
  }, [loadVehicleTypes, refreshKey, fetchOnMount]);

  const refetch = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setPage(1);
  }, []);

  return {
    vehicleTypes,
    total,
    isLoading,
    page,
    pageSize,
    searchQuery,
    refetch,
    setVehicleTypes,
    setTotal,
    setPage,
    setPageSize,
    handleSearch,
  };
}
