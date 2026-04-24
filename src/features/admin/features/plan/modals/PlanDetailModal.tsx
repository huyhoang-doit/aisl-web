import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Pencil, Trash2, DollarSign, Package, Calendar } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import type { Plan } from "../types/plan.types";

/* eslint-disable no-unused-vars -- callback param names in types are for signature only */
interface PlanDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: Plan;
  onEdit?: (plan: Plan) => void;
  onDelete?: (plan: Plan) => void;
}
/* eslint-enable no-unused-vars */

const PlanDetailModal: React.FC<PlanDetailModalProps> = ({
  open,
  onOpenChange,
  plan,
  onEdit,
  onDelete,
}) => {
  const statusConfig = {
    ACTIVE: { label: "Hoạt động", variant: "default" as const },
    INACTIVE: { label: "Không hoạt động", variant: "secondary" as const },
  };
  const statusInfo = statusConfig[plan.status || "ACTIVE"];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">{plan.name}</DialogTitle>
              <DialogDescription asChild className="mt-1">
                <div>
                  <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                </div>
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2 mr-5">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(plan)}
                  className="gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Sửa gói
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(plan)}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa gói
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {(plan.description || plan.isFreeDefault) && (
            <div className="rounded-md border border-border bg-muted/50 p-4 space-y-2">
              {plan.isFreeDefault && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Mặc định miễn phí
                  </Badge>
                </div>
              )}
              {plan.description && (
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Giá gói</span>
              </div>
              <p className="text-2xl font-bold text-primary">{formatPrice(plan.price)}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>Locker tối đa</span>
              </div>
              <p className="text-2xl font-bold">{plan.maxLockers}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>Fixed Locker (Tủ cố định)</span>
              </div>
              <p className="text-xl font-bold">{plan.fixedLocker || 0}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Giảm giá thuê (%)</span>
              </div>
              <p className="text-xl font-bold text-green-600">
                {plan.discountLockerRental || 0}%
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Giảm giá thuê tủ cố định (%)</span>
              </div>
              <p className="text-xl font-bold text-green-600">
                {plan.discountFixedLockerRental || 0}%
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Bảng giá áp dụng
            </h3>
            {plan.pricings && plan.pricings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {plan.pricings.map((pricing) => (
                  <div key={pricing.id} className="p-3 rounded-lg border border-border bg-card">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{pricing.name}</span>
                      <Badge variant="outline" className="text-[10px] h-4 px-1">
                        {typeof pricing.orderType === 'string' ? pricing.orderType : (pricing.orderType as any)?.value}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {pricing.feePerBlock.toLocaleString()}đ / {pricing.blockDuration} {pricing.blockUnit || 'phút'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">Chưa liên kết bảng giá nào</p>
            )}
          </div>

          <Separator />
          <div className="grid grid-cols-2 gap-4 text-sm">
            {plan.createdAt && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  <strong>Tạo:</strong> {new Date(plan.createdAt).toLocaleString("vi-VN")}
                </span>
              </div>
            )}
            {plan.updatedAt && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  <strong>Cập nhật:</strong> {new Date(plan.updatedAt).toLocaleString("vi-VN")}
                </span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanDetailModal;
