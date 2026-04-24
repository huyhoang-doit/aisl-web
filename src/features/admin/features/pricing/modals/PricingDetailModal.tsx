import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Pencil, Trash2, DollarSign, Clock, Calendar } from "lucide-react";
import { Separator } from "@/shared/components/ui/separator";
import type { Pricing } from "../types/pricing.types";
import StatusComponent from "@/shared/components/StatusComponent";

/* eslint-disable no-unused-vars -- callback param names in types are for signature only */
interface PricingDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pricing: Pricing;
  onEdit?: (pricing: Pricing) => void;
  onDelete?: (pricing: Pricing) => void;
}
/* eslint-enable no-unused-vars */

const PricingDetailModal: React.FC<PricingDetailModalProps> = ({
  open,
  onOpenChange,
  pricing,
  onEdit,
  onDelete,
}) => {
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
              <DialogTitle className="text-xl font-bold">{pricing.name}</DialogTitle>
              <DialogDescription className="mt-1" asChild>
                <div className="flex items-center gap-2">
                  <StatusComponent status={pricing.orderType} />
                </div>
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2 mr-5">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(pricing)}
                  className="gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Sửa
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(pricing)}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {pricing.description && (
            <div className="rounded-md border border-border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">{pricing.description}</p>
            </div>
          )}

          <Separator />

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Thời gian block</span>
              </div>
              <p className="text-xl font-bold">{pricing.blockDuration} {pricing.blockUnit}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Grace period (phút)</span>
              </div>
              <p className="text-xl font-bold">{pricing.gracePeriod}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Phí mỗi block</span>
              </div>
              <p className="text-xl font-bold text-primary">
                {formatPrice(pricing.feePerBlock)}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Phí hủy đơn (%)</span>
              </div>
              <p className="text-xl font-bold text-orange-600">
                {pricing.cancellationFeeRate ?? 0}%
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Phí trễ mỗi block</span>
              </div>
              <p className="text-xl font-bold text-primary">
                {formatPrice(pricing.lateFeePerBlock)}
              </p>
            </div>
            <div className="col-span-2">
              <div className="text-sm font-semibold text-muted-foreground">Loại đơn hàng</div>
              <StatusComponent status={pricing.orderType} />
            </div>
          </div>

          <Separator />
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            {pricing.createdAt && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  <strong>Tạo:</strong>{" "}
                  {new Date(pricing.createdAt).toLocaleString("vi-VN")}
                </span>
              </div>
            )}
            {pricing.updatedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  <strong>Cập nhật:</strong>{" "}
                  {new Date(pricing.updatedAt).toLocaleString("vi-VN")}
                </span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PricingDetailModal;
