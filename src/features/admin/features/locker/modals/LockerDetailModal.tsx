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
import type { Locker, LockerStatus } from "../types/locker.types";

const STATUS_CONFIG: Record<LockerStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  AVAILABLE: { label: "Trống", variant: "default" },
  OCCUPIED: { label: "Đã thuê", variant: "secondary" },
  MAINTENANCE: { label: "Bảo trì", variant: "destructive" },
  RESERVED: { label: "Đã đặt", variant: "outline" },
};

interface LockerDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locker: Locker;
  onEdit?: (locker: Locker) => void;
  onDelete?: (locker: Locker) => void;
}

const LockerDetailModal: React.FC<LockerDetailModalProps> = ({
  open,
  onOpenChange,
  locker,
  onEdit,
  onDelete,
}) => {
  const displayTitle = locker.lockerLabel ?? `${locker.row}-${locker.column}`;
  const sizeName = locker.sizeType?.name ?? "—";
  const statusInfo = STATUS_CONFIG[locker.status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">{displayTitle}</DialogTitle>
              <DialogDescription>
                Chi tiết thông tin locker
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2 mr-5">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(locker)}
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
                  onClick={() => onDelete(locker)}
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
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Kích thước:</span>
              <Badge variant="outline" className="ml-2">
                {sizeName}
              </Badge>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Trạng thái:</span>
              <Badge variant={statusInfo.variant} className="ml-2">
                {statusInfo.label}
              </Badge>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Cửa (HW):</span>
              <Badge variant="outline" className="ml-2">
                {locker.hwState ?? "—"}
              </Badge>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Hoạt động:</span>
              <Badge variant={locker.isActive ? "default" : "secondary"} className="ml-2">
                {locker.isActive ? "Có" : "Không"}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Thông tin cơ bản
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <span className="text-sm text-muted-foreground">Nhãn locker:</span>
                <p className="font-medium font-mono">{displayTitle}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Vị trí:</span>
                <p className="font-medium">
                  Hàng {locker.row}, Cột {locker.column}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Cabinet ID:</span>
                <p className="font-medium font-mono text-sm">{locker.cabinetId}</p>
              </div>
              {locker.sizeType && (locker.sizeType.width != null || locker.sizeType.height != null || locker.sizeType.depth != null) && (
                <div>
                  <span className="text-sm text-muted-foreground">Kích thước (cm):</span>
                  <p className="font-medium">
                    {[locker.sizeType.width, locker.sizeType.height, locker.sizeType.depth]
                      .filter((n) => n != null)
                      .join(" × ")}{" "}
                    cm
                  </p>
                </div>
              )}
              {locker.totalUsageTime != null && (
                <div>
                  <span className="text-sm text-muted-foreground">Tổng thời gian sử dụng:</span>
                  <p className="font-medium">{locker.totalUsageTime}</p>
                </div>
              )}
            </div>
          </div>

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
