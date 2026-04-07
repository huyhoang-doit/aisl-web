import { useCallback, useMemo } from "react";
import { DataTable, type Column, type QuickFilter } from "@/shared/components/DataTable";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useDeviceLogs } from "../features/logs/hooks/useDeviceLogs";
import type { DeviceLog } from "../features/logs/types/logs.types";
import CabinetSelector from "../features/cabinet/components/CabinetSelector";
import LockerSelector from "../features/locker/components/LockerSelector";

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN");
};

const LogsDevicePage = () => {
  const {
    logs,
    total,
    isLoading,
    page,
    pageSize,
    cabinetId,
    lockerId,
    fromDate,
    toDate,
    isDateRangeValid,
    hasExternalFilters,
    setPage,
    setPageSize,
    handleFilter,
    handleClearFilters,
    handleCabinetIdChange,
    handleLockerIdChange,
    handleFromDateChange,
    handleToDateChange,
  } = useDeviceLogs(50);
    console.log("🚀 ~ LogsDevicePage ~ logs:", logs)

  const handleCabinetChange = useCallback(
    (value: string) => {
      handleCabinetIdChange(value);
      handleLockerIdChange("");
    },
    [handleCabinetIdChange, handleLockerIdChange]
  );

  const columns: Column<DeviceLog>[] = useMemo(
    () => [
      {
        key: "cabinetId",
        header: "Cabinet ID",
        sortable: true,
        accessor: (row) => <div className="font-medium">{row.cabinetId || "-"}</div>,
      },
      {
        key: "lockerId",
        header: "Locker ID",
        sortable: true,
        accessor: (row) => row.lockerId || "-",
      },
      {
        key: "eventType",
        header: "Loại sự kiện",
        sortable: true,
        accessor: (row) => row.eventType || "-",
      },
      {
        key: "direction",
        header: "Hướng",
        sortable: true,
        accessor: (row) => row.direction || "-",
      },
      {
        key: "service",
        header: "Service",
        sortable: true,
        accessor: (row) => row.service || "-",
      },
      {
        key: "message",
        header: "Nội dung",
        sortable: false,
        accessor: (row) => row.message || row.detail || "-",
      },
      {
        key: "createdAt",
        header: "Thời gian",
        sortable: true,
        accessor: (row) => formatDateTime(row.createdAt),
      },
    ],
    []
  );

  const quickFilters: QuickFilter[] = [
    {
      key: "sortOrder",
      label: "Sắp xếp",
      placeholder: "Sắp xếp",
      hideAllOption: true,
      defaultValue: "Mới nhất",
      options: [
        { value: "Mới nhất", label: "Mới nhất" },
        { value: "Cũ nhất", label: "Cũ nhất" },
      ],
    },
    {
      key: "direction",
      label: "Hướng",
      allStringValue: "Tất cả hướng",
      placeholder: "Chọn hướng",
      options: [
        { value: "INBOUND", label: "INBOUND" },
        { value: "OUTBOUND", label: "OUTBOUND" },
      ],
    },
    {
      key: "eventType",
      label: "Loại sự kiện",
      allStringValue: "Tất cả sự kiện",
      placeholder: "Chọn sự kiện",
      options: [
        { value: "OPEN", label: "OPEN" },
        { value: "CLOSE", label: "CLOSE" },
        { value: "LOCK", label: "LOCK" },
        { value: "UNLOCK", label: "UNLOCK" },
      ],
    },
    {
      key: "service",
      label: "Service",
      allStringValue: "Tất cả service",
      placeholder: "Chọn service",
      options: [
        { value: "gateway", label: "gateway" },
        { value: "locker-service", label: "locker-service" },
        { value: "device-service", label: "device-service" },
      ],
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Logs thiết bị</h1>
        <p className="text-muted-foreground mt-2">
          Theo dõi các sự kiện thiết bị theo tủ, ngăn tủ và dịch vụ xử lý.
        </p>
      </div>

      <div className="rounded-md border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Cabinet</Label>
            <CabinetSelector
              value={cabinetId}
              onValueChange={handleCabinetChange}
              placeholder="Chọn cabinet"
              allowClear
            />
          </div>
          <div className="space-y-2">
            <Label>Locker</Label>
            <LockerSelector
              value={lockerId}
              onValueChange={handleLockerIdChange}
              cabinetId={cabinetId}
              placeholder="Chọn locker"
              allowClear
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fromDate">Từ ngày</Label>
            <Input
              id="fromDate"
              type="date"
              value={fromDate}
              max={toDate || undefined}
              onChange={(e) => handleFromDateChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="toDate">Đến ngày</Label>
            <Input
              id="toDate"
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) => handleToDateChange(e.target.value)}
            />
          </div>
        </div>
        {!isDateRangeValid && (
          <p className="mt-3 text-sm text-destructive">
            Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc.
          </p>
        )}
      </div>

      <DataTable
        data={logs}
        columns={columns}
        keyExtractor={(row) =>
          row._id ||
          `${row.cabinetId || "unknown"}-${row.lockerId || "unknown"}-${row.createdAt || ""}`
        }
        emptyMessage="Chưa có nhật ký thiết bị nào"
        isLoading={isLoading}
        filterable={false}
        onSort={() => setPage(1)}
        onFilter={handleFilter}
        pagination={{
          page,
          pageSize,
          total,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
          pageSizeOptions: [10, 20, 50, 100],
        }}
        searchable={false}
        quickFilters={quickFilters}
        onQuickFilterChange={() => setPage(1)}
        onClearFilters={handleClearFilters}
        hasExternalFilters={hasExternalFilters}
      />
    </div>
  );
};

export default LogsDevicePage;