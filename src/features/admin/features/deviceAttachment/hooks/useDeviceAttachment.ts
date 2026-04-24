/**
 * Hook quản lý danh sách device attachment: fetch, pagination, filter, search.
 */
import type { Dispatch, SetStateAction } from "react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { DeviceAttachment } from "../types/deviceAttachment.types";
import {
  deviceAttachmentService,
  type DeviceAttachmentListParams,
} from "../services/deviceAttachment.service";
import type { FilterConfig } from "@/shared/components/DataTable";

function buildListParams(
  page: number,
  limit: number,
  searchQuery: string,
  filters: FilterConfig[],
  cabinetId?: string
): DeviceAttachmentListParams {
  const params: DeviceAttachmentListParams = {
    page,
    limit,
  };
  if (cabinetId) params.cabinetId = cabinetId;
  if (searchQuery.trim()) params.search = searchQuery.trim();
  filters.forEach((filter) => {
    if (
      filter.key === "isActive" &&
      filter.value &&
      filter.value !== "__all__"
    ) {
      params.isActive = String(filter.value).toLowerCase() === "true";
    }
  });
  return params;
}

function getListFromResponse(response: Awaited<ReturnType<typeof deviceAttachmentService.getAll>>): DeviceAttachment[] {
  const d = response?.data;
  if (!d) return [];
  return (
    d.deviceAttachments ??
    (d as { items?: DeviceAttachment[] }).items ??
    (d as { content?: DeviceAttachment[] }).content ??
    (d as { data?: DeviceAttachment[] }).data ??
    []
  );
}

export interface UseDeviceAttachmentOptions {
  defaultPageSize?: number;
  fetchOnMount?: boolean;
  cabinetId?: string;
}

export interface UseDeviceAttachmentReturn {
  deviceAttachments: DeviceAttachment[];
  total: number;
  isLoading: boolean;
  page: number;
  pageSize: number;
  setDeviceAttachments: Dispatch<SetStateAction<DeviceAttachment[]>>;
  setPage: (pageOrUpdater: number | ((prev: number) => number)) => void;
  setPageSize: (newSize: number) => void;
  refetch: () => void;
  handleSearch: (searchValue: string) => void;
  handleFilter: (filterList: FilterConfig[]) => void;
  handleClearFilters: () => void;
}

export function useDeviceAttachment(
  options: UseDeviceAttachmentOptions = {}
): UseDeviceAttachmentReturn {
  const {
    defaultPageSize = 10,
    fetchOnMount = true,
    cabinetId,
  } = options;

  const [deviceAttachments, setDeviceAttachments] = useState<DeviceAttachment[]>(
    []
  );
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

  const loadList = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await deviceAttachmentService.getAll(params);
      setDeviceAttachments(getListFromResponse(response));
      const pagination = response.data?.pagination;
      setTotal(
        pagination?.total ??
          (pagination as { totalElements?: number })?.totalElements ??
          0
      );
    } catch (error) {
      console.error("Error loading device attachments:", error);
      toast.error("Có lỗi xảy ra khi tải danh sách thiết bị");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (!fetchOnMount) return;
    loadList();
  }, [loadList, refreshKey, fetchOnMount]);

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
    deviceAttachments,
    total,
    isLoading,
    page,
    pageSize,
    setDeviceAttachments,
    setPage,
    setPageSize,
    refetch,
    handleSearch,
    handleFilter,
    handleClearFilters,
  };
}
