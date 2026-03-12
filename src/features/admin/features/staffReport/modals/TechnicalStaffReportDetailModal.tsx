import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import {
  Calendar,
  User,
  Mail,
  Phone,
  Package,
  FileText,
  UserCheck,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import type { TechnicalStaffReport } from "../../customerReport/types/customerReport.types";
import AssignTechnicalStaffModal from "../../customerReport/modals/AssignTechnicalStaffModal";
import type { CreateTaskPayload } from "../../task/services/task.service";

interface TechnicalStaffReportDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: TechnicalStaffReport | null;
  onAssign?: (payload: CreateTaskPayload) => void | Promise<void>;
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
  pending_review: { label: "Chờ duyệt", variant: "secondary" as const },
  approved: { label: "Đã duyệt", variant: "default" as const },
  rejected: { label: "Từ chối", variant: "destructive" as const },
  in_progress: { label: "Đang xử lý", variant: "default" as const },
  completed: { label: "Hoàn thành", variant: "default" as const },
};

export function TechnicalStaffReportDetailModal({
  open,
  onOpenChange,
  report,
  onAssign,
}: TechnicalStaffReportDetailModalProps) {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  if (!report) return null;

  const statusInfo = statusConfig[report.status];
  const customerReport = report.customerReport;
  const issueInfo = issueTypeConfig[customerReport.issueType];
  const priorityInfo = priorityConfig[customerReport.priority];

  const handleAssign = () => {
    setIsAssignModalOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto flex flex-col justify-start">
          <DialogHeader className="border-b border-primary/20 pb-4">
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-xl font-bold">
                  {report.reportCode}
                </DialogTitle>
                <DialogDescription>
                  Chi tiết báo cáo từ nhân viên kỹ thuật
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2 mr-5">
                <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                <Badge variant={priorityInfo.variant}>{priorityInfo.label}</Badge>
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="customer-issue" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="customer-issue" className="active-tab">
                Thông tin lỗi từ khách hàng
              </TabsTrigger>
              <TabsTrigger value="maintenance-report" className="active-tab">
                Báo cáo sửa chữa
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Thông tin lỗi từ khách hàng */}
            <TabsContent value="customer-issue" className="space-y-6 mt-4">
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
                      {new Date(customerReport.reportedAt).toLocaleString("vi-VN")}
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
                      {customerReport.lockerCode}
                    </div>
                  </div>

                  {customerReport.cabinetCode && (
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Mã cabinet</div>
                      <div className="text-sm text-muted-foreground">
                        {customerReport.cabinetCode}
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
                      {customerReport.customerName}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {customerReport.customerEmail}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Số điện thoại
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {customerReport.customerPhone}
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
                    {customerReport.issueDescription}
                  </div>
                </div>
              </div>

              {/* Hình ảnh đính kèm từ khách hàng */}
              {customerReport.images && customerReport.images.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Hình ảnh từ khách hàng
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {customerReport.images.map((image, index) => (
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
              <Separator />
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Thông tin phân công
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <div className="text-sm font-medium flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      Nhân viên kỹ thuật
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {report.technicalStaffName}
                    </div>
                  </div>

                  {report.createdAt && (
                    <div className="space-y-1">
                      <div className="text-sm font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Ngày phân công
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(report.createdAt).toLocaleString("vi-VN")}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Tab 2: Báo cáo sửa chữa */}
            <TabsContent value="maintenance-report" className="space-y-6 mt-4">
              {report.status === "in_progress" ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Chưa có báo cáo sửa chữa</p>
                  <p className="text-sm mt-2">
                    Nhân viên kỹ thuật chưa hoàn thành bảo trì
                  </p>
                </div>
              ) : (
                <>
                  {/* Thông tin nhân viên kỹ thuật */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Thông tin nhân viên kỹ thuật
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1">
                        <div className="text-sm font-medium flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Tên nhân viên
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {report.technicalStaffName}
                        </div>
                      </div>

                      {report.submittedAt && (
                        <div className="space-y-1">
                          <div className="text-sm font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Ngày gửi báo cáo
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(report.submittedAt).toLocaleString("vi-VN")}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Mô tả bảo trì */}
                  {report.maintenanceDescription && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Mô tả công việc đã thực hiện
                      </h3>
                      <div className="space-y-1">
                        <div className="text-sm font-medium flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Chi tiết
                        </div>
                        <div className="text-sm text-muted-foreground p-3 rounded-md bg-muted/50">
                          {report.maintenanceDescription}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Hình ảnh bảo trì */}
                  {report.maintenanceImages && report.maintenanceImages.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                          Hình ảnh bảo trì
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {report.maintenanceImages.map((image, index) => (
                            <div
                              key={index}
                              className="relative aspect-square rounded-md overflow-hidden border border-border bg-muted"
                            >
                              <img
                                src={image}
                                alt={`Hình ảnh bảo trì ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Thông tin duyệt (nếu đã được duyệt/từ chối) */}
                  {(report.status === "approved" || report.status === "rejected") && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                          Thông tin duyệt
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          {report.reviewedAt && (
                            <div className="space-y-1">
                              <div className="text-sm font-medium flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Ngày duyệt
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(report.reviewedAt).toLocaleString("vi-VN")}
                              </div>
                            </div>
                          )}

                          {report.reviewedByName && (
                            <div className="space-y-1">
                              <div className="text-sm font-medium flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Người duyệt
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {report.reviewedByName}
                              </div>
                            </div>
                          )}

                          {report.reviewNote && (
                            <div className="space-y-1 md:col-span-2">
                              <div className="text-sm font-medium flex items-center gap-2">
                                {report.status === "approved" ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-600" />
                                )}
                                Ghi chú
                              </div>
                              <div className="text-sm text-muted-foreground p-3 rounded-md bg-muted/50">
                                {report.reviewNote}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Nếu chưa có báo cáo */}
                  {!report.maintenanceDescription && !report.maintenanceImages?.length && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">Chưa có thông tin báo cáo sửa chữa</p>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            {onAssign && (
              <Button onClick={handleAssign} variant="outline">
                <UserCheck className="h-4 w-4 mr-2" />
                Phân công lại
              </Button>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal phân công lại nhân viên kỹ thuật */}
      {report && (
        <AssignTechnicalStaffModal
          open={isAssignModalOpen}
          onOpenChange={setIsAssignModalOpen}
          report={{
            ...customerReport,
            assignedTo: report.technicalStaffId,
            assignedToName: report.technicalStaffName,
          }}
          onSubmit={async (payload) => {
            if (onAssign) {
              await onAssign(payload);
            }
            setIsAssignModalOpen(false);
          }}
        />
      )}
    </>
  );
}

export default TechnicalStaffReportDetailModal;
