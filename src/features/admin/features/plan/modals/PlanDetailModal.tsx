import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Pencil, Trash2, DollarSign, Clock, CheckCircle2, Calendar } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import type { Plan } from "../types/plan.types";

interface PlanDetailModalProps {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (open: boolean) => void;
  plan: Plan;
  // eslint-disable-next-line no-unused-vars
  onEdit?: (plan: Plan) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete?: (plan: Plan) => void;
}

const PlanDetailModal: React.FC<PlanDetailModalProps> = ({
  open,
  onOpenChange,
  plan,
  onEdit,
  onDelete,
}) => {
  const statusConfig = {
    active: { label: "Hoạt động", variant: "default" as const },
    inactive: { label: "Không hoạt động", variant: "secondary" as const },
  };
  const statusInfo = statusConfig[plan.status || "active"];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDuration = (duration: number, unit: Plan["durationUnit"]) => {
    const unitMap = {
      day: "ngày",
      month: "tháng",
      year: "năm",
    };
    return `${duration} ${unitMap[unit]}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">{plan.name}</DialogTitle>
              <DialogDescription className="mt-1">
                Mã: {plan.code} | <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (onEdit) {
                      onEdit(plan);
                    }
                  }}
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
                  onClick={() => {
                    if (onDelete) {
                      onDelete(plan);
                    }
                  }}
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
          {/* Description */}
          {plan.description && (
            <div className="rounded-md border border-border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </div>
          )}

          <Separator />

          {/* Price and Duration */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Giá</span>
              </div>
              <p className="text-2xl font-bold text-primary">{formatPrice(plan.price)}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Thời hạn</span>
              </div>
              <p className="text-2xl font-bold">{formatDuration(plan.duration, plan.durationUnit)}</p>
            </div>
          </div>

          <Separator />

          {/* Features */}
          {plan.features && plan.features.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Tính năng ({plan.features.length})</h3>
              <div className="grid gap-2">
                {plan.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-md border bg-card"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
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
