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
import { Calendar, Mail, Phone, MapPin, FileText, CheckCircle2, XCircle } from "lucide-react"
import type { CourierRequest } from "../types/courierRequest.types"

interface CourierRequestDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: CourierRequest | null
  onApprove?: (request: CourierRequest) => void
  onReject?: (request: CourierRequest) => void
}

export function CourierRequestDetailModal({
  open,
  onOpenChange,
  request,
  onApprove,
  onReject,
}: CourierRequestDetailModalProps) {
  if (!request) return null

  const statusConfig = {
    pending: { label: "Chờ duyệt", variant: "secondary" as const },
    approved: { label: "Đã duyệt", variant: "default" as const },
    rejected: { label: "Đã từ chối", variant: "destructive" as const },
  }
  const statusInfo = statusConfig[request.status]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết yêu cầu đăng ký người chuyển phát</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về yêu cầu đăng ký làm người chuyển phát
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
            {request.requestDate && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Ngày yêu cầu: {new Date(request.requestDate).toLocaleDateString("vi-VN")}
                </span>
              </div>
            )}
          </div>

          <Separator />

          {/* Thông tin cơ bản */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Thông tin cá nhân
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <div className="text-sm font-medium">Họ và tên</div>
                <div className="text-sm text-muted-foreground">{request.name}</div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
                <div className="text-sm text-muted-foreground">{request.email}</div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Số điện thoại
                </div>
                <div className="text-sm text-muted-foreground">{request.phone}</div>
              </div>

              {request.address && (
                <div className="space-y-1">
                  <div className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Địa chỉ
                  </div>
                  <div className="text-sm text-muted-foreground">{request.address}</div>
                </div>
              )}
            </div>
          </div>

          {/* Documents */}
          {request.documents && request.documents.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Tài liệu đính kèm
                </h3>
                <div className="space-y-2">
                  {request.documents.map((doc, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Review Information */}
          {request.status !== "pending" && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Thông tin duyệt
                </h3>
                <div className="space-y-2">
                  {request.reviewedDate && (
                    <div className="text-sm">
                      <span className="font-medium">Ngày duyệt: </span>
                      <span className="text-muted-foreground">
                        {new Date(request.reviewedDate).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  )}
                  {request.reviewedBy && (
                    <div className="text-sm">
                      <span className="font-medium">Người duyệt: </span>
                      <span className="text-muted-foreground">{request.reviewedBy}</span>
                    </div>
                  )}
                  {request.rejectionReason && (
                    <div className="text-sm">
                      <span className="font-medium">Lý do từ chối: </span>
                      <span className="text-muted-foreground">{request.rejectionReason}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          {request.status === "pending" && (
            <>
              <Button
                type="button"
                variant="destructive"
                onClick={() => onReject && onReject(request)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Từ chối
              </Button>
              <Button
                type="button"
                onClick={() => onApprove && onApprove(request)}
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
