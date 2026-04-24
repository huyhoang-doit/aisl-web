import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Calendar } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { Plan } from "../types/plan.types";

interface PlanCardItemProps {
  plan: Plan;
  onClick?: () => void;
}

const PlanCardItem: React.FC<PlanCardItemProps> = ({ plan, onClick }) => {
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
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 h-full flex flex-col",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-base font-bold truncate">{plan.name}</CardTitle>
              {plan.isFreeDefault && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px] px-1.5 h-5">
                  Free
                </Badge>
              )}
            </div>
            {plan.description && (
              <CardDescription className="text-xs line-clamp-1">
                {plan.description}
              </CardDescription>
            )}
          </div>
          <Badge variant={statusInfo.variant} className="text-[10px] ml-2 shrink-0">
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pt-0 pb-4">
        <div className="space-y-3 flex-1 flex flex-col justify-between">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-2">
            <div className="space-y-0.5">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-tight">Giá gói</span>
              <p className="text-sm font-bold text-primary">{formatPrice(plan.price)}</p>
            </div>
            <div className="space-y-0.5 text-right">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-tight">Locker tối đa</span>
              <p className="text-sm font-bold">{plan.maxLockers}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-tight">Cố định</span>
              <p className="text-sm font-semibold">{plan.fixedLocker || 0}</p>
            </div>
            <div className="space-y-0.5 text-right">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-tight">Giảm giá</span>
              <div className="flex flex-col items-end">
                <span className="text-[11px] font-semibold text-green-600">Thuê: {plan.discountLockerRental || 0}%</span>
                <span className="text-[10px] text-green-600/80">Cố định: {plan.discountFixedLockerRental || 0}%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 mt-auto border-t border-border/50">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Tạo: {new Date(plan.createdAt || "").toLocaleDateString("vi-VN")}</span>
            </div>
            <div className="text-[10px] font-medium text-muted-foreground">
              {plan.pricings?.length || 0} bảng giá
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanCardItem;
