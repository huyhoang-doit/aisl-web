import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Separator } from "@/shared/components/ui/separator"
import { Calendar, CheckCircle2, XCircle, Car, ImageIcon } from "lucide-react"
import type { CourierApplication, CourierStatusValue, VehicleTypeValue } from "../types/courierRequest.types"
import { CourierStatus, VehicleType } from "../types/courierRequest.types"

const STATUS_LABELS: Record<CourierStatusValue, string> = {
  [CourierStatus.PENDING]: "Chờ duyệt",
  [CourierStatus.APPROVED]: "Đã duyệt",
  [CourierStatus.REJECTED]: "Đã từ chối",
}

const VEHICLE_LABELS: Record<VehicleTypeValue, string> = {
  [VehicleType.BIKE]: "Xe đạp",
  [VehicleType.MOTORBIKE]: "Xe máy",
  [VehicleType.CAR]: "Ô tô",
}

interface CourierRequestDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  application: CourierApplication | null
  onApprove?: (application: CourierApplication) => void
  onReject?: (application: CourierApplication) => void
}

export function CourierRequestDetailModal({
  open,
  onOpenChange,
  application,
  onApprove,
  onReject,
}: CourierRequestDetailModalProps) {
  if (!application) return null

  const statusLabel = STATUS_LABELS[application.status] ?? application.status
  const vehicleLabel = VEHICLE_LABELS[application.vehicleType] ?? application.vehicleType
  const isPending = application.status === CourierStatus.PENDING

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết đơn đăng ký người chuyển phát</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về đơn đăng ký làm người chuyển phát
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Badge variant={isPending ? "secondary" : application.status === CourierStatus.APPROVED ? "default" : "destructive"}>
              {statusLabel}
            </Badge>
            {application.createdAt && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Ngày tạo: {new Date(application.createdAt).toLocaleDateString("vi-VN")}</span>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Thông tin cá nhân & phương tiện
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <div className="text-sm font-medium">Họ và tên</div>
                <div className="text-sm text-muted-foreground">{application.legalName || "—"}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Biển số xe
                </div>
                <div className="text-sm text-muted-foreground">{application.licensePlate || "—"}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Loại xe</div>
                <div className="text-sm text-muted-foreground">{vehicleLabel}</div>
              </div>
            </div>
          </div>

          {(application.frontVehicleImageUrl || application.backVehicleImageUrl || application.portraitUrl) && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Ảnh đính kèm
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {application.frontVehicleImageUrl && (
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Ảnh xe (trước)</div>
                      <img
                        src={application.frontVehicleImageUrl}
                        alt="Xe (trước)"
                        className="rounded border object-cover h-24 w-full"
                      />
                    </div>
                  )}
                  {application.backVehicleImageUrl && (
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Ảnh xe (sau)</div>
                      <img
                        src={application.backVehicleImageUrl}
                        alt="Xe (sau)"
                        className="rounded border object-cover h-24 w-full"
                      />
                    </div>
                  )}
                  {application.portraitUrl && (
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Chân dung</div>
                      <img
                        src={application.portraitUrl}
                        alt="Chân dung"
                        className="rounded border object-cover h-24 w-full"
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {!isPending && (application.reviewNote || application.reviewedAt) && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Thông tin duyệt
                </h3>
                <div className="space-y-2">
                  {application.reviewedAt && (
                    <div className="text-sm">
                      <span className="font-medium">Ngày duyệt: </span>
                      <span className="text-muted-foreground">
                        {new Date(application.reviewedAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  )}
                  {application.reviewNote && (
                    <div className="text-sm">
                      <span className="font-medium">Ghi chú: </span>
                      <span className="text-muted-foreground">{application.reviewNote}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          {isPending && (
            <>
              <Button
                type="button"
                variant="destructive"
                onClick={() => onReject?.(application)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Từ chối
              </Button>
              <Button
                type="button"
                onClick={() => onApprove?.(application)}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Duyệt
              </Button>
            </>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CourierRequestDetailModal
