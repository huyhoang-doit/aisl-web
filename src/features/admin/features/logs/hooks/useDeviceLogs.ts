import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import type { DeviceLog } from "../types/logs.types";
import { logsService } from "../services/logs.service";
import type { FilterConfig } from "@/shared/components/DataTable";

export const useDeviceLogs = (initialPageSize = 10) => {
  const [logs, setLogs] = useState<DeviceLog[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [cabinetId, setCabinetId] = useState("");
  const [lockerId, setLockerId] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filters, setFilters] = useState<FilterConfig[]>([]);

  const isDateRangeValid = useMemo(() => {
    if (!fromDate || !toDate) return true;
    return new Date(fromDate) <= new Date(toDate);
  }, [fromDate, toDate]);

  const params = useMemo(() => {
    const p: any = {
      page,
      limit: pageSize,
      cabinetId: cabinetId || undefined,
      lockerId: lockerId || undefined,
      deviceId: deviceId || undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    };

    filters.forEach(f => {
      if (f.value && f.value !== "__all__") {
        p[f.key] = f.value;
      }
    });

    return p;
  }, [page, pageSize, cabinetId, lockerId, deviceId, fromDate, toDate, filters]);

  const fetchLogs = useCallback(async () => {
    if (!isDateRangeValid) return;

    try {
      setIsLoading(true);
      const response = await logsService.getDeviceLogs(params);
      const data = response.data;
      setLogs(data.items || []);
      setTotal(data.pagination?.total || data.pagination?.totalElements || 0);
    } catch (error) {
      console.error("Error fetching device logs:", error);
      toast.error("Không thể tải nhật ký thiết bị");
    } finally {
      setIsLoading(false);
    }
  }, [params, isDateRangeValid]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleFilter = useCallback((newFilters: FilterConfig[]) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters([]);
    setCabinetId("");
    setLockerId("");
    setDeviceId("");
    setFromDate("");
    setToDate("");
    setPage(1);
  }, []);

  return {
    logs,
    total,
    isLoading,
    page,
    pageSize,
    cabinetId,
    lockerId,
    deviceId,
    fromDate,
    toDate,
    isDateRangeValid,
    hasExternalFilters: !!(cabinetId || lockerId || deviceId || fromDate || toDate || filters.length),
    setPage,
    setPageSize,
    handleCabinetIdChange: (val: string) => {
      setCabinetId(val);
      setPage(1);
    },
    handleLockerIdChange: (val: string) => {
      setLockerId(val);
      setPage(1);
    },
    handleDeviceIdChange: (val: string) => {
      setDeviceId(val);
      setPage(1);
    },
    handleFilter,
    handleClearFilters,
    handleFromDateChange: (val: string) => {
      setFromDate(val);
      setPage(1);
    },
    handleToDateChange: (val: string) => {
      setToDate(val);
      setPage(1);
    },
  };
};
