import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { Button } from "@/shared/components/ui/button";
import {
  Calendar,
  User,
  Mail,
  Phone,
  Package,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import type { CustomerReport } from "../types/customerReport.types";

interface CustomerReportDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: CustomerReport | null;
  onAssign?: (report: CustomerReport) => void;
}

const issueTypeConfig = {
  broken: { label: "Hỏng", variant: "destructive" as const },
  stuck: { label: "Kẹt", variant: "destructive" as const },
  cannot_open: { label: "Không mở được", variant: "destructive" as const },
  other: { label: "Khác", variant: "secondary" as const },
};

const priorityConfig = {
  low: { label: "Thấp", variant: "secondary" as const },
  medium: { label: "Trung bình", variant: "default" as const },
  high: { label: "Cao", variant: "destructive" as const },
  urgent: { label: "Khẩn cấp", variant: "destructive" as const },
};

const statusConfig = {
  pending: { label: "Chờ xử lý", variant: "secondary" as const },
  assigned: { label: "Đã phân công", variant: "default" as const },
  in_progress: { label: "Đang xử lý", variant: "default" as const },
  completed: { label: "Hoàn thành", variant: "default" as const },
  rejected: { label: "Từ chối", variant: "destructive" as const },
};

export function CustomerReportDetailModal({
  open,
  onOpenChange,
  report,
  onAssign,
}: CustomerReportDetailModalProps) {
  if (!report) return null;

  const issueInfo = issueTypeConfig[report.issueType];
  const priorityInfo = priorityConfig[report.priority];
  const statusInfo = statusConfig[report.status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">
                {report.reportCode}
              </DialogTitle>
              <DialogDescription>
                Chi tiết báo cáo từ khách hàng
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2 mr-5">
              <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
              <Badge variant={priorityInfo.variant}>{priorityInfo.label}</Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Thông tin báo cáo */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Thông tin báo cáo
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <div className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Ngày báo cáo
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(report.reportedAt).toLocaleString("vi-VN")}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium">Loại vấn đề</div>
                <Badge variant={issueInfo.variant}>{issueInfo.label}</Badge>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Mã locker
                </div>
                <div className="text-sm text-muted-foreground">
                  {report.lockerCode}
                </div>
              </div>

              {report.cabinetCode && (
                <div className="space-y-1">
                  <div className="text-sm font-medium">Mã cabinet</div>
                  <div className="text-sm text-muted-foreground">
                    {report.cabinetCode}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Thông tin khách hàng */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Thông tin khách hàng
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <div className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Họ và tên
                </div>
                <div className="text-sm text-muted-foreground">
                  {report.customerName}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
                <div className="text-sm text-muted-foreground">
                  {report.customerEmail}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Số điện thoại
                </div>
                <div className="text-sm text-muted-foreground">
                  {report.customerPhone}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Mô tả vấn đề */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Mô tả vấn đề
            </h3>
            <div className="space-y-1">
              <div className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Chi tiết
              </div>
              <div className="text-sm text-muted-foreground p-3 rounded-md bg-muted/50">
                {report.issueDescription}
              </div>
            </div>
          </div>

          {/* Hình ảnh đính kèm */}
          {report.images && report.images.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Hình ảnh đính kèm
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {report.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-md overflow-hidden border border-border bg-muted"
                    >
                      <img
                        src={image}
                        alt={`Hình ảnh ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Thông tin phân công */}
          {report.assignedTo && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Thông tin phân công
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Nhân viên kỹ thuật</div>
                    <div className="text-sm text-muted-foreground">
                      {report.assignedToName || "Chưa cập nhật"}
                    </div>
                  </div>

                  {report.assignedAt && (
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Ngày phân công</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(report.assignedAt).toLocaleString("vi-VN")}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t">
          {!report.assignedTo && onAssign && (
            <Button onClick={() => onAssign(report)}>
              Phân công nhân viên kỹ thuật
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CustomerReportDetailModal;
