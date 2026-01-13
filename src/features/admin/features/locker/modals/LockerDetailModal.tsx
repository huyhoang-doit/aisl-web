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
import { Pencil, Trash2 } from "lucide-react";
import type { Locker } from "../types/locker.types.ts";

interface LockerDetailModalProps {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (open: boolean) => void;
  locker: Locker;
  // eslint-disable-next-line no-unused-vars
  onEdit?: (locker: Locker) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete?: (locker: Locker) => void;
}

const LockerDetailModal: React.FC<LockerDetailModalProps> = ({
  open,
  onOpenChange,
  locker,
  onEdit,
  onDelete,
}) => {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">{locker.code}</DialogTitle>
              <DialogDescription>
                Chi tiết thông tin locker
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2 mr-5">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (onEdit) {
                      onEdit(locker);
                    }
                  }}
                  className="gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Sửa locker
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (onDelete) {
                      onDelete(locker);
                    }
                  }}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa locker
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badges */}
          <div className="flex items-center gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Kích thước:</span>
              <Badge variant={sizeInfo.variant} className="ml-2">
                {sizeInfo.label}
              </Badge>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Trạng thái:</span>
              <Badge variant={statusInfo.variant} className="ml-2">
                {statusInfo.label}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Thông tin cơ bản
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <span className="text-sm text-muted-foreground">Mã locker:</span>
                <p className="font-medium">{locker.code}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Giá thuê:</span>
                <p className="font-medium">
                  {locker.price
                    ? `${locker.price.toLocaleString("vi-VN")} đ/tháng`
                    : "Chưa có"}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {locker.description && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Mô tả
                </h3>
                <p className="text-sm">{locker.description}</p>
              </div>
            </>
          )}

          {/* Timestamps */}
          {(locker.createdAt || locker.updatedAt) && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Thông tin hệ thống
                </h3>
                <div className="grid gap-2 text-sm">
                  {locker.createdAt && (
                    <div>
                      <span className="text-muted-foreground">Ngày tạo:</span>{" "}
                      <span className="font-medium">
                        {new Date(locker.createdAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  )}
                  {locker.updatedAt && (
                    <div>
                      <span className="text-muted-foreground">Cập nhật lần cuối:</span>{" "}
                      <span className="font-medium">
                        {new Date(locker.updatedAt).toLocaleString("vi-VN")}
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

export default LockerDetailModal;