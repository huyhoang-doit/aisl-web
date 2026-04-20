import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { 
  Package, 
  User, 
  MapPin, 
  Calendar, 
  Clock, 
  CreditCard, 
  ArrowRight,
  Info,
  QrCode
} from "lucide-react";
import type { OrderWithDetails, OrderStatus, OrderDetailStatus } from "../types/order.types";
import { format } from "date-fns";

interface OrderDetailModalProps {
  orderData: OrderWithDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  orderData,
  isOpen,
  onClose,
}) => {
  if (!orderData) return null;

  // Robustly extract order and orderDetails
  // Case 1: orderData is OrderWithDetails { order, orderDetails }
  // Case 2: orderData is a plain Order object
  const order = (orderData as any).order || (orderData as any);
  const orderDetails = (orderData as any).orderDetails || [];

  // Final check to ensure we have an order object with necessary properties
  if (!order || !order.orderCode) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lỗi dữ liệu</DialogTitle>
          </DialogHeader>
          <div className="p-6 text-center text-muted-foreground">
            Không thể hiển thị chi tiết đơn hàng do thiếu thông tin.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const getStatusBadge = (status: OrderStatus | OrderDetailStatus) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="default" className="bg-blue-500 text-xs">Đang hoạt động</Badge>;
      case "COMPLETED":
        return <Badge variant="default" className="bg-green-500 text-xs">Hoàn thành</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive" className="text-xs">Đã hủy</Badge>;
      case "IN_TRANSIT":
        return <Badge variant="default" className="bg-orange-500 text-xs">Đang vận chuyển</Badge>;
      case "WAITING_FOR_SENDER":
        return <Badge variant="outline" className="text-xs">Chờ người gửi</Badge>;
      case "WAITING_FOR_RECEIVER":
        return <Badge variant="outline" className="text-xs">Chờ người nhận</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">{status}</Badge>;
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="p-6 pb-2 border-b bg-muted/30">
          <div className="flex justify-between items-start pr-8">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-primary">
                <Package className="h-6 w-6" />
                Chi tiết đơn hàng {order.orderCode}
              </DialogTitle>
              <div className="flex gap-2 items-center text-muted-foreground text-sm">
                <span className="font-medium">{getOrderTypeLabel(order.orderType)}</span>
                <span>•</span>
                {getStatusBadge(order.status)}
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {order.createdAt ? format(new Date(order.createdAt), "dd/MM/yyyy HH:mm") : "—"}
                </span>
              </div>
            </div>
            <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Tổng tích lũy</p>
                <p className="text-2xl font-bold text-green-600">{(order.accumulatedFee || 0).toLocaleString()} đ</p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Order Info */}
            <div className="space-y-6">
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                  <Info className="h-4 w-4" /> Thông tin cơ bản
                </h3>
                <div className="grid grid-cols-1 gap-4 bg-card border rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Khách hàng ID:</span>
                    <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">{order.userId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Trạng thái thanh toán:</span>
                    <Badge variant={order.paymentStatus === "PAID" ? "default" : "outline"} 
                           className={order.paymentStatus === "PAID" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}>
                      {order.paymentStatus}
                    </Badge>
                  </div>
                  {order.transactionId && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Mã giao dịch:</span>
                      <span className="font-mono text-xs">{order.transactionId}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Đã thu:</span>
                    <span className="font-semibold">{(order.totalCollected || 0).toLocaleString()} đ</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm italic py-1">
                    <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Cập nhật cuối:
                    </span>
                    <span>{order.updatedAt ? format(new Date(order.updatedAt), "dd/MM/yyyy HH:mm:ss") : "—"}</span>
                  </div>
                </div>
              </section>

              {order.orderType === "LOGISTICS" && (
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Tuyến đường vận chuyển
                  </h3>
                  <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 flex items-center justify-between shadow-sm">
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className="h-10 w-10 rounded-full bg-white border-2 border-blue-200 flex items-center justify-center text-blue-600 shadow-inner">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold text-blue-800">GỬI TẠI</span>
                      <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[120px]">{order.originCabinetId || "—"}</span>
                    </div>
                    
                    <div className="flex-1 flex flex-col items-center">
                        <div className="relative w-full flex items-center justify-center">
                            <div className="h-[2px] bg-blue-200 w-full absolute top-[50%]"></div>
                            <ArrowRight className="h-5 w-5 text-blue-400 bg-blue-50 relative z-10 px-0.5" />
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className="h-10 w-10 rounded-full bg-white border-2 border-green-200 flex items-center justify-center text-green-600 shadow-inner">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold text-green-800">NHẬN TẠI</span>
                      <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[120px]">{order.destinationCabinetId || "—"}</span>
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* Order Details List */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <QrCode className="h-4 w-4" /> Các ô tủ chi tiết ({orderDetails.length})
              </h3>
              <div className="space-y-4">
                {orderDetails.map((detail: any) => (
                  <div key={detail.id} className="bg-card border rounded-lg overflow-hidden shadow-sm transition-all hover:border-primary/50">
                    <div className="p-3 bg-muted/20 border-b flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">Ô tủ: {detail.lockerLabel || "—"}</span>
                        <Badge variant="outline" className="text-[10px] font-mono">{detail.code}</Badge>
                      </div>
                      {getStatusBadge(detail.status)}
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-muted-foreground font-medium flex items-center gap-1 mb-1">
                            <MapPin className="h-3 w-3" /> ID Tủ
                          </p>
                          <p className="font-mono truncate">{detail.lockerId}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground font-medium flex items-center gap-1 mb-1">
                            <CreditCard className="h-3 w-3" /> Phí trễ hạn
                          </p>
                          <p className="font-semibold text-orange-600">{(detail.overdueFee || 0).toLocaleString()} đ</p>
                        </div>
                      </div>

                      {order.orderType === "LOGISTICS" && (
                        <div className="mt-3 pt-3 border-t space-y-3">
                          <div className="grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <p className="text-muted-foreground font-medium mb-1">Người nhận</p>
                                <p className="font-bold flex items-center gap-1">
                                    <User className="h-3 w-3" /> {detail.receiverName || "—"}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground font-medium mb-1">Email người nhận</p>
                                <p className="truncate">{detail.receiverEmail || "—"}</p>
                              </div>
                          </div>
                          {detail.note && (
                            <div>
                                <p className="text-muted-foreground font-medium text-xs mb-1">Ghi chú vận chuyển</p>
                                <p className="text-xs bg-muted/50 p-2 rounded border-l-4 border-primary/20 italic">
                                    "{detail.note}"
                                </p>
                            </div>
                          )}
                          {detail.accessCode && (
                            <div className="bg-primary/5 border border-primary/10 rounded p-2 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-primary uppercase">Mã truy cập ({detail.accessCode.type})</span>
                                <span className="font-mono text-sm font-bold tracking-widest">{detail.accessCode.code}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {order.orderType === "PERSONAL_RENTAL" && (
                        <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <p className="text-muted-foreground font-medium mb-1">Thời gian thuê</p>
                                <p>{detail.rentMonths} tháng</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground font-medium mb-1">Cố định</p>
                                <p>{detail.isFixed ? "Có" : "Không"}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-muted-foreground font-medium mb-1">Thời hạn</p>
                                <p className="flex items-center gap-1">
                                    {detail.rentStartDate ? format(new Date(detail.rentStartDate), "dd/MM/yy") : "—"}
                                    <ArrowRight className="h-3 w-3" />
                                    {detail.rentEndDate ? format(new Date(detail.rentEndDate), "dd/MM/yy") : "—"}
                                </p>
                            </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t bg-muted/10 flex justify-end">
            <button 
                onClick={onClose}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
                Đóng
            </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
