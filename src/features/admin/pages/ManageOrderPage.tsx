import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderAdminApi } from "../features/order/api/order.api";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { toast } from "sonner";
import { Loader2, Plus, RefreshCw } from "lucide-react";
import OrderTable from "../features/order/components/OrderTable";
import OrderDetailModal from "../features/order/components/OrderDetailModal";
import type { Order, OrderWithDetails } from "../features/order/types/order.types";

export default function ManageOrderPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [quickOrderId, setQuickOrderId] = useState("");

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["orders", page, limit, search],
    queryFn: () => orderAdminApi.getOrders({ page, limit, orderCode: search }),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => orderAdminApi.forceCancelOrder(id),
    onSuccess: () => {
      toast.success("Hủy đơn hàng thành công");
      setQuickOrderId("");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Hủy đơn hàng thất bại");
    },
  });

  const completeMutation = useMutation({
    mutationFn: (id: string) => orderAdminApi.forceCompleteOrder(id),
    onSuccess: () => {
      toast.success("Hoàn thành đơn hàng thành công");
      setQuickOrderId("");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Hoàn thành đơn hàng thất bại");
    },
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

  const handleForceCancel = () => {
    if (!quickOrderId) {
      toast.error("Vui lòng nhập mã đơn hàng");
      return;
    }
    if (confirm("Bạn có chắc chắn muốn HỦY đơn hàng này?")) {
      cancelMutation.mutate(quickOrderId);
    }
  };

  const handleForceComplete = () => {
    if (!quickOrderId) {
      toast.error("Vui lòng nhập mã đơn hàng");
      return;
    }
    if (confirm("Bạn có chắc chắn muốn HOÀN THÀNH đơn hàng này?")) {
      completeMutation.mutate(quickOrderId);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 py-4 -mt-6 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Quản lý Đơn hàng</h1>
          <p className="text-muted-foreground">Theo dõi và quản lý các đơn gửi hàng, thuê tủ trên toàn hệ thống.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading || isFetching}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} /> Làm mới
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-none shadow-md overflow-hidden bg-card/50 backdrop-blur">
            <CardContent className="p-0">
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
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-primary/10 shadow-lg">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" /> Thao tác nhanh
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                    ID Đơn hàng (Quick ID)
                </label>
                <Input
                  className="bg-muted/50 border-primary/20"
                  placeholder="ID hệ thống..."
                  value={quickOrderId}
                  onChange={(e) => setQuickOrderId(e.target.value)}
                />
                <p className="text-[10px] text-muted-foreground flex items-center gap-1 italic">
                    * Nhập ID thật để thực hiện hủy/hoàn thành cưỡng bức
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-2">
                <Button
                  variant="destructive"
                  className="w-full justify-start font-bold"
                  onClick={handleForceCancel}
                  disabled={cancelMutation.isPending || completeMutation.isPending}
                >
                  {cancelMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Hủy đơn hàng (Force)
                </Button>

                <Button
                  variant="default"
                  className="w-full justify-start bg-green-600 hover:bg-green-700 font-bold"
                  onClick={handleForceComplete}
                  disabled={cancelMutation.isPending || completeMutation.isPending}
                >
                  {completeMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Hoàn thành đơn (Force)
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-6 shadow-sm">
            <h4 className="text-blue-800 dark:text-blue-300 font-bold text-base mb-2 flex items-center gap-2">
              Lưu ý nghiệp vụ
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-200 leading-relaxed italic">
              Các đơn hàng "Gửi/Nhận hàng" (Logistics) sẽ tự động hoàn thành khi người nhận lấy hàng. 
              Sử dụng tính năng Force action chỉ khi hệ thống gặp sự cố kĩ thuật.
            </p>
          </div>
        </div>
      </div>

      <OrderDetailModal
        orderData={selectedOrder}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
}
