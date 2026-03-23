import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Calendar, DollarSign, Clock } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { Pricing } from "../types/pricing.types";
import StatusComponent from "@/shared/components/StatusComponent";

interface PricingCardItemProps {
  pricing: Pricing;
  onClick?: () => void;
}

const PricingCardItem: React.FC<PricingCardItemProps> = ({ pricing, onClick }) => {
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
            <CardTitle className="text-lg font-semibold">{pricing.name}</CardTitle>
            {/* {pricing.description && (
              <CardDescription className="mt-1 line-clamp-2">
                {pricing.description}
              </CardDescription>
            )} */}
          </div>
          <StatusComponent status={pricing.orderType} />
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1 flex flex-col">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Phí</span>
              </div>
              <p className="text-xl font-bold text-primary">
                {formatPrice(pricing.feePerBlock)}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Phí trễ</span>
              </div>
              <p className="text-xl font-bold text-primary">
                {formatPrice(pricing.lateFeePerBlock)}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Block (phút)</span>
              </div>
              <p className="text-lg font-semibold">{pricing.blockDuration}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Grace (phút)</span>
              </div>
              <p className="text-lg font-semibold">{pricing.gracePeriod}</p>
            </div>
          </div>

          {pricing.createdAt && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto">
              <Calendar className="h-3 w-3" />
              <span>Tạo: {new Date(pricing.createdAt).toLocaleDateString("vi-VN")}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingCardItem;
