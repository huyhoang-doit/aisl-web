import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DataTable, type Column, type SortConfig, type FilterConfig, type QuickFilter } from "@/shared/components/DataTable"
import { CourierRequestDetailModal } from "../features/courierRequest/components/CourierRequestDetailModal"
import { ApproveCourierRequestModal } from "../features/courierRequest/components/ApproveCourierRequestModal"
import { userService } from "../features/user/services/user.service"
import { toast } from "sonner"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { CheckCircle2, XCircle, Eye } from "lucide-react"
import type { CourierApplication } from "../features/courierRequest/types/courierRequest.types"

// Constants for Courier role mappings (update based on your actual data/constants)
const COURIER_ROLE = "courier"

const ManageCourierRequest = () => {
  const queryClient = useQueryClient()
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<CourierApplication | null>(null)

  // State cho các tính năng mới
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
  const [filters, setFilters] = useState<FilterConfig[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Extract status filter for backend filtering (assuming status is sent as a filter)
  const statusFilter = useMemo(() => {
    const statusF = filters.find(f => f.key === "status");
    if(!statusF) return undefined;
    const map: Record<string, string> = {
      "Chưa kích hoạt": "NONE",
      "Chờ duyệt": "PENDING",
      "Đã duyệt": "APPROVED",
      "Đã từ chối": "REJECTED",
      "Đình chỉ": "SUSPENDED",
      "Danh sách đen": "BLACKLISTED"
    }
    return map[statusF.value]
  }, [filters]);

  // Use real API call via react-query
  const { data: usersResponse, isLoading } = useQuery({
    queryKey: ["couriers", page, pageSize, searchQuery, statusFilter, sortConfig],
    queryFn: () => userService.getAll({
      page,
      limit: pageSize,
      roles: [COURIER_ROLE], // Only fetching users acting as couriers
      search: searchQuery || undefined,
      status: statusFilter,
      orderBy: sortConfig?.key,
      orderDirection: sortConfig?.direction === "asc" ? "ASC" : sortConfig?.direction === "desc" ? "DESC" : undefined
    })
  })

  // Map backend users to format expected by UI until CourierRequest components are refactored
  const requests: CourierApplication[] = useMemo(() => {
    const users = (usersResponse?.data as any)?.users || [];
    return users.map((user: any) => ({
      id: user.id || user.keycloakUserId,
      userId: user.id,
      legalName: user.fullName || "Unknown",
      email: user.email || "N/A",
      phone: user.phoneNumber || "N/A",
      licensePlate: user.licensePlate || "N/A",
      vehicleType: user.vehicleType || "BIKE",
      frontVehicleImageUrl: user.frontVehicleImageUrl || "",
      backVehicleImageUrl: user.backVehicleImageUrl || "",
      portraitUrl: user.portraitUrl || "",
      status: ["NONE", "PENDING", "APPROVED", "REJECTED", "SUSPENDED", "BLACKLISTED"].includes(user.status) 
              ? user.status 
              : "PENDING",
      reviewedById: user.reviewedById || "",
      reviewNote: user.reviewNote || "",
      reviewedAt: user.reviewedAt || "",
      rejectionCount: user.rejectionCount || 0,
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: user.updatedAt || new Date().toISOString(),
    } as CourierApplication));
  }, [usersResponse]);

  const totalItemCount = usersResponse?.data?.pagination?.total || 0;

  // Cập nhật trạng thái
  const updateStatusMutation = useMutation({
    mutationFn: (params: { id: string, status: string, reason?: string }) => 
      userService.updateCourierStatus(params.id, { status: params.status as any, reason: params.reason }),
    onSuccess: () => {
      toast.success("Cập nhật trạng thái thành công");
      queryClient.invalidateQueries({ queryKey: ["couriers"] });
      setIsApproveModalOpen(false);
      setIsRejectModalOpen(false);
      setSelectedApplication(null);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Cập nhật trạng thái thất bại");
    }
  });

  // Định nghĩa columns cho bảng
  const columns: Column<CourierApplication>[] = [
    {
      key: "legalName",
      header: "Họ và tên",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Tìm theo tên",
      accessor: (row) => (
        <div className="font-medium">{row.legalName || "—"}</div>
      ),
    },
    {
      key: "licensePlate",
      header: "Biển số xe",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Tìm theo biển số",
      accessor: (row) => (
        <div className="font-mono text-sm">{row.licensePlate || "—"}</div>
      ),
    },
    {
      key: "vehicleType",
      header: "Loại xe",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: ["Chưa kích hoạt", "Chờ duyệt", "Đã duyệt", "Đã từ chối", "Đình chỉ", "Danh sách đen"],
      accessor: (row) => {
        const statusConfig: Record<string, { label: string; variant: "secondary" | "default" | "destructive" }> = {
          NONE: { label: "Chưa kích hoạt", variant: "secondary" },
          PENDING: { label: "Chờ duyệt", variant: "secondary" },
          APPROVED: { label: "Đã duyệt", variant: "default" },
          REJECTED: { label: "Đã từ chối", variant: "destructive" },
          SUSPENDED: { label: "Đình chỉ", variant: "destructive" },
          BLACKLISTED: { label: "Danh sách đen", variant: "destructive" },
        }
        const status = row.status;
        const config = statusConfig[status] || { label: status, variant: "secondary" };
        return (
          <Badge variant={config.variant as any}>{config.label}</Badge>
        )
      },
    },
    {
      key: "createdAt",
      header: "Ngày tạo",
      sortable: true,
      filterable: false,
      accessor: (row) => (
        <div className="text-sm text-muted-foreground">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString("vi-VN") : "—"}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Thao tác",
      sortable: false,
      filterable: false,
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedApplication(row)
              setIsDetailModalOpen(true)
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {row.status === "PENDING" ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedApplication(row)
                  setIsApproveModalOpen(true)
                }}
                className="text-green-600 hover:text-green-700"
                title="Kích hoạt/Duyệt"
              >
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            </>
          ) : null}
          {row.status !== "REJECTED" ? (
             <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedApplication(row)
                  setIsRejectModalOpen(true)
                }}
                className="text-red-600 hover:text-red-700"
                title="Từ chối/Đình chỉ"
              >
                <XCircle className="h-4 w-4" />
              </Button>
          ) : null}
        </div>
      ),
    },
  ]

  const handleSort = (_sort: SortConfig | null) => {
    setSortConfig(_sort)
    setPage(1)
  }

  const handleApproveSubmit = async (
    application: CourierApplication,
    _action: "approve" | "reject",
    reviewNote: string
  ) => {
    const newStatus = _action === "approve" ? "APPROVED" : "REJECTED";
    updateStatusMutation.mutate({ id: application.id, status: newStatus, reason: reviewNote })
  }

  const handleFilter = (_filters: FilterConfig[]) => {
    setFilters(_filters)
    setPage(1)
  }

  const handleSearch = (_search: string) => {
    setSearchQuery(_search)
    setPage(1)
  }

  const handleQuickFilterChange = () => {
    setPage(1)
  }

  const quickFilters: QuickFilter[] = [
    {
      key: "sortOrder",
      label: "Sắp xếp",
      placeholder: "Sắp xếp",
      hideAllOption: true,
      defaultValue: "Mới nhất",
      options: [
        { value: "Chưa kích hoạt", label: "Chưa kích hoạt" },
        { value: "Chờ duyệt", label: "Chờ duyệt" },
        { value: "Đã duyệt", label: "Đã duyệt" },
        { value: "Đã từ chối", label: "Đã từ chối" },
        { value: "Đình chỉ", label: "Đình chỉ" },
        { value: "Danh sách đen", label: "Danh sách đen" },
      ],
    },
  ]

  // We don't apply frontend-side filtering/sorting/pagination anymore, 
  // since React-Query and parameter passing handle that with the backend.
  // Using `requests` and `isLoading` below.

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Duyệt người chuyển phát</h1>
        <p className="text-muted-foreground mt-2">
          Duyệt các đơn đăng ký làm người chuyển phát trong hệ thống
        </p>
      </div>

      <DataTable
        data={requests}
        columns={columns}
        keyExtractor={(row) => row.id || row.userId}
        onCreate={undefined}
        emptyMessage={isLoading ? "Đang tải dữ liệu..." : "Chưa có yêu cầu nào"}
        onSort={handleSort}
        onFilter={handleFilter}
        pagination={{
          page,
          pageSize,
          total: totalItemCount,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
          pageSizeOptions: [5, 10, 20, 50, 100],
        }}
        searchable={true}
        searchPlaceholder="Tìm kiếm theo tên, email, số điện thoại..."
        onSearch={handleSearch}
        quickFilters={quickFilters}
        onQuickFilterChange={handleQuickFilterChange}
        onClearFilters={() => {
          setFilters([])
          setSearchQuery("")
          setPage(1)
        }}
      />

      <CourierRequestDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        application={selectedApplication}
        onApprove={(app) => {
          setSelectedApplication(app)
          setIsDetailModalOpen(false)
          setIsApproveModalOpen(true)
        }}
        onReject={(app) => {
          setSelectedApplication(app)
          setIsDetailModalOpen(false)
          setIsRejectModalOpen(true)
        }}
      />

      <ApproveCourierRequestModal
        open={isApproveModalOpen}
        onOpenChange={setIsApproveModalOpen}
        application={selectedApplication}
        onSubmit={handleApproveSubmit}
        action="approve"
      />

      <ApproveCourierRequestModal
        open={isRejectModalOpen}
        onOpenChange={setIsRejectModalOpen}
        application={selectedApplication}
        onSubmit={handleApproveSubmit}
        action="reject"
      />
    </div>
  )
}

export default ManageCourierRequest
