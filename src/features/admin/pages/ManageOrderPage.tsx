import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { orderAdminApi } from "../features/order/api/order.api";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ManageOrderPage() {
  const [orderId, setOrderId] = useState("");

  const cancelMutation = useMutation({
    mutationFn: (id: string) => orderAdminApi.forceCancelOrder(id),
    onSuccess: () => {
      toast.success("Hủy đơn hàng thành công");
      setOrderId("");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Hủy đơn hàng thất bại");
    },
  });

  const completeMutation = useMutation({
    mutationFn: (id: string) => orderAdminApi.forceCompleteOrder(id),
    onSuccess: () => {
      toast.success("Hoàn thành đơn hàng thành công");
      setOrderId("");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Hoàn thành đơn hàng thất bại");
    },
  });

  const handleForceCancel = () => {
    if (!orderId) {
      toast.error("Vui lòng nhập mã đơn hàng");
      return;
    }
    if (confirm("Bạn có chắc chắn muốn HỦY đơn hàng này?")) {
      cancelMutation.mutate(orderId);
    }
  };

  const handleForceComplete = () => {
    if (!orderId) {
      toast.error("Vui lòng nhập mã đơn hàng");
      return;
    }
    if (confirm("Bạn có chắc chắn muốn HOÀN THÀNH đơn hàng này?")) {
      completeMutation.mutate(orderId);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Đơn hàng</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thao tác khẩn cấp (Force Action)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Mã đơn hàng (Order ID)</label>
            <Input
              placeholder="Nhập mã đơn hàng..."
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <Button
              variant="destructive"
              onClick={handleForceCancel}
              disabled={cancelMutation.isPending || completeMutation.isPending}
            >
              {cancelMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Bắt buộc Hủy (Force Cancel)
            </Button>

            <Button
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              onClick={handleForceComplete}
              disabled={cancelMutation.isPending || completeMutation.isPending}
            >
              {completeMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Bắt buộc Hoàn thành (Force Complete)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
