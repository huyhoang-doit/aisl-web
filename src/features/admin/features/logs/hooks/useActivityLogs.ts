import { useState } from "react";
import type { ActivityLog } from "../types/logs.types";

export const useActivityLogs = (initialPageSize = 10) => {
  const [logs] = useState<ActivityLog[]>([]);
  const [total] = useState(0);
  const [isLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [userId, setUserId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  return {
    logs,
    total,
    isLoading,
    page,
    pageSize,
    userId,
    fromDate,
    toDate,
    isDateRangeValid: true,
    hasExternalFilters: false,
    setPage,
    setPageSize,
    handleUserIdChange: setUserId,
    handleFilter: () => {},
    handleClearFilters: () => {},
    handleFromDateChange: setFromDate,
    handleToDateChange: setToDate,
  };
};
