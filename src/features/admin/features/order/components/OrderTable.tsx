import React from "react";
import { DataTable, type Column } from "@/shared/components/DataTable";
import { Eye, Clock, Package, User } from "lucide-react";
import type { Order, OrderStatus } from "../types/order.types";
import { Badge } from "@/shared/components/ui/badge";
import { format } from "date-fns";

interface OrderTablePagination {
  page: number;
  pageSize: number;
  total: number;
  /* eslint-disable no-unused-vars */
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  /* eslint-enable no-unused-vars */
}

interface OrderTableProps {
  orders: Order[];
  onViewDetails?: (order: Order) => void; // eslint-disable-line no-unused-vars
  isLoading?: boolean;
  pagination?: OrderTablePagination;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void; // eslint-disable-line no-unused-vars
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  onViewDetails,
  isLoading = false,
  pagination,
  searchable = false,
  searchPlaceholder = "Tìm kiếm mã đơn hàng...",
  onSearch,
}) => {
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="default" className="bg-blue-500">Đang hoạt động</Badge>;
      case "COMPLETED":
        return <Badge variant="default" className="bg-green-500">Hoàn thành</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Đã hủy</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getOrderTypeLabel = (type: string) => {
    switch (type) {
      case "PERSONAL_RENTAL":
        return "Thuê cá nhân";
      case "LOGISTICS":
        return "Gửi/Nhận hàng";
      case "SHARED_RENTAL":
        return "Thuê chung";
      default:
        return type;
    }
  };

  const columns: Column<Order>[] = [
    {
      key: "orderCode",
      header: "Mã đơn hàng",
      sortable: true,
      accessor: (row) => (
        <div className="font-medium text-primary flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          {row.orderCode}
        </div>
      ),
    },
    {
      key: "orderType",
      header: "Loại đơn",
      accessor: (row) => (
        <Badge variant="outline">{getOrderTypeLabel(row.orderType)}</Badge>
      ),
    },
    {
      key: "userId",
      header: "Khách hàng",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <User className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs truncate max-w-[100px]">{row.userId}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      accessor: (row) => getStatusBadge(row.status),
    },
    {
      key: "createdAt",
      header: "Ngày tạo",
      sortable: true,
      accessor: (row) => (
        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          <Clock className="h-3 w-3" />
          {format(new Date(row.createdAt), "dd/MM/yyyy HH:mm")}
        </div>
      ),
    },
    {
        key: "accumulatedFee",
        header: "Tích lũy phí",
        accessor: (row) => (
            <div className="text-right font-semibold">
                {row.accumulatedFee.toLocaleString()} đ
            </div>
        )
    }
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
      data={orders}
      columns={columns}
      keyExtractor={(row) => row.id}
      customActions={customActions}
      emptyMessage="Chưa có đơn hàng nào"
      isLoading={isLoading}
      loadingMessage="Đang tải danh sách đơn hàng..."
      pagination={pagination}
      searchable={searchable}
      searchPlaceholder={searchPlaceholder}
      onSearch={onSearch}
    />
  );
};

export default OrderTable;
