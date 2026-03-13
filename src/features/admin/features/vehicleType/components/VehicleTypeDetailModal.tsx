import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { Pencil } from "lucide-react";
import type { VehicleType } from "../types/vehicleType.types";

interface VehicleTypeDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleType: VehicleType;
  onEdit?: (vehicleType: VehicleType) => void;
}

const VehicleTypeDetailModal: React.FC<VehicleTypeDetailModalProps> = ({
  open,
  onOpenChange,
  vehicleType,
  onEdit,
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (typeof isOpen === "boolean") onOpenChange(isOpen);
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">{vehicleType.name}</DialogTitle>
              <DialogDescription>
                Chi tiết loại phương tiện
              </DialogDescription>
            </div>
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(vehicleType)}
                className="gap-2"
              >
                <Pencil className="h-4 w-4" />
                Sửa
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Trạng thái:</span>
              <Badge
                variant={vehicleType.isActive ? "default" : "secondary"}
                className="ml-2"
              >
                {vehicleType.isActive ? "Hoạt động" : "Không hoạt động"}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Thông tin
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <span className="text-sm text-muted-foreground">Tên:</span>
                <p className="font-medium">{vehicleType.name}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">ID:</span>
                <p className="font-medium font-mono text-sm">{vehicleType.id}</p>
              </div>
            </div>
          </div>

          {(vehicleType.createdAt || vehicleType.updatedAt) && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Thông tin hệ thống
                </h3>
                <div className="grid gap-2 text-sm">
                  {vehicleType.createdAt && (
                    <div>
                      <span className="text-muted-foreground">Ngày tạo:</span>{" "}
                      <span className="font-medium">
                        {new Date(vehicleType.createdAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  )}
                  {vehicleType.updatedAt && (
                    <div>
                      <span className="text-muted-foreground">Cập nhật lần cuối:</span>{" "}
                      <span className="font-medium">
                        {new Date(vehicleType.updatedAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleTypeDetailModal;
