import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { orderAdminApi } from "../features/order/api/order.api";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { AlertTriangle, RefreshCw, Zap } from "lucide-react";
import OrderTable from "../features/order/components/OrderTable";
import OrderDetailModal from "../features/order/components/OrderDetailModal";
import QuickHandleOrderModal from "../features/order/components/QuickHandleOrderModal";
import type { Order, OrderWithDetails } from "../features/order/types/order.types";

export default function ManageOrderPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isQuickHandleOpen, setIsQuickHandleOpen] = useState(false);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["orders", page, limit, search],
    queryFn: () => orderAdminApi.getOrders({ page, limit, orderCode: search }),
  });

  const handleViewDetails = async (order: Order) => {
    try {
      const response = await orderAdminApi.getOrderDetails(order.id);
      setSelectedOrder(response);
      setIsDetailModalOpen(true);
    } catch {
      toast.error("Không thể tải chi tiết đơn hàng");
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý đơn hàng</h1>
          <p className="text-muted-foreground">Theo dõi và quản lý các đơn gửi hàng, thuê tủ trên toàn hệ thống.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsQuickHandleOpen(true)}
          >
            <AlertTriangle className="h-4 w-4 mr-2" /> Thao tác nhanh
          </Button>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading || isFetching}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} /> Làm mới
          </Button>
        </div>
      </div>


      <OrderTable
        orders={data?.orders || []}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
        searchable
        onSearch={(query: string) => {
          setSearch(query);
          setPage(1);
        }}
        pagination={
          data?.pagination
            ? {
              page: data.pagination.page,
              pageSize: data.pagination.limit,
              total: data.pagination.total,
              onPageChange: (page: number) => {
                setPage(page);
              },
              onPageSizeChange: (size: number) => {
                setLimit(size);
                setPage(1);
              },
            }
            : undefined
        }
      />

      <OrderDetailModal
        orderData={selectedOrder}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedOrder(null);
        }}
      />

      <QuickHandleOrderModal
        isOpen={isQuickHandleOpen}
        onClose={() => setIsQuickHandleOpen(false)}
      />
    </div>
  );
}
