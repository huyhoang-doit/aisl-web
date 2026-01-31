import React from "react";
import { DataTable, type Column } from "@/shared/components/DataTable";
import { Badge } from "@/shared/components/ui/badge";
import { Eye } from "lucide-react";
import type { Locker, LockerStatus } from "../types/locker.types";

const STATUS_CONFIG: Record<LockerStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  AVAILABLE: { label: "Trống", variant: "default" },
  OCCUPIED: { label: "Đã thuê", variant: "secondary" },
  MAINTENANCE: { label: "Bảo trì", variant: "destructive" },
  RESERVED: { label: "Đã đặt", variant: "outline" },
};

interface LockerTableProps {
  lockers: Locker[];
  onEdit?: (locker: Locker) => void;
  onDelete?: (locker: Locker) => void;
  onViewDetails?: (locker: Locker) => void;
  onCreate?: () => void;
  isLoading?: boolean;
}

const LockerTable: React.FC<LockerTableProps> = ({
  lockers,
  onEdit,
  onDelete,
  onViewDetails,
  onCreate,
  isLoading = false,
}) => {
  const columns: Column<Locker>[] = [
    {
      key: "code",
      header: "Mã / Vị trí",
      sortable: true,
      accessor: (row) => (
        <div className="font-medium font-mono">
          {row.code || `H${row.row}-C${row.column}`}
        </div>
      ),
    },
    {
      key: "size",
      header: "Kích thước",
      sortable: true,
      accessor: (row) => (
        <Badge variant="outline">{row.size?.name || "—"}</Badge>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      sortable: true,
      accessor: (row) => {
        const config = STATUS_CONFIG[row.status || "AVAILABLE"];
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      key: "row",
      header: "Hàng",
      sortable: true,
      accessor: (row) => <div>{row.row}</div>,
    },
    {
      key: "column",
      header: "Cột",
      sortable: true,
      accessor: (row) => <div>{row.column}</div>,
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
    />
  );
};

export default LockerTable;
