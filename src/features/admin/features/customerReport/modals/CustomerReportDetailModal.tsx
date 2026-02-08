import { useEffect, useState } from "react";
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
  Loader2,
  AlertCircle,
  Users,
  ClipboardList,
} from "lucide-react";
import StatusComponent from "@/shared/components/StatusComponent";
import type { CustomerReport, AssignedStaffItem } from "../types/customerReport.types";
import { maintenanceReportService } from "../services/maintenanceReport.service";

interface CustomerReportDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string | null;
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

function extractReportFromResponse(response: unknown): CustomerReport | null {
  const r = response as { data?: CustomerReport | { data?: CustomerReport } };
  if (r?.data && typeof (r.data as CustomerReport).id !== "undefined") return r.data as CustomerReport;
  if (r?.data && typeof (r.data as { data?: CustomerReport }).data !== "undefined") return (r.data as { data: CustomerReport }).data;
  return null;
}

const TASK_TYPE_LABELS: Record<string, string> = {
  REPAIR: "Sửa chữa",
  INSPECTION: "Kiểm tra",
  CLEANING: "Vệ sinh",
};

function ReportInfoContent({
  report,
  hasCustomerInfo,
  hasIssueType,
}: {
  report: CustomerReport;
  hasCustomerInfo: boolean;
  hasIssueType: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Thông tin báo cáo
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {(report.code != null && report.code !== "") && (
            <div className="space-y-1">
              <div className="text-sm font-medium">Mã báo cáo</div>
              <div className="text-sm text-muted-foreground font-mono">{report.code}</div>
            </div>
          )}
          <div className="space-y-1">
            <div className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Ngày báo cáo
            </div>
            <div className="text-sm text-muted-foreground">
              {(report.createdAt ?? report.reportedAt)
                ? new Date(report.createdAt ?? report.reportedAt!).toLocaleString("vi-VN")
                : "-"}
            </div>
          </div>
          {hasIssueType && (
            <div className="space-y-1">
              <div className="text-sm font-medium">Loại vấn đề</div>
              <Badge variant={issueTypeConfig[report.issueType!].variant}>{issueTypeConfig[report.issueType!].label}</Badge>
            </div>
          )}
          <div className="space-y-1">
            <div className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Locker
            </div>
            <div className="text-sm text-muted-foreground font-mono">
              {report.lockerLabel ?? report.lockerCode ?? report.lockerId ?? "-"}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium">Cabinet</div>
            <div className="text-sm text-muted-foreground">
              {report.cabinetName ?? report.cabinetCode ?? report.cabinetId ?? "-"}
            </div>
          </div>
        </div>
      </div>
      {hasCustomerInfo && (
        <>
          <Separator />
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Thông tin khách hàng
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {report.customerName && (
                <div className="space-y-1">
                  <div className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Họ và tên
                  </div>
                  <div className="text-sm text-muted-foreground">{report.customerName}</div>
                </div>
              )}
              {report.customerEmail && (
                <div className="space-y-1">
                  <div className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                  <div className="text-sm text-muted-foreground">{report.customerEmail}</div>
                </div>
              )}
              {report.customerPhone && (
                <div className="space-y-1">
                  <div className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Số điện thoại
                  </div>
                  <div className="text-sm text-muted-foreground">{report.customerPhone}</div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      <Separator />
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Mô tả
        </h3>
        <div className="space-y-1">
          <div className="text-sm font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Chi tiết
          </div>
          <div className="text-sm text-muted-foreground p-3 rounded-md bg-muted/50">
            {report.description ?? report.issueDescription ?? "-"}
          </div>
        </div>
      </div>
      {((report.photoUrls?.length ?? 0) > 0 || (report.images?.length ?? 0) > 0) && (
        <>
          <Separator />
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Hình ảnh đính kèm
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(report.photoUrls ?? report.images ?? []).map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-md overflow-hidden border border-border bg-muted"
                >
                  <img
                    src={imageUrl}
                    alt={`Hình ảnh ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function AssignedStaffContent({
  assignedStaff,
  assignmentSummary,
}: {
  assignedStaff: AssignedStaffItem[];
  assignmentSummary?: { totalTasks: number; openTasks: number; inProgressTasks: number; completedTasks: number };
}) {
  return (
    <div className="space-y-4">
      {assignmentSummary != null && (
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Tổng: {assignmentSummary.totalTasks} task</Badge>
          <Badge variant="outline">Mở: {assignmentSummary.openTasks}</Badge>
          <Badge variant="outline">Đang xử lý: {assignmentSummary.inProgressTasks}</Badge>
          <Badge variant="outline">Hoàn thành: {assignmentSummary.completedTasks}</Badge>
        </div>
      )}
      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium">Nhân viên</th>
              <th className="text-left p-3 font-medium">Mã task</th>
              <th className="text-left p-3 font-medium">Loại</th>
              <th className="text-left p-3 font-medium">Trạng thái</th>
              <th className="text-left p-3 font-medium">Ưu tiên</th>
              <th className="text-left p-3 font-medium">Ngày phân công</th>
            </tr>
          </thead>
          <tbody>
            {assignedStaff.map((item) => (
              <tr key={item.taskId} className="border-b last:border-0">
                <td className="p-3 font-medium">{item.staffName}</td>
                <td className="p-3 font-mono text-xs">{item.taskCode}</td>
                <td className="p-3">{TASK_TYPE_LABELS[item.taskType] ?? item.taskType}</td>
                <td className="p-3">
                  <StatusComponent status={item.taskStatus} />
                </td>
                <td className="p-3">{item.priority}</td>
                <td className="p-3 text-muted-foreground">
                  {item.assignedAt ? new Date(item.assignedAt).toLocaleString("vi-VN") : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CustomerReportDetailModal({
  open,
  onOpenChange,
  reportId,
  onAssign,
}: CustomerReportDetailModalProps) {
  const [report, setReport] = useState<CustomerReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !reportId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReport(null);
      setError(null);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    maintenanceReportService
      .getById(reportId)
      .then((res) => {
        if (cancelled) return;
        const data = extractReportFromResponse(res);
        setReport(data ?? null);
        if (!data) setError("Không thể tải chi tiết báo cáo");
      })
      .catch((err) => {
        if (cancelled) return;
        setReport(null);
        setError(err?.message ?? "Có lỗi khi tải chi tiết báo cáo");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, [open, reportId]);

  if (!open) return null;

  const status = report?.status ?? "PENDING";
  const hasCustomerInfo = report && (report.customerName || report.customerEmail || report.customerPhone);
  const hasIssueType = report?.issueType && issueTypeConfig[report.issueType];
  const hasPriority = report?.priority && priorityConfig[report.priority];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-destructive">
            <AlertCircle className="h-10 w-10" />
            <p className="text-sm font-medium">{error}</p>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
          </div>
        )}
        {report && !isLoading && !error && (
        <>
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">
                {report.title ?? report.code ?? report.reportCode ?? "-"}
              </DialogTitle>
              <DialogDescription>
                Chi tiết báo cáo từ khách hàng
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2 mr-5">
              <StatusComponent status={report.status} />
              {hasPriority && report && <Badge variant={priorityConfig[report.priority!].variant}>{priorityConfig[report.priority!].label}</Badge>}
            </div>
          </div>
        </DialogHeader>

        {report.assignedStaff?.length ? (
          <Tabs defaultValue="report" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="report" className="active-tab flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Thông tin báo cáo
              </TabsTrigger>
              <TabsTrigger value="staff" className="active-tab flex items-center gap-2">
                <Users className="h-4 w-4" />
                Danh sách nhân viên
              </TabsTrigger>
            </TabsList>
            <TabsContent value="report" className="mt-4">
              <ReportInfoContent report={report} hasCustomerInfo={!!hasCustomerInfo} hasIssueType={!!hasIssueType} />
            </TabsContent>
            <TabsContent value="staff" className="mt-4">
              <AssignedStaffContent assignedStaff={report.assignedStaff} assignmentSummary={report.assignmentSummary} />
            </TabsContent>
          </Tabs>
        ) : (
        <div className="space-y-6">
          {/* Thông tin báo cáo */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Thông tin báo cáo
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {(report.code != null && report.code !== "") && (
                <div className="space-y-1">
                  <div className="text-sm font-medium">Mã báo cáo</div>
                  <div className="text-sm text-muted-foreground font-mono">{report.code}</div>
                </div>
              )}
              <div className="space-y-1">
                <div className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Ngày báo cáo
                </div>
                <div className="text-sm text-muted-foreground">
                  {(report.createdAt ?? report.reportedAt)
                    ? new Date(report.createdAt ?? report.reportedAt!).toLocaleString("vi-VN")
                    : "-"}
                </div>
              </div>

              {hasIssueType && (
                <div className="space-y-1">
                  <div className="text-sm font-medium">Loại vấn đề</div>
                  <Badge variant={issueTypeConfig[report.issueType!].variant}>{issueTypeConfig[report.issueType!].label}</Badge>
                </div>
              )}

              <div className="space-y-1">
                <div className="text-sm font-medium flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Locker
                </div>
                <div className="text-sm text-muted-foreground font-mono">
                  {report.lockerLabel ?? report.lockerCode ?? report.lockerId ?? "-"}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium">Cabinet</div>
                <div className="text-sm text-muted-foreground">
                  {report.cabinetName ?? report.cabinetCode ?? report.cabinetId ?? "-"}
                </div>
              </div>
            </div>
          </div>

          {hasCustomerInfo && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Thông tin khách hàng
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {report.customerName && (
                    <div className="space-y-1">
                      <div className="text-sm font-medium flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Họ và tên
                      </div>
                      <div className="text-sm text-muted-foreground">{report.customerName}</div>
                    </div>
                  )}
                  {report.customerEmail && (
                    <div className="space-y-1">
                      <div className="text-sm font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </div>
                      <div className="text-sm text-muted-foreground">{report.customerEmail}</div>
                    </div>
                  )}
                  {report.customerPhone && (
                    <div className="space-y-1">
                      <div className="text-sm font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Số điện thoại
                      </div>
                      <div className="text-sm text-muted-foreground">{report.customerPhone}</div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Mô tả vấn đề */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Mô tả
            </h3>
            <div className="space-y-1">
              <div className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Chi tiết
              </div>
              <div className="text-sm text-muted-foreground p-3 rounded-md bg-muted/50">
                {report.description ?? report.issueDescription ?? "-"}
              </div>
            </div>
          </div>

          {/* Hình ảnh đính kèm (photoUrls từ API hoặc images) */}
          {((report.photoUrls?.length ?? 0) > 0 || (report.images?.length ?? 0) > 0) && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Hình ảnh đính kèm
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(report.photoUrls ?? report.images ?? []).map((imageUrl, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-md overflow-hidden border border-border bg-muted"
                    >
                      <img
                        src={imageUrl}
                        alt={`Hình ảnh ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Thông tin phân công (khi không dùng assignedStaff) */}
          {report.assignedTo && !report.assignedStaff?.length && (
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
        )}

        <div className="flex items-center justify-end gap-2 pt-4 border-t">
          {report && onAssign && (
            <>
              {!report.assignedStaff?.length && status === "PENDING" && (
                <Button onClick={() => onAssign(report)}>
                  Phân công nhân viên kỹ thuật
                </Button>
              )}
              {report.assignedStaff?.length && ["ASSIGNED", "IN_PROGRESS"].includes(status) && (
                <Button onClick={() => onAssign(report)}>
                  Phân công thêm
                </Button>
              )}
            </>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </div>
        </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default CustomerReportDetailModal;
