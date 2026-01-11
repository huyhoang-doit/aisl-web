import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Calendar, Package } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { Cabinet } from "../types/cabinet.types";

interface CabinetCardItemProps {
  cabinet: Cabinet;
  onClick?: () => void;
}

const CabinetCardItem: React.FC<CabinetCardItemProps> = ({ cabinet, onClick }) => {
  const statusConfig = {
    active: { label: "Hoạt động", variant: "default" as const },
    inactive: { label: "Không hoạt động", variant: "secondary" as const },
    maintenance: { label: "Bảo trì", variant: "destructive" as const },
  };
  const statusInfo = statusConfig[cabinet.status || "active"];

  const occupancyRate = cabinet.totalLockers > 0 
    ? ((cabinet.totalLockers - cabinet.availableLockers) / cabinet.totalLockers) * 100 
    : 0;

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
            <CardTitle className="text-lg font-semibold">{cabinet.name}</CardTitle>
            <CardDescription className="mt-1 font-mono text-xs">
              {cabinet.code}
            </CardDescription>
          </div>
          <Badge variant={statusInfo.variant}>
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Locker Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>Tổng số</span>
              </div>
              <p className="text-xl font-bold">{cabinet.totalLockers}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>Trống</span>
              </div>
              <p className="text-xl font-bold text-green-600">{cabinet.availableLockers}</p>
            </div>
          </div>

          {/* Occupancy Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Mức độ sử dụng</span>
              <span>{occupancyRate.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all",
                  occupancyRate < 50 ? "bg-green-500" :
                  occupancyRate < 80 ? "bg-yellow-500" : "bg-red-500"
                )}
                style={{ width: `${occupancyRate}%` }}
              />
            </div>
          </div>

          {cabinet.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {cabinet.description}
            </p>
          )}

          {cabinet.createdAt && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Tạo: {new Date(cabinet.createdAt).toLocaleDateString("vi-VN")}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CabinetCardItem;

