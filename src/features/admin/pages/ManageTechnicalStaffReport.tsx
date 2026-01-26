import { useState, useMemo } from "react";
import { DataTable, type Column, type SortConfig, type FilterConfig, type QuickFilter } from "@/shared/components/DataTable";
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
import type { Staff } from "@/features/admin/features/staff/types/staff.types";
import TechnicalStaffReportDetailModal from "../features/staffReport/modals/TechnicalStaffReportDetailModal";
import type { TechnicalStaffReport } from "../features/customerReport/types/customerReport.types";
// Mock data - Thay thế bằng API call thực tế
// Duyệt báo cáo - Reports that have been maintained and are waiting for staff to confirm completion or reject to redo
const mockPendingReviewReports: TechnicalStaffReport[] = [
  {
    id: "tsr1",
    reportId: "1",
    reportCode: "CR001",
    technicalStaffId: "staff-1",
    technicalStaffName: "Lê Văn Kỹ Thuật",
    status: "pending_review",
    customerReport: {
      id: "1",
      reportCode: "CR001",
      customerName: "Nguyễn Văn A",
      customerEmail: "nguyenvana@example.com",
      customerPhone: "+84 123 456 789",
      lockerCode: "LA001",
      lockerId: "locker-1",
      cabinetCode: "CB001",
      cabinetId: "cabinet-1",
      issueType: "broken",
      issueDescription: "Locker không mở được, có tiếng kêu lạ",
      priority: "high",
      status: "completed",
      reportedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    maintenanceDescription: "Đã thay thế khóa và kiểm tra toàn bộ hệ thống. Locker hoạt động bình thường.",
    maintenanceImages: [],
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "tsr2",
    reportId: "2",
    reportCode: "CR002",
    technicalStaffId: "staff-2",
    technicalStaffName: "Phạm Văn Kỹ Thuật",
    status: "pending_review",
    customerReport: {
      id: "2",
      reportCode: "CR002",
      customerName: "Trần Thị B",
      customerEmail: "tranthib@example.com",
      customerPhone: "+84 987 654 321",
      lockerCode: "LA002",
      lockerId: "locker-2",
      cabinetCode: "CB001",
      cabinetId: "cabinet-1",
      issueType: "stuck",
      issueDescription: "Cửa locker bị kẹt, không đóng được",
      priority: "medium",
      status: "completed",
      reportedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
    maintenanceDescription: "Đã làm sạch và bôi trơn hệ thống khóa. Cửa locker hoạt động tốt.",
    maintenanceImages: [],
    submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

// Đã phân công - Reports from customers that have been assigned but technical staff haven't implemented yet
const mockAssignedReports: TechnicalStaffReport[] = [
  {
    id: "tsr3",
    reportId: "3",
    reportCode: "CR003",
    technicalStaffId: "staff-1",
    technicalStaffName: "Lê Văn Kỹ Thuật",
    status: "in_progress",
    customerReport: {
      id: "3",
      reportCode: "CR003",
      customerName: "Lê Văn C",
      customerEmail: "levanc@example.com",
      customerPhone: "+84 555 123 456",
      lockerCode: "LA003",
      lockerId: "locker-3",
      cabinetCode: "CB002",
      cabinetId: "cabinet-2",
      issueType: "cannot_open",
      issueDescription: "Mã PIN không hoạt động",
      priority: "urgent",
      status: "in_progress",
      reportedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "tsr4",
    reportId: "4",
    reportCode: "CR004",
    technicalStaffId: "staff-2",
    technicalStaffName: "Phạm Văn Kỹ Thuật",
    status: "in_progress",
    customerReport: {
      id: "4",
      reportCode: "CR004",
      customerName: "Phạm Thị D",
      customerEmail: "phamthid@example.com",
      customerPhone: "+84 111 222 333",
      lockerCode: "LA004",
      lockerId: "locker-4",
      cabinetCode: "CB002",
      cabinetId: "cabinet-2",
      issueType: "other",
      issueDescription: "Locker bị ẩm, có nước rỉ vào",
      priority: "low",
      status: "in_progress",
      reportedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

// Mock technical staff list - Thay thế bằng API call thực tế
const mockTechnicalStaff: Staff[] = [
  {
    id: "staff-1",
    name: "Lê Văn Kỹ Thuật",
    email: "kythuat1@example.com",
    phone: "+84 123 456 789",
    role: "technical_staff",
    status: "active",
    department: "Bảo trì",
    position: "Kỹ thuật viên",
  },
  {
    id: "staff-2",
    name: "Phạm Văn Kỹ Thuật",
    email: "kythuat2@example.com",
    phone: "+84 987 654 321",
    role: "technical_staff",
    status: "active",
    department: "Bảo trì",
    position: "Kỹ thuật viên",
  },
  {
    id: "staff-3",
    name: "Nguyễn Thị Kỹ Thuật",
    email: "kythuat3@example.com",
    phone: "+84 555 123 456",
    role: "technical_staff",
    status: "active",
    department: "Bảo trì",
    position: "Kỹ thuật viên",
  },
];

const ManageTechnicalStaffReport = () => {
  const [pendingReviewReports, setPendingReviewReports] = useState<TechnicalStaffReport[]>(mockPendingReviewReports);
  const [assignedReports, setAssignedReports] = useState<TechnicalStaffReport[]>(mockAssignedReports);
  const [technicalStaff] = useState<Staff[]>(mockTechnicalStaff);
  const [selectedReport, setSelectedReport] = useState<TechnicalStaffReport | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<"pending_review" | "assigned">("pending_review");

  // State cho các tính năng
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Get current data based on tab
  const currentData = useMemo(() => {
    return currentTab === "pending_review" ? pendingReviewReports : assignedReports;
  }, [currentTab, pendingReviewReports, assignedReports]);

  // Định nghĩa columns cho bảng
  const columns: Column<TechnicalStaffReport>[] = [
    {
      key: "reportCode",
      header: "Mã báo cáo",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Tìm theo mã",
      accessor: (row) => (
        <div className="font-medium">{row.reportCode}</div>
      ),
    },
    {
      key: "customerName",
      header: "Khách hàng",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Tìm theo tên",
      accessor: (row) => (
        <div>
          <div className="font-medium">{row.customerReport.customerName}</div>
          <div className="text-sm text-muted-foreground">{row.customerReport.customerEmail}</div>
        </div>
      ),
    },
    {
      key: "lockerCode",
      header: "Locker",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Tìm theo mã locker",
      accessor: (row) => (
        <div>
          <div className="font-medium">{row.customerReport.lockerCode}</div>
          {row.customerReport.cabinetCode && (
            <div className="text-sm text-muted-foreground">Cabinet: {row.customerReport.cabinetCode}</div>
          )}
        </div>
      ),
    },
    {
      key: "issueType",
      header: "Loại vấn đề",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: ["Hỏng", "Kẹt", "Không mở được", "Khác"],
      accessor: (row) => {
        const issueConfig = {
          broken: { label: "Hỏng", variant: "destructive" as const },
          stuck: { label: "Kẹt", variant: "destructive" as const },
          cannot_open: { label: "Không mở được", variant: "destructive" as const },
          other: { label: "Khác", variant: "secondary" as const },
        };
        const config = issueConfig[row.customerReport.issueType];
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      key: "priority",
      header: "Độ ưu tiên",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: ["Thấp", "Trung bình", "Cao", "Khẩn cấp"],
      accessor: (row) => {
        const priorityConfig = {
          low: { label: "Thấp", variant: "secondary" as const },
          medium: { label: "Trung bình", variant: "default" as const },
          high: { label: "Cao", variant: "destructive" as const },
          urgent: { label: "Khẩn cấp", variant: "destructive" as const },
        };
        const config = priorityConfig[row.customerReport.priority];
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      key: "technicalStaffName",
      header: "Nhân viên kỹ thuật",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Tìm theo tên",
      accessor: (row) => (
        <div className="text-muted-foreground">{row.technicalStaffName}</div>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: currentTab === "pending_review" 
        ? ["Chờ duyệt", "Đã duyệt", "Từ chối"]
        : ["Đã phân công", "Đang xử lý"],
      accessor: (row) => {
        const statusConfig = {
          pending_review: { label: "Chờ duyệt", variant: "secondary" as const },
          approved: { label: "Đã duyệt", variant: "default" as const },
          rejected: { label: "Từ chối", variant: "destructive" as const },
          in_progress: { label: "Đang xử lý", variant: "default" as const },
          completed: { label: "Hoàn thành", variant: "default" as const },
        };
        const config = statusConfig[row.status];
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      key: "submittedAt",
      header: currentTab === "pending_review" ? "Ngày gửi" : "Ngày phân công",
      sortable: true,
      filterable: true,
      filterType: "date",
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

  // Quick filters
  const quickFilters: QuickFilter[] = [
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

  // Xử lý sorting
  const handleSort = (sort: SortConfig | null) => {
    setSortConfig(sort);
    setPage(1);
  };

  // Xử lý filtering
  const handleFilter = (newFilters: FilterConfig[]) => {
    setFilters(newFilters);
    setPage(1);
  };

  // Xử lý search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  // Xử lý quick filter change
  const handleQuickFilterChange = () => {
    setPage(1);
  };

  // Filter và sort data
  const filteredAndSortedData = useMemo(() => {
    let result = [...currentData];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (report) =>
          report.reportCode.toLowerCase().includes(query) ||
          report.customerReport.customerName.toLowerCase().includes(query) ||
          report.customerReport.customerEmail.toLowerCase().includes(query) ||
          report.customerReport.lockerCode.toLowerCase().includes(query) ||
          report.technicalStaffName.toLowerCase().includes(query)
      );
    }

    // Apply filters
    filters.forEach((filter) => {
      if (filter.key === "status") {
        const statusMap: Record<string, TechnicalStaffReport["status"]> = {
          "Chờ duyệt": "pending_review",
          "Đã duyệt": "approved",
          "Từ chối": "rejected",
          "Đã phân công": "in_progress",
          "Đang xử lý": "in_progress",
        };
        const statusValue = statusMap[filter.value];
        if (statusValue) {
          result = result.filter((report) => report.status === statusValue);
        }
      } else if (filter.key === "priority") {
        const priorityMap: Record<string, TechnicalStaffReport["customerReport"]["priority"]> = {
          "Thấp": "low",
          "Trung bình": "medium",
          "Cao": "high",
          "Khẩn cấp": "urgent",
        };
        const priorityValue = priorityMap[filter.value];
        if (priorityValue) {
          result = result.filter((report) => report.customerReport.priority === priorityValue);
        }
      } else if (filter.key === "issueType") {
        const issueMap: Record<string, TechnicalStaffReport["customerReport"]["issueType"]> = {
          "Hỏng": "broken",
          "Kẹt": "stuck",
          "Không mở được": "cannot_open",
          "Khác": "other",
        };
        const issueValue = issueMap[filter.value];
        if (issueValue) {
          result = result.filter((report) => report.customerReport.issueType === issueValue);
        }
      } else {
        const value = filter.value.toLowerCase();
        result = result.filter((report) => {
          const fieldValue = String(report[filter.key as keyof TechnicalStaffReport] || "").toLowerCase();
          return fieldValue.includes(value);
        });
      }
    });

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        if (sortConfig.key === "customerName") {
          aValue = a.customerReport.customerName;
          bValue = b.customerReport.customerName;
        } else if (sortConfig.key === "lockerCode") {
          aValue = a.customerReport.lockerCode;
          bValue = b.customerReport.lockerCode;
        } else if (sortConfig.key === "issueType") {
          aValue = a.customerReport.issueType;
          bValue = b.customerReport.issueType;
        } else if (sortConfig.key === "priority") {
          aValue = a.customerReport.priority;
          bValue = b.customerReport.priority;
        } else {
          aValue = a[sortConfig.key as keyof TechnicalStaffReport];
          bValue = b[sortConfig.key as keyof TechnicalStaffReport];
        }

        if (aValue === undefined || aValue === null) return 1;
        if (bValue === undefined || bValue === null) return -1;

        const comparison =
          typeof aValue === "string" && typeof bValue === "string"
            ? aValue.localeCompare(bValue)
            : aValue < bValue
            ? -1
            : aValue > bValue
            ? 1
            : 0;

        return sortConfig.direction === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [currentData, searchQuery, filters, sortConfig]);

  // Pagination
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredAndSortedData.slice(start, end);
  }, [filteredAndSortedData, page, pageSize]);

  // Xử lý duyệt báo cáo
  const handleApprove = (report: TechnicalStaffReport) => {
    setSelectedReport(report);
    setIsApproveDialogOpen(true);
  };

  // Xử lý từ chối báo cáo
  const handleReject = (report: TechnicalStaffReport) => {
    setSelectedReport(report);
    setIsRejectDialogOpen(true);
  };

  // Xác nhận duyệt
  const confirmApprove = () => {
    if (!selectedReport) return;

    // TODO: Gọi API để duyệt báo cáo
    if (currentTab === "pending_review") {
      setPendingReviewReports(
        pendingReviewReports.map((report) =>
          report.id === selectedReport.id
            ? {
                ...report,
                status: "approved" as const,
                reviewedAt: new Date().toISOString(),
                reviewedBy: "current-user-id", // TODO: Get from auth
                reviewedByName: "Nhân viên hiện tại", // TODO: Get from auth
                updatedAt: new Date().toISOString(),
              }
            : report
        )
      );
    }

    setIsApproveDialogOpen(false);
    setSelectedReport(null);
    console.log("Approving report:", selectedReport.id);
  };

  // Xác nhận từ chối
  const confirmReject = () => {
    if (!selectedReport) return;

    // TODO: Gọi API để từ chối báo cáo
    if (currentTab === "pending_review") {
      setPendingReviewReports(
        pendingReviewReports.map((report) =>
          report.id === selectedReport.id
            ? {
                ...report,
                status: "rejected" as const,
                reviewedAt: new Date().toISOString(),
                reviewedBy: "current-user-id", // TODO: Get from auth
                reviewedByName: "Nhân viên hiện tại", // TODO: Get from auth
                reviewNote: "Cần thực hiện lại bảo trì", // TODO: Get from dialog input
                updatedAt: new Date().toISOString(),
              }
            : report
        )
      );
    }

    setIsRejectDialogOpen(false);
    setSelectedReport(null);
    console.log("Rejecting report:", selectedReport.id);
  };

  // Xử lý xem chi tiết
  const handleViewDetails = (report: TechnicalStaffReport) => {
    setSelectedReport(report);
    setIsDetailModalOpen(true);
  };

  // Xử lý phân công lại nhân viên kỹ thuật
  const handleReassign = async (reportId: string, staffId: string) => {
    // TODO: Gọi API để phân công lại
    const staff = technicalStaff.find((s) => s.id === staffId);
    if (!staff) return;

    // Cập nhật trong pendingReviewReports
    setPendingReviewReports(
      pendingReviewReports.map((report) =>
        report.customerReport.id === reportId
          ? {
              ...report,
              technicalStaffId: staffId,
              technicalStaffName: staff.name,
              updatedAt: new Date().toISOString(),
            }
          : report
      )
    );

    // Cập nhật trong assignedReports
    setAssignedReports(
      assignedReports.map((report) =>
        report.customerReport.id === reportId
          ? {
              ...report,
              technicalStaffId: staffId,
              technicalStaffName: staff.name,
              updatedAt: new Date().toISOString(),
            }
          : report
      )
    );

    // Cập nhật selectedReport nếu đang mở modal
    if (selectedReport?.customerReport.id === reportId) {
      setSelectedReport({
        ...selectedReport,
        technicalStaffId: staffId,
        technicalStaffName: staff.name,
        updatedAt: new Date().toISOString(),
      });
    }

    console.log("Reassigning report:", reportId, "to staff:", staffId);
  };

  // Custom actions for table
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
          setFilters([]);
          setSearchQuery("");
        }}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="pending_review" className="active-tab">
            Duyệt báo cáo ({pendingReviewReports.length})
          </TabsTrigger>
          <TabsTrigger value="assigned" className="active-tab">
            Đã phân công ({assignedReports.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending_review" className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Danh sách các report đã được bảo trì và đợi staff confirm hoàn thành hoặc từ chối để thực hiện lại
          </div>
          <DataTable
            data={paginatedData}
            columns={columns}
            keyExtractor={(row) => row.id}
            customActions={customActions}
            emptyMessage="Chưa có báo cáo nào chờ duyệt"
            // Sorting
            onSort={handleSort}
            // Filtering
            onFilter={handleFilter}
            // Pagination
            pagination={{
              page,
              pageSize,
              total: filteredAndSortedData.length,
              onPageChange: setPage,
              onPageSizeChange: setPageSize,
              pageSizeOptions: [5, 10, 20, 50],
            }}
            // Search
            searchable={true}
            searchPlaceholder="Tìm kiếm theo mã báo cáo, tên khách hàng, mã locker..."
            onSearch={handleSearch}
            // Quick Filters
            quickFilters={quickFilters}
            onQuickFilterChange={handleQuickFilterChange}
            onClearFilters={() => {
              setFilters([]);
              setSearchQuery("");
              setPage(1);
            }}
          />
        </TabsContent>

        <TabsContent value="assigned" className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Danh sách các yêu cầu từ phía khách hàng đã được phân công nhưng technical staff chưa thực hiện
          </div>
          <DataTable
            data={paginatedData}
            columns={columns}
            keyExtractor={(row) => row.id}
            customActions={customActions}
            emptyMessage="Chưa có báo cáo nào đã phân công"
            // Sorting
            onSort={handleSort}
            // Filtering
            onFilter={handleFilter}
            // Pagination
            pagination={{
              page,
              pageSize,
              total: filteredAndSortedData.length,
              onPageChange: setPage,
              onPageSizeChange: setPageSize,
              pageSizeOptions: [5, 10, 20, 50],
            }}
            // Search
            searchable={true}
            searchPlaceholder="Tìm kiếm theo mã báo cáo, tên khách hàng, mã locker..."
            onSearch={handleSearch}
            // Quick Filters
            quickFilters={quickFilters}
            onQuickFilterChange={handleQuickFilterChange}
            onClearFilters={() => {
              setFilters([]);
              setSearchQuery("");
              setPage(1);
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Dialog xác nhận duyệt */}
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
            <AlertDialogAction onClick={confirmApprove}>
              Duyệt
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog xác nhận từ chối */}
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
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Từ chối
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal chi tiết báo cáo */}
      {selectedReport && (
        <TechnicalStaffReportDetailModal
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          report={selectedReport}
          technicalStaffList={technicalStaff}
          onAssign={handleReassign}
        />
      )}
    </div>
  );
};

export default ManageTechnicalStaffReport;
