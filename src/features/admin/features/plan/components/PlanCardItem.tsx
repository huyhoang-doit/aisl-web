import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Calendar, DollarSign, Package } from "lucide-react";
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
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">{plan.name}</CardTitle>
            {plan.description && (
              <CardDescription className="mt-1 line-clamp-2">
                {plan.description}
              </CardDescription>
            )}
          </div>
          <Badge variant={statusInfo.variant}>
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1 flex flex-col">
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
                <Package className="h-4 w-4" />
                <span>Locker tối đa</span>
              </div>
              <p className="text-xl font-bold">{plan.maxLockers}</p>
            </div>
          </div>

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
