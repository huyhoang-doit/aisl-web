import React from "react";
import { DataTable, type Column } from "@/shared/components/DataTable";
import { Badge } from "@/shared/components/ui/badge";
import { Eye } from "lucide-react";
import type { Cabinet } from "../types/cabinet.types";

interface CabinetTableProps {
  cabinets: Cabinet[];
  // eslint-disable-next-line no-unused-vars
  onEdit?: (cabinet: Cabinet) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete?: (cabinet: Cabinet) => void;
  // eslint-disable-next-line no-unused-vars
  onViewDetails?: (cabinet: Cabinet) => void;
  isLoading?: boolean;
}

const CabinetTable: React.FC<CabinetTableProps> = ({
  cabinets,
  onEdit,
  onDelete,
  onViewDetails,
  isLoading = false,
}) => {
  const columns: Column<Cabinet>[] = [
    {
      key: "code",
      header: "Mã cụm",
      sortable: true,
      accessor: (row) => (
        <div className="font-medium">{row.code}</div>
      ),
    },
    {
      key: "name",
      header: "Tên cụm",
      sortable: true,
      accessor: (row) => row.name,
    },
    {
      key: "totalLockers",
      header: "Tổng số locker",
      sortable: true,
      accessor: (row) => (
        <div className="text-center">{row.totalLockers}</div>
      ),
    },
    {
      key: "availableLockers",
      header: "Locker trống",
      sortable: true,
      accessor: (row) => (
        <div className="text-center font-medium text-green-600">
          {row.availableLockers}
        </div>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      sortable: true,
      accessor: (row) => {
        const statusConfig = {
          active: { label: "Hoạt động", variant: "default" as const },
          inactive: { label: "Không hoạt động", variant: "secondary" as const },
          maintenance: { label: "Bảo trì", variant: "destructive" as const },
        };
        const config = statusConfig[row.status || "active"];
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
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
      data={cabinets}
      columns={columns}
      keyExtractor={(row) => row.id}
      onEdit={onEdit}
      onDelete={onDelete}
      customActions={customActions}
      emptyMessage="Chưa có cabinet nào"
      isLoading={isLoading}
      loadingMessage="Đang tải danh sách cabinet..."
    />
  );
};

export default CabinetTable;
