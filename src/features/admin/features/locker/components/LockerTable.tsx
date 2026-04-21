import React from "react";
import { DataTable, type Column } from "@/shared/components/DataTable";
import { Badge } from "@/shared/components/ui/badge";
import { Eye, Link2Off } from "lucide-react";
import type { Locker, LockerStatus } from "../types/locker.types";

const STATUS_CONFIG: Record<LockerStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  AVAILABLE: { label: "Trống", variant: "default" },
  OCCUPIED: { label: "Đã thuê", variant: "secondary" },
  MAINTENANCE: { label: "Bảo trì", variant: "destructive" },
  RESERVED: { label: "Đã đặt", variant: "outline" },
  LOCKED_BY_BALANCE: { label: "Đã khóa bởi ví", variant: "outline" },
  INITIALIZING: { label: "Đang khởi tạo", variant: "outline" },
};

interface LockerTablePagination {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (_page: number) => void;
  onPageSizeChange?: (_size: number) => void;
  pageSizeOptions?: number[];
}

interface LockerTableProps {
  lockers: Locker[];
  onEdit?: (_locker: Locker) => void;
  onDelete?: (_locker: Locker) => void;
  onViewDetails?: (_locker: Locker) => void;
  onUnassign?: (_locker: Locker) => void;
  onCreate?: () => void;
  isLoading?: boolean;
  pagination?: LockerTablePagination;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (_query: string) => void;
}

const LockerTable: React.FC<LockerTableProps> = ({
  lockers,
  onEdit,
  onDelete,
  onViewDetails,
  onUnassign,
  onCreate,
  isLoading = false,
  pagination,
  searchable = false,
  searchPlaceholder = "Tìm theo mã, vị trí locker...",
  onSearch,
}) => {
  // Hiển thị theo response BE: row, column, lockerLabel, sizeType, status, hwState?, isActive, totalUsageTime?
  const columns: Column<Locker>[] = [
    {
      key: "row",
      header: "Hàng",
      sortable: true,
      accessor: (row) => <div className="text-center">{row.row}</div>,
    },
    {
      key: "column",
      header: "Cột",
      sortable: true,
      accessor: (row) => <div className="text-center">{row.column}</div>,
    },
    {
      key: "lockerLabel",
      header: "Nhãn",
      sortable: true,
      accessor: (row) => (
        <div className="font-mono text-sm">
          {row.lockerLabel ?? `${row.row}-${row.column}`}
        </div>
      ),
    },
    {
      key: "sizeType",
      header: "Kích thước",
      sortable: true,
      accessor: (row) => (
        <span className="text-sm">{row.sizeType?.name ?? "—"}</span>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      sortable: true,
      accessor: (row) => {
        const config = STATUS_CONFIG[row.status];
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      key: "hwState",
      header: "Cửa",
      sortable: true,
      accessor: (row) => (
        <span className="text-sm">{row.hwState ?? "—"}</span>
      ),
    },
    {
      key: "isActive",
      header: "Hoạt động",
      sortable: true,
      accessor: (row) => (
        <Badge variant={row.isActive ? "default" : "secondary"}>
          {row.isActive ? "Có" : "Không"}
        </Badge>
      ),
    },
  ];

  const customActions = [
    ...(onViewDetails
      ? [
          {
            label: "Xem chi tiết",
            icon: <Eye className="h-4 w-4" />,
            onClick: onViewDetails,
            variant: "ghost" as const,
          },
        ]
      : []),
    ...(onUnassign
      ? [
          {
            label: "Gỡ khỏi cabinet",
            icon: <Link2Off className="h-4 w-4" />,
            onClick: onUnassign,
            variant: "ghost" as const,
          },
        ]
      : []),
  ];

  return (
    <DataTable
      data={lockers}
      columns={columns}
      keyExtractor={(row) => row.id}
      onEdit={onEdit}
      onDelete={onDelete}
      onCreate={onCreate}
      customActions={customActions}
      emptyMessage="Chưa có locker nào"
      isLoading={isLoading}
      loadingMessage="Đang tải danh sách locker..."
      pagination={pagination}
      searchable={searchable}
      searchPlaceholder={searchPlaceholder}
      onSearch={onSearch}
    />
  );
};

export default LockerTable;
