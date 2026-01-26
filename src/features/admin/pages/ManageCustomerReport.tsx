import { useState, useMemo } from "react";
import { DataTable, type Column, type SortConfig, type FilterConfig, type QuickFilter } from "@/shared/components/DataTable";
import { Badge } from "@/shared/components/ui/badge";
import { Eye, UserCheck } from "lucide-react";
import CustomerReportDetailModal from "../features/customerReport/modals/CustomerReportDetailModal";
import AssignTechnicalStaffModal from "../features/customerReport/modals/AssignTechnicalStaffModal";
import type { CustomerReport } from "../features/customerReport/types/customerReport.types";
import type { Staff } from "@/features/admin/features/staff/types/staff.types";

// Mock data - Thay thế bằng API call thực tế
const mockCustomerReports: CustomerReport[] = [
  {
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
    status: "pending",
    reportedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
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
    status: "assigned",
    assignedTo: "staff-1",
    assignedToName: "Lê Văn Kỹ Thuật",
    assignedAt: new Date(Date.now() - 86400000).toISOString(),
    reportedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
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
    assignedTo: "staff-2",
    assignedToName: "Phạm Văn Kỹ Thuật",
    assignedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    reportedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
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
    status: "completed",
    assignedTo: "staff-1",
    assignedToName: "Lê Văn Kỹ Thuật",
    assignedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    reportedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
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

const ManageCustomerReport = () => {
  const [customerReports, setCustomerReports] = useState<CustomerReport[]>(mockCustomerReports);
  const [technicalStaff] = useState<Staff[]>(mockTechnicalStaff);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<CustomerReport | null>(null);

  // State cho các tính năng
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Định nghĩa columns cho bảng
  const columns: Column<CustomerReport>[] = [
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
          <div className="font-medium">{row.customerName}</div>
          <div className="text-sm text-muted-foreground">{row.customerEmail}</div>
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
          <div className="font-medium">{row.lockerCode}</div>
          {row.cabinetCode && (
            <div className="text-sm text-muted-foreground">Cabinet: {row.cabinetCode}</div>
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
        const config = issueConfig[row.issueType];
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
        const config = priorityConfig[row.priority];
        return <Badge variant={config.variant}>{config.label}</Badge>;
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
        const statusConfig = {
          pending: { label: "Chờ xử lý", variant: "secondary" as const },
          assigned: { label: "Đã phân công", variant: "default" as const },
          in_progress: { label: "Đang xử lý", variant: "default" as const },
          completed: { label: "Hoàn thành", variant: "default" as const },
          rejected: { label: "Từ chối", variant: "destructive" as const },
        };
        const config = statusConfig[row.status];
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      key: "assignedToName",
      header: "Nhân viên kỹ thuật",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Tìm theo tên",
      accessor: (row) => (
        <div className="text-muted-foreground">
          {row.assignedToName || "Chưa phân công"}
        </div>
      ),
    },
    {
      key: "reportedAt",
      header: "Ngày báo cáo",
      sortable: true,
      filterable: true,
      filterType: "date",
      accessor: (row) => (
        <div className="text-sm text-muted-foreground">
          {new Date(row.reportedAt).toLocaleDateString("vi-VN")}
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
    let result = [...customerReports];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (report) =>
          report.reportCode.toLowerCase().includes(query) ||
          report.customerName.toLowerCase().includes(query) ||
          report.customerEmail.toLowerCase().includes(query) ||
          report.lockerCode.toLowerCase().includes(query)
      );
    }

    // Apply filters
    filters.forEach((filter) => {
      if (filter.key === "status") {
        const statusMap: Record<string, CustomerReport["status"]> = {
          "Chờ xử lý": "pending",
          "Đã phân công": "assigned",
          "Đang xử lý": "in_progress",
          "Hoàn thành": "completed",
          "Từ chối": "rejected",
        };
        const statusValue = statusMap[filter.value];
        if (statusValue) {
          result = result.filter((report) => report.status === statusValue);
        }
      } else if (filter.key === "priority") {
        const priorityMap: Record<string, CustomerReport["priority"]> = {
          "Thấp": "low",
          "Trung bình": "medium",
          "Cao": "high",
          "Khẩn cấp": "urgent",
        };
        const priorityValue = priorityMap[filter.value];
        if (priorityValue) {
          result = result.filter((report) => report.priority === priorityValue);
        }
      } else if (filter.key === "issueType") {
        const issueMap: Record<string, CustomerReport["issueType"]> = {
          "Hỏng": "broken",
          "Kẹt": "stuck",
          "Không mở được": "cannot_open",
          "Khác": "other",
        };
        const issueValue = issueMap[filter.value];
        if (issueValue) {
          result = result.filter((report) => report.issueType === issueValue);
        }
      } else {
        const value = filter.value.toLowerCase();
        result = result.filter((report) => {
          const fieldValue = String(report[filter.key as keyof CustomerReport] || "").toLowerCase();
          return fieldValue.includes(value);
        });
      }
    });

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof CustomerReport];
        const bValue = b[sortConfig.key as keyof CustomerReport];

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
  }, [customerReports, searchQuery, filters, sortConfig]);

  // Pagination
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredAndSortedData.slice(start, end);
  }, [filteredAndSortedData, page, pageSize]);

  // Xử lý xem chi tiết
  const handleViewDetails = (report: CustomerReport) => {
    setSelectedReport(report);
    setIsDetailModalOpen(true);
  };

  // Xử lý phân công
  const handleAssign = (report: CustomerReport) => {
    setSelectedReport(report);
    setIsDetailModalOpen(false);
    setIsAssignModalOpen(true);
  };

  // Xử lý submit phân công
  const handleAssignSubmit = async (reportId: string, staffId: string) => {
    const staff = technicalStaff.find((s) => s.id === staffId);
    if (!staff) return;

    // TODO: Gọi API để phân công
    setCustomerReports(
      customerReports.map((report) =>
        report.id === reportId
          ? {
              ...report,
              assignedTo: staffId,
              assignedToName: staff.name,
              assignedAt: new Date().toISOString(),
              status: "assigned" as const,
              updatedAt: new Date().toISOString(),
            }
          : report
      )
    );

    setIsAssignModalOpen(false);
    setSelectedReport(null);
    console.log("Assigning report:", reportId, "to staff:", staffId);
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
    setSelectedReport(null);
  };

  const handleAssignModalClose = () => {
    setIsAssignModalOpen(false);
    setSelectedReport(null);
  };

  // Custom actions for table
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
        if (!report.assignedTo) {
          handleAssign(report);
        }
      },
      variant: "ghost" as const,
      className: "text-primary hover:text-primary hover:bg-primary/10",
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản lý báo cáo từ khách hàng</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý và phân công xử lý các báo cáo từ phía khách hàng
        </p>
      </div>

      <DataTable
        data={paginatedData}
        columns={columns}
        keyExtractor={(row) => row.id}
        customActions={customActions}
        emptyMessage="Chưa có báo cáo nào"
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

      {/* Modal chi tiết */}
      {selectedReport && (
        <CustomerReportDetailModal
          open={isDetailModalOpen}
          onOpenChange={handleDetailModalClose}
          report={selectedReport}
          onAssign={handleAssign}
        />
      )}

      {/* Modal phân công */}
      {selectedReport && (
        <AssignTechnicalStaffModal
          open={isAssignModalOpen}
          onOpenChange={handleAssignModalClose}
          report={selectedReport}
          technicalStaffList={technicalStaff}
          onSubmit={handleAssignSubmit}
        />
      )}
    </div>
  );
};

export default ManageCustomerReport;
