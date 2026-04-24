import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import type { ActivityLog } from "../types/logs.types";
import { logsService } from "../services/logs.service";
import type { FilterConfig } from "@/shared/components/DataTable";

export const useActivityLogs = (initialPageSize = 10) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [userId, setUserId] = useState("");
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
      userId: userId || undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    };

    filters.forEach(f => {
      if (f.value && f.value !== "__all__") {
        p[f.key] = f.value;
      }
    });

    return p;
  }, [page, pageSize, userId, fromDate, toDate, filters]);

  const fetchLogs = useCallback(async () => {
    if (!isDateRangeValid) return;

    try {
      setIsLoading(true);
      const response = await logsService.getActivityLogs(params);
      const data = response.data;
      setLogs(data.items || []);
      setTotal(data.pagination?.total || 0);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      toast.error("Không thể tải nhật ký hoạt động");
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
    setUserId("");
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
    userId,
    fromDate,
    toDate,
    isDateRangeValid,
    hasExternalFilters: !!(userId || fromDate || toDate || filters.length),
    setPage,
    setPageSize,
    handleUserIdChange: (val: string) => {
      setUserId(val);
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
