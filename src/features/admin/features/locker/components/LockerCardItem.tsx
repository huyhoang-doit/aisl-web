import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Calendar, Package, DollarSign } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { Locker } from "../types/locker.types";

interface LockerCardItemProps {
  locker: Locker;
  onClick?: () => void;
}

const LockerCardItem: React.FC<LockerCardItemProps> = ({ locker, onClick }) => {
  const sizeConfig = {
    small: { label: "Nhỏ", variant: "secondary" as const },
    medium: { label: "Vừa", variant: "default" as const },
    large: { label: "Lớn", variant: "default" as const },
  };

  const statusConfig = {
    available: { label: "Trống", variant: "default" as const },
    occupied: { label: "Đã thuê", variant: "secondary" as const },
    maintenance: { label: "Bảo trì", variant: "destructive" as const },
    reserved: { label: "Đã đặt", variant: "outline" as const },
  };

  const sizeInfo = sizeConfig[locker.size || "medium"];
  const statusInfo = statusConfig[locker.status || "available"];

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-lg hover:border-primary/50",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold font-mono">
              {locker.code}
            </CardTitle>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge variant={statusInfo.variant}>
              {statusInfo.label}
            </Badge>
            <Badge variant={sizeInfo.variant} className="text-xs">
              {sizeInfo.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Price */}
          {locker.price !== undefined && locker.price > 0 && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Giá thuê:</span>
              <span className="text-sm font-bold text-primary">
                {locker.price.toLocaleString("vi-VN")} đ/tháng
              </span>
            </div>
          )}

          {/* Size & Status Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>Kích thước</span>
              </div>
              <p className="font-medium">{sizeInfo.label}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Trạng thái</span>
              </div>
              <Badge variant={statusInfo.variant} className="w-fit">
                {statusInfo.label}
              </Badge>
            </div>
          </div>

          {locker.createdAt && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Tạo: {new Date(locker.createdAt).toLocaleDateString("vi-VN")}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LockerCardItem;
