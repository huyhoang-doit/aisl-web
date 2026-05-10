import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { MapPin, Package, Server } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { Locker, LockerStatus } from "../types/locker.types";

interface LockerCardItemProps {
  locker: Locker;
  onClick?: () => void;
}

const STATUS_CONFIG: Record<LockerStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  AVAILABLE: { label: "Trống", variant: "default" },
  OCCUPIED: { label: "Đã thuê", variant: "secondary" },
  MAINTENANCE: { label: "Bảo trì", variant: "destructive" },
  RESERVED: { label: "Đã đặt", variant: "outline" },
  LOCKED_BY_BALANCE: { label: "Khóa do số dư", variant: "destructive" },
  FAULT: { label: "Lỗi", variant: "destructive" },
  INITIALIZING: { label: "Đang khởi tạo", variant: "outline" },
};

const LockerCardItem: React.FC<LockerCardItemProps> = ({ locker, onClick }) => {
  const displayTitle = locker.lockerLabel ?? `${locker.row}-${locker.column}`;
  const sizeName = locker.sizeType?.name ?? "—";
  const statusInfo = STATUS_CONFIG[locker.status] ?? { label: locker.status, variant: "outline" };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 h-[200px] flex flex-col",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2 shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold font-mono truncate">
              {displayTitle}
            </CardTitle>
            <div className="flex flex-col gap-1 mt-1">
              {locker.cabinetName && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Server className="h-3 w-3 shrink-0" />
                  <span className="truncate max-w-[150px]">{locker.cabinetName}</span>
                </div>
              )}
              {locker.locationName && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate max-w-[150px]">{locker.locationName}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between pt-0">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4 shrink-0" />
              <span>Kích thước</span>
            </div>
            <p className="font-medium truncate">{sizeName}</p>
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

        <div className="text-xs text-muted-foreground mt-auto pt-2 border-t">
          Vị trí: Hàng {locker.row}, Cột {locker.column}
          {locker.isActive !== undefined && (
            <span className="ml-2">
              • {locker.isActive ? "Hoạt động" : "Không hoạt động"}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LockerCardItem;
