import { useMemo } from "react";
import { DataTable, type Column, type QuickFilter } from "@/shared/components/DataTable";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useActivityLogs } from "../features/logs/hooks/useActivityLogs";
import type { ActivityLog } from "../features/logs/types/logs.types";
import UserSelector from "../features/user/components/UserSelector";

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN");
};

const LogsActivityPage = () => {
  const {
    logs,
    total,
    isLoading,
    page,
    pageSize,
    userId,
    fromDate,
    toDate,
    isDateRangeValid,
    hasExternalFilters,
    setPage,
    setPageSize,
    handleUserIdChange,
    handleFilter,
    handleClearFilters,
    handleFromDateChange,
    handleToDateChange,
  } = useActivityLogs(10);

  const columns: Column<ActivityLog>[] = useMemo(
    () => [
      {
        key: "userId",
        header: "User ID",
        sortable: true,
        accessor: (row) => <div className="font-medium">{row.userId || "-"}</div>,
      },
      {
        key: "userName",
        header: "Tên người dùng",
        sortable: true,
        accessor: (row) => (
          <div className="text-muted-foreground">{row.userName || "-"}</div>
        ),
      },
      {
        key: "action",
        header: "Hành động",
        sortable: true,
        accessor: (row) => row.action || "-",
      },
      {
        key: "resource",
        header: "Resource",
        sortable: true,
        accessor: (row) => row.resource || "-",
      },
      {
        key: "service",
        header: "Service",
        sortable: true,
        accessor: (row) => row.service || "-",
      },
      {
        key: "ipAddress",
        header: "IP",
        sortable: false,
        accessor: (row) => row.ipAddress || "-",
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
    // {
    //   key: "action",
    //   label: "Hành động",
    //   allStringValue: "Tất cả hành động",
    //   placeholder: "Chọn hành động",
    //   options: [
    //     { value: "LOGIN", label: "LOGIN" },
    //     { value: "LOGOUT", label: "LOGOUT" },
    //     { value: "CREATE", label: "CREATE" },
    //     { value: "UPDATE", label: "UPDATE" },
    //     { value: "DELETE", label: "DELETE" },
    //   ],
    // },
    // {
    //   key: "resource",
    //   label: "Resource",
    //   allStringValue: "Tất cả resource",
    //   placeholder: "Chọn resource",
    //   options: [
    //     { value: "Auth", label: "Auth" },
    //     { value: "User", label: "User" },
    //     { value: "Order", label: "Order" },
    //     { value: "Locker", label: "Locker" },
    //   ],
    // },
    // {
    //   key: "service",
    //   label: "Service",
    //   allStringValue: "Tất cả service",
    //   placeholder: "Chọn service",
    //   options: [
    //     { value: "gateway", label: "gateway" },
    //     { value: "user-service", label: "user-service" },
    //     { value: "locker-service", label: "locker-service" },
    //     { value: "order-service", label: "order-service" },
    //   ],
    // },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Logs hoạt động</h1>
        <p className="text-muted-foreground mt-2">
          Theo dõi lịch sử thao tác hệ thống của người dùng và dịch vụ.
        </p>
      </div>

      <div className="rounded-md border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Người dùng</Label>
            <UserSelector
              value={userId}
              onValueChange={handleUserIdChange}
              placeholder="Chọn người dùng"
              allowClear
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fromDate">Từ thời gian</Label>
            <Input
              id="fromDate"
              type="date"
              value={fromDate}
              max={toDate || undefined}
              onChange={(e) => handleFromDateChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="toDate">Đến thời gian</Label>
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
        keyExtractor={(row) => row._id}
        emptyMessage="Chưa có nhật ký hoạt động nào"
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
          pageSizeOptions: [5, 10, 20, 50, 100],
        }}
        searchable={false}
        // quickFilters={quickFilters}
        onQuickFilterChange={() => setPage(1)}
        onClearFilters={handleClearFilters}
        hasExternalFilters={hasExternalFilters}
      />
    </div>
  );
};

export default LogsActivityPage;