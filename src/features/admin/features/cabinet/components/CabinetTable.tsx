import React from "react";
import { DataTable, type Column, type QuickFilter } from "@/shared/components/DataTable";
import { Eye } from "lucide-react";
import type { Cabinet } from "../types/cabinet.types";

interface CabinetTablePagination {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

interface CabinetTableProps {
  cabinets: Cabinet[];
  // eslint-disable-next-line no-unused-vars
  onEdit?: (cabinet: Cabinet) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete?: (cabinet: Cabinet) => void;
  // eslint-disable-next-line no-unused-vars
  onViewDetails?: (cabinet: Cabinet) => void;
  isLoading?: boolean;
  pagination?: CabinetTablePagination;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  quickFilters?: QuickFilter[];
  onQuickFilterChange?: (key: string, value: string) => void;
}

const CabinetTable: React.FC<CabinetTableProps> = ({
  cabinets,
  onEdit,
  onDelete,
  onViewDetails,
  isLoading = false,
  pagination,
  searchable = false,
  searchPlaceholder = "Tìm kiếm cabinet...",
  onSearch,
  quickFilters,
  onQuickFilterChange,
}) => {
  const columns: Column<Cabinet>[] = [
    {
      key: "name",
      header: "Tên cabinet",
      sortable: true,
      accessor: (row) => row.name,
    },
    {
      key: "macAddress",
      header: "MAC Address",
      sortable: true,
      accessor: (row) => row.macAddress || "—",
    },
    {
      key: "ipAddress",
      header: "IP Address",
      sortable: true,
      accessor: (row) => row.ipAddress || "—",
    },
    {
      key: "totalRows",
      header: "Số hàng",
      sortable: true,
      accessor: (row) => (
        <div className="text-center">{row.totalRows}</div>
      ),
    },
    {
      key: "totalColumns",
      header: "Số cột",
      sortable: true,
      accessor: (row) => (
        <div className="text-center">{row.totalColumns}</div>
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
      data={cabinets}
      columns={columns}
      keyExtractor={(row) => row.id}
      onEdit={onEdit}
      onDelete={onDelete}
      customActions={customActions}
      emptyMessage="Chưa có cabinet nào"
      isLoading={isLoading}
      loadingMessage="Đang tải danh sách cabinet..."
      pagination={pagination}
      searchable={searchable}
      searchPlaceholder={searchPlaceholder}
      onSearch={onSearch}
      quickFilters={quickFilters}
      onQuickFilterChange={onQuickFilterChange}
    />
  );
};

export default CabinetTable;
