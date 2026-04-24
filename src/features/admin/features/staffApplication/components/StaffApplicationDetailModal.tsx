import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { Calendar, Car, CheckCircle2, Eye, XCircle } from "lucide-react";
import type { StaffApplication } from "../types/staffApplication.types";
import {
  getStaffApplicationStatus,
  StaffApplicationStatus,
} from "../types/staffApplication.types";

interface StaffApplicationDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: StaffApplication | null;
  onApprove?: (application: StaffApplication) => void;
  onReject?: (application: StaffApplication) => void;
}

const getStatusBadge = (status: StaffApplication["status"]) => {
  const value = getStaffApplicationStatus(status);
  if (value === StaffApplicationStatus.APPROVED) {
    return { label: "Đã duyệt", variant: "default" as const };
  }
  if (value === StaffApplicationStatus.REJECTED) {
    return { label: "Đã từ chối", variant: "destructive" as const };
  }
  return { label: "Chờ duyệt", variant: "secondary" as const };
};

const getImageUrls = (application: StaffApplication): string[] => {
  const urls = [
    application.frontVehicleImageUrl,
    application.backVehicleImageUrl,
    application.portraitUrl,
  ].filter(Boolean) as string[];

  if (urls.length > 0) return urls;

  if (!application.files?.length) return [];

  return application.files
    .map((item) => (typeof item === "string" ? item : item.url ?? item.path ?? ""))
    .filter(Boolean);
};

export default function StaffApplicationDetailModal({
  open,
  onOpenChange,
  application,
  onApprove,
  onReject,
}: StaffApplicationDetailModalProps) {
  if (!application) return null;

  const statusValue = getStaffApplicationStatus(application.status);
  const statusBadge = getStatusBadge(application.status);
  const imageUrls = getImageUrls(application);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết đơn đăng ký nhân viên</DialogTitle>
          <DialogDescription>
            Xem thông tin hồ sơ và ảnh đính kèm của đơn đăng ký nhân viên.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
            {application.createdAt && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Ngày tạo: {new Date(application.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
            )}
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Họ tên pháp lý</div>
              <div className="font-medium">{application.legalName || "—"}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Role đăng ký</div>
              <div className="font-medium">{application.role || "—"}</div>
            </div>
            <div>
              <div className="text-muted-foreground flex items-center gap-2">
                <Car className="h-4 w-4" />
                Biển số xe
              </div>
              <div className="font-medium">{application.licensePlate || "—"}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Vehicle type id</div>
              <div className="font-medium">{application.vehicleTypeId || "—"}</div>
            </div>
          </div>

          {imageUrls.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Ảnh đính kèm
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {imageUrls.map((url) => (
                    <a key={url} href={url} target="_blank" rel="noreferrer">
                      <img
                        src={url}
                        alt="staff-application"
                        className="h-28 w-full rounded border object-cover"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}

          {(application.reviewNote || application.reviewedAt) && (
            <>
              <Separator />
              <div className="space-y-1 text-sm">
                <div className="font-semibold">Thông tin duyệt</div>
                {application.reviewedAt && (
                  <div>
                    <span className="text-muted-foreground">Thời gian duyệt: </span>
                    <span>{new Date(application.reviewedAt).toLocaleString("vi-VN")}</span>
                  </div>
                )}
                {application.reviewNote && (
                  <div>
                    <span className="text-muted-foreground">Ghi chú: </span>
                    <span>{application.reviewNote}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          {statusValue === StaffApplicationStatus.PENDING && (
            <>
              <Button variant="destructive" onClick={() => onReject?.(application)}>
                <XCircle className="h-4 w-4 mr-2" />
                Từ chối
              </Button>
              <Button onClick={() => onApprove?.(application)}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Duyệt
              </Button>
            </>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
