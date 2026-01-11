import React from "react";
import { DataTable, type Column } from "@/shared/components/DataTable";
import { Badge } from "@/shared/components/ui/badge";
import { Eye } from "lucide-react";
import type { Locker } from "../types/locker.types.ts";

interface LockerTableProps {
  lockers: Locker[];
  // eslint-disable-next-line no-unused-vars
  onEdit?: (locker: Locker) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete?: (locker: Locker) => void;
  // eslint-disable-next-line no-unused-vars
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
      header: "Mã locker",
      sortable: true,
      accessor: (row) => (
        <div className="font-medium">{row.code}</div>
      ),
    },
    {
      key: "size",
      header: "Kích thước",
      sortable: true,
      accessor: (row) => {
        const sizeConfig = {
          small: { label: "Nhỏ", variant: "secondary" as const },
          medium: { label: "Vừa", variant: "default" as const },
          large: { label: "Lớn", variant: "default" as const },
        };
        const config = sizeConfig[row.size || "medium"];
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      key: "status",
      header: "Trạng thái",
      sortable: true,
      accessor: (row) => {
        const statusConfig = {
          available: { label: "Trống", variant: "default" as const },
          occupied: { label: "Đã thuê", variant: "secondary" as const },
          maintenance: { label: "Bảo trì", variant: "destructive" as const },
          reserved: { label: "Đã đặt", variant: "outline" as const },
        };
        const config = statusConfig[row.status || "available"];
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      key: "price",
      header: "Giá thuê",
      sortable: true,
      accessor: (row) => (
        <div>
          {row.price ? `${row.price.toLocaleString("vi-VN")} đ` : "-"}
        </div>
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