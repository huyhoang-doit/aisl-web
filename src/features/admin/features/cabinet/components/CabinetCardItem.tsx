import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Calendar, Cpu, Network } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { Cabinet } from "../types/cabinet.types";

interface CabinetCardItemProps {
  cabinet: Cabinet;
  onClick?: () => void;
}

const CabinetCardItem: React.FC<CabinetCardItemProps> = ({ cabinet, onClick }) => {
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
              {cabinet.macAddress}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Network className="h-4 w-4" />
                <span>IP</span>
              </div>
              <p className="text-sm font-mono truncate">{cabinet.ipAddress}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Cpu className="h-4 w-4" />
                <span>Firmware</span>
              </div>
              <p className="text-sm truncate">{cabinet.firmwareVersion || "—"}</p>
            </div>
          </div>

          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>Hàng: <strong className="text-foreground">{cabinet.totalRows}</strong></span>
            <span>Cột: <strong className="text-foreground">{cabinet.totalColumns}</strong></span>
          </div>

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
