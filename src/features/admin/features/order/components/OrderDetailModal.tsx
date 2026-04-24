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
import { cabinetService } from "../../cabinet/services/cabinet.service";
import { locationService } from "../../location/services/location.service";
import { pricingService } from "../../pricing/services/pricing.service";
import { EnumTranslator } from "@/shared/utils/enum-utils";
import { useEffect, useState, useRef, useMemo } from "react";
import { subscriptionService } from "../../subscription/services/subscription.service";
import type { Pricing } from "../../pricing/types/pricing.types";

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
  const [cabinetNames, setCabinetNames] = useState<Record<string, string>>({});
  const [cabinetToLocationName, setCabinetToLocationName] = useState<Record<string, string>>({});
  const [matchedPricing, setMatchedPricing] = useState<Pricing | null>(null);
  const [activePlanName, setActivePlanName] = useState<string | null>(null);
  const fetchedRef = useRef<Set<string>>(new Set());

  const order = useMemo(() => (orderData as any)?.order || (orderData as any), [orderData]);
  const orderDetails = useMemo(() => (orderData as any)?.orderDetails || [], [orderData]);

  useEffect(() => {
    if (!isOpen || !order) return;

    const cabinetIds = new Set<string>();
    if (order.rentalCabinetId) cabinetIds.add(order.rentalCabinetId);
    if (order.originCabinetId) cabinetIds.add(order.originCabinetId);
    if (order.destinationCabinetId) cabinetIds.add(order.destinationCabinetId);

    orderDetails.forEach((d: any) => {
        if (d.cabinetId) cabinetIds.add(d.cabinetId);
    });

    const fetchNames = async () => {
      const names: Record<string, string> = {};
      const cabLocNames: Record<string, string> = {};
      
      for (const id of Array.from(cabinetIds)) {
        if (fetchedRef.current.has(id)) continue;
        try {
          const res = await cabinetService.getById(id);
          if (res.data) {
            names[id] = res.data.name;
            fetchedRef.current.add(id);
            if (res.data.locationId) {
                try {
                    const locRes = await locationService.getById(res.data.locationId);
                    if (locRes.data) {
                        cabLocNames[id] = locRes.data.name;
                    }
                } catch (e) {
                    console.error(`Failed to fetch location ${res.data.locationId}`, e);
                }
            }
          }
        } catch (e) {
          console.error(`Failed to fetch cabinet ${id}`, e);
        }
      }

      if (Object.keys(names).length > 0) {
          setCabinetNames(prev => ({ ...prev, ...names }));
      }
      if (Object.keys(cabLocNames).length > 0) {
          setCabinetToLocationName(prev => ({ ...prev, ...cabLocNames }));
      }

      // Fetch Pricing to find match
      try {
        const pRes = await pricingService.getAll({ orderType: order.orderType });
        if (pRes.data && pRes.data.pricings) {
            const match = pRes.data.pricings.find(p => Number(p.feePerBlock) === Number(order.currentRate));
            if (match) setMatchedPricing(match);
        }
      } catch (e) {
          console.error("Failed to fetch pricings", e);
      }

      // Fetch User's Plan (Subscription)
      try {
          const sRes = await subscriptionService.getAll({ userId: order.userId, status: "ACTIVE" });
          if (sRes.data && sRes.data.subscriptions && sRes.data.subscriptions.length > 0) {
              const sub = sRes.data.subscriptions[0];
              if (sub.plan?.name) setActivePlanName(sub.plan.name);
          }
      } catch (e) {
          console.error("Failed to fetch user subscription", e);
      }
    };

    fetchNames();
  }, [isOpen, order, orderDetails]);

  if (!orderData) return null;

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
    const label = EnumTranslator.translateOrderDetailStatus(status) || EnumTranslator.translateOrderStatus(status);
    switch (status) {
      case "ACTIVE":
      case "OCCUPIED":
        return <Badge variant="default" className="bg-blue-500 text-xs">{label}</Badge>;
      case "COMPLETED":
        return <Badge variant="default" className="bg-green-500 text-xs">{label}</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive" className="text-xs">{label}</Badge>;
      case "IN_TRANSIT":
        return <Badge variant="default" className="bg-orange-500 text-xs">{label}</Badge>;
      case "WAITING_FOR_SENDER":
      case "WAITING_FOR_RECEIVER":
      case "AWAITING_PICKUP":
      case "AWAITING_COURIER":
        return <Badge variant="outline" className="text-xs">{label}</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">{label || status}</Badge>;
    }
  };

  const getOrderTypeLabel = (type: string) => {
    return EnumTranslator.translateOrderType(type);
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
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Tổng phí tích lũy</p>
                <div className="space-y-1">
                    <p className="text-2xl font-bold text-green-600">{(order.accumulatedFee || 0).toLocaleString()} đ</p>
                    <p className="text-[10px] text-muted-foreground italic">
                        Đã thu: <span className="font-bold text-primary">{(order.totalCollected || 0).toLocaleString()} đ</span>
                    </p>
                </div>
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
                           className={order.paymentStatus === "PAID" ? "bg-green-100 text-green-700 hover:bg-green-100 border-none" : ""}>
                      {EnumTranslator.translatePaymentStatus(order.paymentStatus)}
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
                    <span className="font-semibold text-primary">{(order.totalCollected || 0).toLocaleString()} đ</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-bold">Dư nợ hiện tại:</span>
                    <span className="font-bold text-red-600">
                        {Math.max(0, (order.accumulatedFee || 0) - (order.totalCollected || 0)).toLocaleString()} đ
                    </span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 gap-2 text-[11px] bg-muted/40 p-3 rounded-lg border border-primary/5">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Đơn giá thuê</span>
                        <span className="font-bold text-primary">
                            {matchedPricing 
                                ? `${matchedPricing.feePerBlock.toLocaleString()} đ / ${matchedPricing.blockDuration} ${EnumTranslator.translateFeeBlockUnit(matchedPricing.blockUnit)}`
                                : `${(order.rentalUnitPrice || order.currentRate || 0).toLocaleString()} đ / block`
                            }
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Đơn giá vận chuyển</span>
                        <span className="font-bold text-primary">{(order.shippingUnitPrice || 0).toLocaleString()} đ / đơn</span>
                    </div>
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
                      <span className="text-[10px] text-muted-foreground font-bold text-center">
                        {cabinetNames[order.originCabinetId] || "—"}
                      </span>
                      <span className="text-[9px] text-muted-foreground font-mono truncate max-w-[100px]">{order.originCabinetId || "—"}</span>
                    </div>
                    
                    <div className="flex-1 flex flex-col items-center">
                        <div className="relative w-full flex items-center justify-center">
                            <div className="h-[2px] bg-blue-200 w-full absolute top-[50%]"></div>
                            <ArrowRight className="h-5 w-5 text-blue-400 bg-blue-50 relative z-10 px-0.5" />
                        </div>
                        <span className="text-[10px] text-blue-600 mt-1 font-bold">
                            {EnumTranslator.translateLogisticsType(order.logisticsType || "")}
                        </span>
                    </div>

                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className="h-10 w-10 rounded-full bg-white border-2 border-green-200 flex items-center justify-center text-green-600 shadow-inner">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold text-green-800">NHẬN TẠI</span>
                      <span className="text-[10px] text-muted-foreground font-bold text-center">
                        {cabinetNames[order.destinationCabinetId] || "—"}
                      </span>
                      <span className="text-[9px] text-muted-foreground font-mono truncate max-w-[100px]">{order.destinationCabinetId || "—"}</span>
                    </div>
                  </div>
                </section>
              )}

              {order.orderType === "PERSONAL_RENTAL" && (
                <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> Vị trí thuê
                    </h3>
                    <div className="bg-orange-50/50 border border-orange-100 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-white border-2 border-orange-200 flex items-center justify-center text-orange-600 shadow-inner shrink-0">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-orange-900">{cabinetNames[order.rentalCabinetId] || "Tủ thuê cá nhân"}</p>
                                {cabinetToLocationName[order.rentalCabinetId] && (
                                    <p className="text-[10px] text-orange-700 font-medium">
                                        <MapPin className="h-2 w-2 inline mr-1" /> {cabinetToLocationName[order.rentalCabinetId]}
                                    </p>
                                )}
                                <p className="text-[9px] text-muted-foreground mt-1 italic">ID Tủ: {order.rentalCabinetId || "—"}</p>
                            </div>
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
                        <div className="flex flex-col">
                            <span className="font-bold text-sm">
                                {detail.lockerLabel ? `Ô tủ: ${detail.lockerLabel}` : `Vị trí: Hàng ${detail.row} - Cột ${detail.column}`}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">{detail.code}</span>
                        </div>
                      </div>
                      {getStatusBadge(detail.status)}
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-bold italic">
                            Gói cước: <span className="text-primary normal-case text-sm ml-1">{activePlanName || matchedPricing?.name || "Mặc định"}</span>
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold w-fit">
                                {order.isPrepaid ? "THANH TOÁN TRƯỚC" : "THANH TOÁN SAU"}
                            </div>
                            {matchedPricing?.name && activePlanName && matchedPricing.name !== activePlanName && (
                                <span className="text-[9px] text-muted-foreground">(Giá theo: {matchedPricing.name})</span>
                            )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-muted-foreground font-medium flex items-center gap-1 mb-1 lowercase text-[10px]">
                            <MapPin className="h-3 w-3" /> tọa độ vật lý
                          </p>
                          <p className="font-bold text-primary">
                            H{detail.row} - C{detail.column || "—"}
                          </p>
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
                          <div className="grid grid-cols-2 gap-3 text-[11px]">
                              <div>
                                <p className="text-muted-foreground font-medium mb-1 uppercase tracking-tight text-[9px]">Người nhận</p>
                                <p className="font-bold flex items-center gap-1 text-blue-700">
                                    <User className="h-3 w-3" /> {detail.receiverName || "—"}
                                </p>
                                {detail.receiverPhone && <p className="text-[10px] mt-0.5 font-medium">{detail.receiverPhone}</p>}
                              </div>
                              <div>
                                <p className="text-muted-foreground font-medium mb-1 uppercase tracking-tight text-[9px]">Email người nhận</p>
                                <p className="truncate font-medium">{detail.receiverEmail || "—"}</p>
                              </div>
                              <div className="col-span-2 mt-1">
                                <p className="text-muted-foreground font-medium mb-1 flex items-center gap-1 uppercase tracking-tight text-[9px]">
                                    <MapPin className="h-2 w-3" /> Địa chỉ nhận hàng
                                </p>
                                <p className="text-[10px] bg-muted/40 p-2 rounded leading-relaxed">{detail.receiverAddress || "—"}</p>
                              </div>
                          </div>

                          <div className="p-2 border-l-2 border-primary/40 bg-primary/5 text-[10px] space-y-1.5 rounded-r">
                            <p className="flex justify-between">
                                <span className="text-muted-foreground">Địa chỉ lấy hàng:</span> 
                                <span className="font-bold text-primary">{detail.pickupAddress || order.pickupAddress || "—"}</span>
                            </p>
                            {cabinetToLocationName[detail.lockerId || order.originCabinetId || order.destinationCabinetId] && (
                                <p className="flex justify-between">
                                    <span className="text-muted-foreground mr-1">Vị trí tủ:</span> 
                                    <span className="font-bold text-blue-900">
                                        {cabinetToLocationName[detail.lockerId] || cabinetToLocationName[order.originCabinetId] || cabinetToLocationName[order.destinationCabinetId]}
                                    </span>
                                </p>
                            )}
                            <p className="flex justify-between">
                                <span className="text-muted-foreground">Thời gian lấy hàng:</span> 
                                <span className="font-bold">{detail.pickedUpAt ? format(new Date(detail.pickedUpAt), "HH:mm dd/MM/yyyy") : "Chưa lấy hàng"}</span>
                            </p>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Loại mặt hàng:</span> 
                                <Badge variant="secondary" className="text-[9px] h-4 py-0 leading-none">
                                    {EnumTranslator.translateItemType(detail.itemType || "")}
                                </Badge>
                            </div>
                          </div>

                          {detail.note && (
                            <div>
                                <p className="text-muted-foreground font-medium text-[10px] mb-1">Ghi chú vận chuyển</p>
                                <p className="text-[10px] bg-muted/50 p-2 rounded border-l-4 border-primary/20 italic">
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
                        <div className="mt-3 pt-3 border-t space-y-3">
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <p className="text-muted-foreground font-medium mb-1">Thời gian thuê</p>
                                    <p className="font-bold">{detail.rentMonths} tháng</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground font-medium mb-1">Cố định</p>
                                    <p className="font-bold">{detail.isFixed ? "Có" : "Không"}</p>
                                </div>
                            </div>
                             <div className="bg-orange-50/30 p-2 rounded border border-orange-100 text-[10px] space-y-1">
                                <p className="text-muted-foreground font-medium mb-1">Thời hạn thuê</p>
                                <p className="flex items-center gap-2 font-bold text-orange-800">
                                    {detail.rentStartDate ? format(new Date(detail.rentStartDate), "dd/MM/yyyy") : "—"}
                                    <ArrowRight className="h-3 w-3" />
                                    {detail.rentEndDate ? format(new Date(detail.rentEndDate), "dd/MM/yyyy") : "—"}
                                </p>
                                {cabinetToLocationName[detail.cabinetId] && (
                                    <p className="pt-1 mt-1 border-t border-orange-100/50">
                                        <span className="text-muted-foreground mr-1">Vị trí:</span> 
                                        <span className="font-bold text-orange-900">{cabinetToLocationName[detail.cabinetId]}</span>
                                    </p>
                                )}
                                {order.plannedEndTime && (
                                    <p className="pt-1 mt-1 border-t border-orange-100/50 italic">
                                        Hết hạn hệ thống: {format(new Date(order.plannedEndTime), "HH:mm dd/MM/yyyy")}
                                    </p>
                                )}
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
