import { useState } from "react";
import { DataTable, type Column, type SortConfig, type QuickFilter } from "@/shared/components/DataTable";
import StatusComponent from "@/shared/components/StatusComponent";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Eye, UserCheck, Plus } from "lucide-react";
import CustomerReportDetailModal from "../features/customerReport/modals/CustomerReportDetailModal";
import AssignTechnicalStaffModal from "../features/customerReport/modals/AssignTechnicalStaffModal";
import CreateReportModal from "../features/customerReport/modals/CreateReportModal";
import {
  useCustomerReport,
  type IncidentReportStatusTab,
} from "../features/customerReport/hooks/useCustomerReport";
import type { CustomerReport } from "../features/customerReport/types/customerReport.types";
import type { CreateTaskPayload } from "../features/task/services/task.service";

/** Enum trạng thái báo cáo sự cố (backend) */
const INCIDENT_STATUS_TABS: IncidentReportStatusTab[] = [
  "PENDING",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
];

const STATUS_LABELS: Record<IncidentReportStatusTab, string> = {
  PENDING: "Chờ xử lý",
  ASSIGNED: "Đã phân công",
  IN_PROGRESS: "Đang xử lý",
  RESOLVED: "Đã xử lý",
  CLOSED: "Đã đóng",
};

/** Màu tab theo trạng thái: active state */
const TAB_COLOR_CLASS: Record<IncidentReportStatusTab, string> = {
  PENDING:
    "data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800 data-[state=active]:border-amber-300 border border-transparent border-border",
  ASSIGNED:
    "data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 data-[state=active]:border-blue-300 border border-transparent border-border",
  IN_PROGRESS:
    "data-[state=active]:bg-sky-100 data-[state=active]:text-sky-800 data-[state=active]:border-sky-300 border border-transparent border-border",
  RESOLVED:
    "data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800 data-[state=active]:border-emerald-300 border border-transparent border-border",
  CLOSED:
    "data-[state=active]:bg-red-100 data-[state=active]:text-red-800 data-[state=active]:border-red-300 border border-transparent border-border",
};

const ManageCustomerReport = () => {
  const [currentTab, setCurrentTab] = useState<IncidentReportStatusTab>("PENDING");

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
    assignTasks,
    isCreating,
  } = useCustomerReport({ defaultPageSize: 10, status: currentTab });

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<CustomerReport | null>(null);

  const [, setSortConfig] = useState<SortConfig | null>(null);

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
            <span>{count} ảnh</span>
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
      accessor: (row) => <StatusComponent status={row.status} />,
    },
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

  const quickFilters: QuickFilter[] = [
    {
      key: "sortOrder",
      label: "Sắp xếp",
      placeholder: "Sắp xếp",
      hideAllOption: true,
      defaultValue: "Mới nhất",
      options: [
        { value: "Mới nhất", label: "Mới nhất" },
        { value: "Cũ nhất", label: "Cũ nhất" },
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

  const handleAssignSubmit = async (payloads: CreateTaskPayload[]) => {
    await assignTasks(payloads);
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
      onClick: handleAssign,
      variant: "ghost" as const,
      className: "text-primary hover:text-primary hover:bg-primary/10",
      visible: (row: CustomerReport) =>
        (row.status ?? "PENDING").toUpperCase() === "PENDING",
    },
    {
      label: "Phân công thêm",
      icon: <UserCheck className="h-4 w-4" />,
      onClick: handleAssign,
      variant: "ghost" as const,
      className: "text-primary hover:text-primary hover:bg-primary/10",
      visible: (row: CustomerReport) =>
        (row.status ?? "").toUpperCase() === "ASSIGNED",
    },
  ];

  const emptyMessages: Record<IncidentReportStatusTab, string> = {
    PENDING: "Chưa có báo cáo nào chờ xử lý",
    ASSIGNED: "Chưa có báo cáo nào đã phân công",
    IN_PROGRESS: "Chưa có báo cáo nào đang xử lý",
    RESOLVED: "Chưa có báo cáo nào đã xử lý",
    CLOSED: "Chưa có báo cáo nào đã đóng",
  };

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

      <Tabs
        value={currentTab}
        onValueChange={(value) => {
          setCurrentTab(value as IncidentReportStatusTab);
          setPage(1);
        }}
        className="w-full"
      >
        <TabsList className="flex justify-start flex-wrap h-auto gap-1 p-1 bg-muted/50">
          {INCIDENT_STATUS_TABS.map((status) => (
            <TabsTrigger
              key={status}
              value={status}
              className={TAB_COLOR_CLASS[status]}
            >
              {STATUS_LABELS[status]}
            </TabsTrigger>
          ))}
        </TabsList>

        {INCIDENT_STATUS_TABS.map((tabValue) => (
          <TabsContent key={tabValue} value={tabValue} className="space-y-4 mt-4">
            <DataTable
              data={customerReports}
              columns={columns}
              keyExtractor={(row) => row.id}
              customActions={customActions}
              emptyMessage={emptyMessages[tabValue]}
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
              onClearFilters={() => handleClearFilters()}
            />
          </TabsContent>
        ))}
      </Tabs>

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
