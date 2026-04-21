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
import { Pencil, Trash2, DoorOpen, Loader2 } from "lucide-react";
import type { Locker, LockerStatus } from "../types/locker.types";
import { useState } from "react";
import { toast } from "sonner";
import { lockerService } from "../services/locker.service";

const STATUS_CONFIG: Record<LockerStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  AVAILABLE: { label: "Trống", variant: "default" },
  OCCUPIED: { label: "Đã thuê", variant: "secondary" },
  MAINTENANCE: { label: "Bảo trì", variant: "destructive" },
  RESERVED: { label: "Đã đặt", variant: "outline" },
  LOCKED_BY_BALANCE: { label: "Đã khóa bởi ví", variant: "outline" },
  INITIALIZING: { label: "Đang khởi tạo", variant: "outline" },
};

const HW_STATE_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "warning" }> = {
  OPENING: { label: "Đang mở", variant: "default" },
  CLOSING: { label: "Đang đóng", variant: "outline" },
  JAMMED: { label: "Bị kẹt", variant: "destructive" },
  OFFLINE: { label: "Ngoại tuyến", variant: "secondary" },
  ERROR: { label: "Lỗi", variant: "destructive" },
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
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenLocker = async () => {
    try {
      setIsOpening(true);
      await lockerService.open(locker.id);
      toast.success(`Đã gửi lệnh mở tủ ${locker.lockerLabel || locker.id} thành công`);
    } catch (error: any) {
      console.error("Failed to open locker:", error);
      toast.error(error?.response?.data?.message || "Không thể gửi lệnh mở tủ");
    } finally {
      setIsOpening(false);
    }
  };

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
              <Button
                variant="default"
                size="sm"
                onClick={handleOpenLocker}
                disabled={isOpening}
                className="gap-2 bg-green-600 hover:bg-green-700 text-white"
              >
                {isOpening ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <DoorOpen className="h-4 w-4" />
                )}
                Mở tủ
              </Button>
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
              {locker.hwState ? (
                <Badge 
                  variant={HW_STATE_CONFIG[locker.hwState]?.variant as any || "outline"} 
                  className="ml-2"
                >
                  {HW_STATE_CONFIG[locker.hwState]?.label || locker.hwState}
                </Badge>
              ) : (
                <span className="ml-2">—</span>
              )}
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
                <span className="text-sm text-muted-foreground">Mã tủ:</span>
                <p className="font-medium font-mono">{displayTitle}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Vị trí:</span>
                <p className="font-medium">
                  Hàng {locker.row}, Cột {locker.column}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">ID của Cụm tủ:</span>
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
