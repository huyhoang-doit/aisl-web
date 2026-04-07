import { useState } from "react";
import type { DeviceLog } from "../types/logs.types";

export const useDeviceLogs = (initialPageSize = 10) => {
  const [logs] = useState<DeviceLog[]>([]);
  const [total] = useState(0);
  const [isLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [cabinetId, setCabinetId] = useState("");
  const [lockerId, setLockerId] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

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
    isDateRangeValid: true,
    hasExternalFilters: false,
    setPage,
    setPageSize,
    handleCabinetIdChange: setCabinetId,
    handleLockerIdChange: setLockerId,
    handleDeviceIdChange: setDeviceId,
    handleFilter: () => {},
    handleClearFilters: () => {},
    handleFromDateChange: setFromDate,
    handleToDateChange: setToDate,
  };
};
