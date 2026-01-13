import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Calendar, DollarSign, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { Plan } from "../types/plan.types";

interface PlanCardItemProps {
  plan: Plan;
  onClick?: () => void;
}

const PlanCardItem: React.FC<PlanCardItemProps> = ({ plan, onClick }) => {
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
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 h-full flex flex-col",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">{plan.name}</CardTitle>
            <CardDescription className="mt-1 font-mono text-xs">
              {plan.code}
            </CardDescription>
          </div>
          <Badge variant={statusInfo.variant}>
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1 flex flex-col">
          {/* Price and Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Giá</span>
              </div>
              <p className="text-xl font-bold text-primary">{formatPrice(plan.price)}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Thời hạn</span>
              </div>
              <p className="text-xl font-bold">{formatDuration(plan.duration, plan.durationUnit)}</p>
            </div>
          </div>

          {/* Features - Luôn hiển thị với min-height để đồng nhất */}
          <div className="space-y-2 flex-1 min-h-[100px]">
            {plan.features && plan.features.length > 0 ? (
              <>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Tính năng ({plan.features.length})
                </div>
                <div className="space-y-1">
                  {plan.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
                      <span className="line-clamp-1">{feature}</span>
                    </div>
                  ))}
                  {plan.features.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{plan.features.length - 3} tính năng khác
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Tính năng (0)
              </div>
            )}
          </div>

          {/* {plan.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {plan.description}
            </p>
          )} */}

          {plan.createdAt && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto">
              <Calendar className="h-3 w-3" />
              <span>Tạo: {new Date(plan.createdAt).toLocaleDateString("vi-VN")}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanCardItem;
