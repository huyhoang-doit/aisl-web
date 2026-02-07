import { useState } from "react";
import { DataTable, type Column, type SortConfig, type QuickFilter } from "@/shared/components/DataTable";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Eye, UserCheck, Plus, ImageIcon } from "lucide-react";
import CustomerReportDetailModal from "../features/customerReport/modals/CustomerReportDetailModal";
import AssignTechnicalStaffModal from "../features/customerReport/modals/AssignTechnicalStaffModal";
import CreateReportModal from "../features/customerReport/modals/CreateReportModal";
import { useCustomerReport } from "../features/customerReport/hooks/useCustomerReport";
import { useTechnicalStaff } from "../features/staff/hooks/useTechnicalStaff";
import type { CustomerReport } from "../features/customerReport/types/customerReport.types";
import type { CreateTaskPayload } from "../features/customerReport/services/maintenanceTask.service";

const ManageCustomerReport = () => {
  const {
    reports: customerReports,
    total,
    isLoading,
    page,
    pageSize,
    setPage,
    setPageSize,
    handleSearch,
    handleFilter,
    handleClearFilters,
    createReport,
    assignTask,
    isCreating,
  } = useCustomerReport({ defaultPageSize: 10 });

  const { staffList: technicalStaff } = useTechnicalStaff();

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<CustomerReport | null>(null);

  const [, setSortConfig] = useState<SortConfig | null>(null);

  const STATUS_CONFIG: Record<string, { label: string; variant: "secondary" | "default" | "destructive" }> = {
    PENDING: { label: "Chờ xử lý", variant: "secondary" },
    ASSIGNED: { label: "Đã phân công", variant: "default" },
    IN_PROGRESS: { label: "Đang xử lý", variant: "default" },
    COMPLETED: { label: "Hoàn thành", variant: "default" },
    REJECTED: { label: "Từ chối", variant: "destructive" },
  };

  // Định nghĩa columns cho bảng (theo API response: code, title, description, lockerLabel, cabinetName, status, createdAt)
  const columns: Column<CustomerReport>[] = [
    {
      key: "code",
      header: "Mã báo cáo",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Tìm theo mã",
      accessor: (row) => (
        <div className="font-medium font-mono text-xs">{row.code ?? "-"}</div>
      ),
    },
    {
      key: "title",
      header: "Tiêu đề",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Tìm theo tiêu đề",
      accessor: (row) => <div className="font-medium">{row.title ?? "-"}</div>,
    },
    // {
    //   key: "description",
    //   header: "Mô tả",
    //   sortable: true,
    //   accessor: (row) => (
    //     <div className="text-sm text-muted-foreground max-w-[200px] truncate">
    //       {row.description ?? "-"}
    //     </div>
    //   ),
    // },
    {
      key: "lockerLabel",
      header: "Locker",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Tìm theo locker",
      accessor: (row) => (
        <div className="text-sm font-mono">{row.lockerLabel ?? "-"}</div>
      ),
    },
    {
      key: "cabinetName",
      header: "Cabinet",
      sortable: true,
      accessor: (row) => (
        <div className="text-sm">{row.cabinetName ?? "-"}</div>
      ),
    },
    {
      key: "photoUrls",
      header: "Ảnh",
      sortable: false,
      accessor: (row) => {
        const urls = row.photoUrls ?? row.images ?? [];
        const count = urls.length;
        if (count === 0) return <span className="text-muted-foreground text-sm">-</span>;
        return (
          <div className="flex items-center gap-1.5 text-sm">
            {/* <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" /> */}
            <span>{count} ảnh</span> {/* TODO: Add image preview */}
            {urls[0] && (
              <div className="w-8 h-8 rounded overflow-hidden border border-border shrink-0">
                <img src={urls[0]} alt="" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Trạng thái",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: ["Chờ xử lý", "Đã phân công", "Đang xử lý", "Hoàn thành", "Từ chối"],
      accessor: (row) => {
        const status = row.status ?? "PENDING";
        const config = STATUS_CONFIG[status] ?? { label: status, variant: "secondary" as const };
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    // {
    //   key: "assignedToName",
    //   header: "Nhân viên kỹ thuật",
    //   sortable: true,
    //   accessor: (row) => (
    //     <div className="text-muted-foreground">{row.assignedToName ?? "Chưa phân công"}</div>
    //   ),
    // },
    {
      key: "createdAt",
      header: "Ngày báo cáo",
      sortable: true,
      filterable: true,
      filterType: "date",
      accessor: (row) => (
        <div className="text-sm text-muted-foreground">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString("vi-VN") : "-"}
        </div>
      ),
    },
  ];

  // Quick filters
  const quickFilters: QuickFilter[] = [
    {
      key: "status",
      label: "Trạng thái",
      placeholder: "Chọn trạng thái",
      options: [
        { value: "Chờ xử lý", label: "Chờ xử lý" },
        { value: "Đã phân công", label: "Đã phân công" },
        { value: "Đang xử lý", label: "Đang xử lý" },
        { value: "Hoàn thành", label: "Hoàn thành" },
        { value: "Từ chối", label: "Từ chối" },
      ],
    },
    {
      key: "priority",
      label: "Độ ưu tiên",
      placeholder: "Chọn độ ưu tiên",
      options: [
        { value: "Thấp", label: "Thấp" },
        { value: "Trung bình", label: "Trung bình" },
        { value: "Cao", label: "Cao" },
        { value: "Khẩn cấp", label: "Khẩn cấp" },
      ],
    },
  ];

  const handleSort = (sort: SortConfig | null) => {
    setSortConfig(sort);
    setPage(1);
  };

  const handleViewDetails = (report: CustomerReport) => {
    setSelectedReportId(report.id);
    setIsDetailModalOpen(true);
  };

  const handleAssign = (report: CustomerReport) => {
    setSelectedReport(report);
    setIsDetailModalOpen(false);
    setIsAssignModalOpen(true);
  };

  const handleAssignSubmit = async (payload: CreateTaskPayload) => {
    await assignTask(payload);
    setIsAssignModalOpen(false);
    setSelectedReport(null);
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
    setSelectedReportId(null);
  };

  const handleAssignModalClose = () => {
    setIsAssignModalOpen(false);
    setSelectedReport(null);
  };

  const customActions = [
    {
      label: "Xem chi tiết",
      icon: <Eye className="h-4 w-4" />,
      onClick: handleViewDetails,
      variant: "ghost" as const,
    },
    {
      label: "Phân công",
      icon: <UserCheck className="h-4 w-4" />,
      onClick: (report: CustomerReport) => {
        const status = (report.status ?? "PENDING").toUpperCase();
        if (status !== "ASSIGNED" && status !== "IN_PROGRESS" && status !== "COMPLETED") {
          handleAssign(report);
        }
      },
      variant: "ghost" as const,
      className: "text-primary hover:text-primary hover:bg-primary/10",
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý báo cáo từ khách hàng</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý và phân công xử lý các báo cáo từ phía khách hàng
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo báo cáo
        </Button>
      </div>

      <DataTable
        data={customerReports}
        columns={columns}
        keyExtractor={(row) => row.id}
        customActions={customActions}
        emptyMessage="Chưa có báo cáo nào"
        isLoading={isLoading}
        onSort={handleSort}
        onFilter={handleFilter}
        pagination={{
          page,
          pageSize,
          total,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
          pageSizeOptions: [5, 10, 20, 50],
        }}
        searchable={true}
        searchPlaceholder="Tìm kiếm theo tiêu đề, mã báo cáo..."
        onSearch={handleSearch}
        quickFilters={quickFilters}
        onQuickFilterChange={() => setPage(1)}
        onClearFilters={() => {
          handleClearFilters();
        }}
      />

      {selectedReportId != null && (
        <CustomerReportDetailModal
          open={isDetailModalOpen}
          onOpenChange={handleDetailModalClose}
          reportId={selectedReportId}
          onAssign={handleAssign}
        />
      )}

      {selectedReport && (
        <AssignTechnicalStaffModal
          open={isAssignModalOpen}
          onOpenChange={handleAssignModalClose}
          report={selectedReport}
          technicalStaffList={technicalStaff}
          onSubmit={handleAssignSubmit}
        />
      )}

      <CreateReportModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={createReport}
        isSubmitting={isCreating}
      />
    </div>
  );
};

export default ManageCustomerReport;
