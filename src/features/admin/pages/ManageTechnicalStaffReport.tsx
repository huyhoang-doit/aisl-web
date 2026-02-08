import { useState } from "react";
import { DataTable, type Column, type SortConfig } from "@/shared/components/DataTable";
import { Badge } from "@/shared/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Eye, CheckCircle2, XCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import TechnicalStaffReportDetailModal from "../features/staffReport/modals/TechnicalStaffReportDetailModal";
import { useStaffReport } from "../features/staffReport/hooks/useStaffReport";
import type { TechnicalStaffReport } from "../features/customerReport/types/customerReport.types";

function getCustomerReport(row: TechnicalStaffReport): Record<string, unknown> {
  const cr = row.customerReport ?? (row as unknown as { incidentReport?: unknown }).incidentReport;
  return (cr as unknown as Record<string, unknown>) ?? {};
}

const ManageTechnicalStaffReport = () => {
  const [currentTab, setCurrentTab] = useState<"pending_review" | "assigned">("pending_review");

  const {
    tasks,
    total,
    isLoading,
    page,
    pageSize,
    setPage,
    setPageSize,
    updateTaskStatus,
    assignTask,
    isUpdating,
  } = useStaffReport({
    tab: currentTab,
    defaultPageSize: 10,
  });

  const [selectedReport, setSelectedReport] = useState<TechnicalStaffReport | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const [, setSortConfig] = useState<SortConfig | null>(null);

  const columns: Column<TechnicalStaffReport>[] = [
    {
      key: "reportCode",
      header: "Mã báo cáo",
      sortable: true,
      accessor: (row) => <div className="font-medium">{row.reportCode ?? "-"}</div>,
    },
    {
      key: "customerName",
      header: "Khách hàng",
      sortable: true,
      accessor: (row) => {
        const cr = getCustomerReport(row);
        return (
          <div>
            <div className="font-medium">{String(cr?.customerName ?? cr?.customer_name ?? "-")}</div>
            <div className="text-sm text-muted-foreground">{String(cr?.customerEmail ?? cr?.customer_email ?? "")}</div>
          </div>
        );
      },
    },
    {
      key: "lockerCode",
      header: "Locker",
      sortable: true,
      accessor: (row) => {
        const cr = getCustomerReport(row);
        return (
          <div>
            <div className="font-medium">{String(cr?.lockerCode ?? cr?.locker_code ?? "-")}</div>
            {cr?.cabinetCode ? <div className="text-sm text-muted-foreground">Cabinet: {String(cr.cabinetCode)}</div> : null}
          </div>
        );
      },
    },
    {
      key: "issueType",
      header: "Loại vấn đề",
      sortable: true,
      accessor: (row) => {
        const cr = getCustomerReport(row);
        const issueType = String(cr?.issueType ?? cr?.issue_type ?? "other").toLowerCase();
        const issueConfig: Record<string, { label: string; variant: "destructive" | "secondary" }> = {
          broken: { label: "Hỏng", variant: "destructive" },
          stuck: { label: "Kẹt", variant: "destructive" },
          cannot_open: { label: "Không mở được", variant: "destructive" },
          other: { label: "Khác", variant: "secondary" },
        };
        const config = issueConfig[issueType] ?? issueConfig.other;
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      key: "priority",
      header: "Độ ưu tiên",
      sortable: true,
      accessor: (row) => {
        const cr = getCustomerReport(row);
        const priority = String(cr?.priority ?? "medium").toLowerCase();
        const priorityConfig: Record<string, { label: string; variant: "secondary" | "default" | "destructive" }> = {
          low: { label: "Thấp", variant: "secondary" },
          medium: { label: "Trung bình", variant: "default" },
          high: { label: "Cao", variant: "destructive" },
          urgent: { label: "Khẩn cấp", variant: "destructive" },
        };
        const config = priorityConfig[priority] ?? priorityConfig.medium;
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      key: "technicalStaffName",
      header: "Nhân viên kỹ thuật",
      sortable: true,
      accessor: (row) => <div className="text-muted-foreground">{row.technicalStaffName ?? "-"}</div>,
    },
    {
      key: "status",
      header: "Trạng thái",
      sortable: true,
      accessor: (row) => {
        const status = (row.status ?? "").toLowerCase();
        const statusConfig: Record<string, { label: string; variant: "secondary" | "default" | "destructive" }> = {
          pending_review: { label: "Chờ duyệt", variant: "secondary" },
          approved: { label: "Đã duyệt", variant: "default" },
          rejected: { label: "Từ chối", variant: "destructive" },
          in_progress: { label: "Đang xử lý", variant: "default" },
          completed: { label: "Hoàn thành", variant: "default" },
        };
        const config = statusConfig[status] ?? { label: status || "-", variant: "secondary" as const };
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      key: "submittedAt",
      header: currentTab === "pending_review" ? "Ngày gửi" : "Ngày phân công",
      sortable: true,
      accessor: (row) => (
        <div className="text-sm text-muted-foreground">
          {row.submittedAt
            ? new Date(row.submittedAt).toLocaleDateString("vi-VN")
            : row.createdAt
            ? new Date(row.createdAt).toLocaleDateString("vi-VN")
            : "-"}
        </div>
      ),
    },
  ];

  const handleSort = (sort: SortConfig | null) => {
    setSortConfig(sort);
    setPage(1);
  };

  const handleApprove = (report: TechnicalStaffReport) => {
    setSelectedReport(report);
    setIsApproveDialogOpen(true);
  };

  const handleReject = (report: TechnicalStaffReport) => {
    setSelectedReport(report);
    setIsRejectDialogOpen(true);
  };

  const confirmApprove = async () => {
    if (!selectedReport?.id) return;
    await updateTaskStatus(selectedReport.id, { status: "APPROVED" });
    setIsApproveDialogOpen(false);
    setSelectedReport(null);
  };

  const confirmReject = async () => {
    if (!selectedReport?.id) return;
    await updateTaskStatus(selectedReport.id, { status: "REJECTED" });
    setIsRejectDialogOpen(false);
    setSelectedReport(null);
  };

  const handleViewDetails = (report: TechnicalStaffReport) => {
    setSelectedReport(report);
    setIsDetailModalOpen(true);
  };

  const handleReassign = async (payload: Parameters<typeof assignTask>[0]) => {
    await assignTask(payload);
  };

  const customActions = [
    {
      label: "Xem chi tiết",
      icon: <Eye className="h-4 w-4" />,
      onClick: handleViewDetails,
      variant: "ghost" as const,
    },
    ...(currentTab === "pending_review"
      ? [
          {
            label: "Duyệt",
            icon: <CheckCircle2 className="h-4 w-4" />,
            onClick: handleApprove,
            variant: "ghost" as const,
            className: "text-green-600 hover:text-green-600 hover:bg-green-50",
          },
          {
            label: "Từ chối",
            icon: <XCircle className="h-4 w-4" />,
            onClick: handleReject,
            variant: "ghost" as const,
            className: "text-red-600 hover:text-red-600 hover:bg-red-50",
          },
        ]
      : []),
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản lý báo cáo nhân viên kỹ thuật</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý các báo cáo đã được phân công cho nhân viên kỹ thuật
        </p>
      </div>

      <Tabs
        value={currentTab}
        onValueChange={(value) => {
          setCurrentTab(value as "pending_review" | "assigned");
          setPage(1);
        }}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="pending_review" className="active-tab">
            Duyệt báo cáo ({currentTab === "pending_review" ? tasks.length : "-"})
          </TabsTrigger>
          <TabsTrigger value="assigned" className="active-tab">
            Đã phân công ({currentTab === "assigned" ? tasks.length : "-"})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending_review" className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Danh sách các report đã được bảo trì và đợi staff confirm hoàn thành hoặc từ chối để thực hiện lại
          </div>
          <DataTable
            data={tasks}
            columns={columns}
            keyExtractor={(row) => row.id}
            customActions={customActions}
            emptyMessage="Chưa có báo cáo nào chờ duyệt"
            isLoading={isLoading || isUpdating}
            onSort={handleSort}
            pagination={{
              page,
              pageSize,
              total,
              onPageChange: setPage,
              onPageSizeChange: setPageSize,
              pageSizeOptions: [5, 10, 20, 50],
            }}
          />
        </TabsContent>

        <TabsContent value="assigned" className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Danh sách các yêu cầu từ phía khách hàng đã được phân công nhưng technical staff chưa thực hiện
          </div>
          <DataTable
            data={tasks}
            columns={columns}
            keyExtractor={(row) => row.id}
            customActions={customActions}
            emptyMessage="Chưa có báo cáo nào đã phân công"
            isLoading={isLoading || isUpdating}
            onSort={handleSort}
            pagination={{
              page,
              pageSize,
              total,
              onPageChange: setPage,
              onPageSizeChange: setPageSize,
              pageSizeOptions: [5, 10, 20, 50],
            }}
          />
        </TabsContent>
      </Tabs>

      <AlertDialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận duyệt báo cáo</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn duyệt báo cáo{" "}
              <strong>{selectedReport?.reportCode}</strong>? Báo cáo này sẽ được đánh dấu là đã hoàn thành.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmApprove} disabled={isUpdating}>
              Duyệt
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận từ chối báo cáo</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn từ chối báo cáo{" "}
              <strong>{selectedReport?.reportCode}</strong>? Báo cáo này sẽ được yêu cầu thực hiện lại bảo trì.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReject}
              disabled={isUpdating}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Từ chối
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedReport && (
        <TechnicalStaffReportDetailModal
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          report={selectedReport}
          onAssign={handleReassign}
        />
      )}
    </div>
  );
};

export default ManageTechnicalStaffReport;
