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
import type { CourierRequest } from "../features/courierRequest/types/courierRequest.types"

// Constants for Courier role mappings (update based on your actual data/constants)
const COURIER_ROLE = "courier"

const ManageCourierRequest = () => {
  const queryClient = useQueryClient()
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<CourierRequest | null>(null)

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
      role: COURIER_ROLE, // Only fetching users acting as couriers
      search: searchQuery || undefined,
      status: statusFilter,
      orderBy: sortConfig?.key,
      orderDirection: sortConfig?.direction === "asc" ? "ASC" : sortConfig?.direction === "desc" ? "DESC" : undefined
    })
  })

  // Map backend users to format expected by UI until CourierRequest components are refactored
  const requests: CourierRequest[] = useMemo(() => {
    if (!usersResponse?.data?.users) return [];
    return usersResponse.data.users.map((user: any) => ({
      id: user.keycloakUserId,
      name: user.fullName || "Unknown",
      email: user.email || "N/A",
      phone: user.phoneNumber || "N/A",
      address: user.address || "", // Assuming address might not be available
      // Map BE status to UI expectations (could be unified later)
      status: ["NONE", "PENDING", "APPROVED", "REJECTED", "SUSPENDED", "BLACKLISTED"].includes(user.status) 
              ? user.status 
              : "PENDING",
      requestDate: user.createdAt || new Date().toISOString(),
      documents: [], // Handle parsing real documents if needed
    }));
  }, [usersResponse]);

  const totalItemCount = usersResponse?.data?.pagination?.total || 0;

  // Cập nhật trạng thái
  const updateStatusMutation = useMutation({
    mutationFn: (params: { id: string, status: "NONE" | "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED" | "BLACKLISTED", reason?: string }) => 
      userService.updateCourierStatus(params.id, { status: params.status, reason: params.reason }),
    onSuccess: () => {
      toast.success("Cập nhật trạng thái thành công");
      queryClient.invalidateQueries({ queryKey: ["couriers"] });
      setIsApproveModalOpen(false);
      setIsRejectModalOpen(false);
      setSelectedRequest(null);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Cập nhật trạng thái thất bại");
    }
  });

  // Định nghĩa columns cho bảng
  const columns: Column<CourierRequest>[] = [
    {
      key: "name",
      header: "Họ và tên",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Tìm theo tên",
      accessor: (row) => (
        <div className="font-medium">{row.name}</div>
      ),
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Tìm theo email",
      accessor: (row) => (
        <div className="text-muted-foreground">{row.email}</div>
      ),
    },
    {
      key: "phone",
      header: "Số điện thoại",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Tìm theo số điện thoại",
      accessor: (row) => row.phone,
    },
    {
      key: "status",
      header: "Trạng thái",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: ["Chưa kích hoạt", "Chờ duyệt", "Đã duyệt", "Đã từ chối", "Đình chỉ", "Danh sách đen"],
      accessor: (row) => {
        const statusConfig: Record<NonNullable<CourierRequest["status"]>, { label: string; variant: "secondary" | "default" | "destructive" }> = {
          NONE: { label: "Chưa kích hoạt", variant: "secondary" },
          PENDING: { label: "Chờ duyệt", variant: "secondary" },
          APPROVED: { label: "Đã duyệt", variant: "default" },
          REJECTED: { label: "Đã từ chối", variant: "destructive" },
          SUSPENDED: { label: "Đình chỉ", variant: "destructive" },
          BLACKLISTED: { label: "Danh sách đen", variant: "destructive" },
        }
        const config = statusConfig[row.status] || { label: row.status, variant: "secondary" };
        return (
          <Badge variant={config.variant as any}>{config.label}</Badge>
        )
      },
    },
    {
      key: "requestDate",
      header: "Ngày yêu cầu",
      sortable: true,
      filterable: false,
      accessor: (row) => (
        <div className="text-sm text-muted-foreground">
          {row.requestDate ? new Date(row.requestDate).toLocaleDateString("vi-VN") : "-"}
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
              setSelectedRequest(row)
              setIsDetailModalOpen(true)
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {row.status === "PENDING" || row.status === "SUSPENDED" ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedRequest(row)
                  setIsApproveModalOpen(true)
                }}
                className="text-green-600 hover:text-green-700"
                title="Kích hoạt/Duyệt"
              >
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            </>
          ) : null}
          {row.status !== "REJECTED" && row.status !== "SUSPENDED" && row.status !== "BLACKLISTED" ? (
             <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedRequest(row)
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

  // Xử lý sorting
  const handleSort = (sort: SortConfig | null) => {
    setSortConfig(sort)
    setPage(1)
  }

  // Xử lý filtering
  const handleFilter = (newFilters: FilterConfig[]) => {
    setFilters(newFilters)
    setPage(1)
  }

  // Xử lý search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPage(1)
  }

  // Xử lý quick filter change
  const handleQuickFilterChange = () => {
    setPage(1)
  }

  // Định nghĩa quick filters
  const quickFilters: QuickFilter[] = [
    {
      key: "status",
      label: "Trạng thái",
      placeholder: "Chọn trạng thái",
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

  // Xử lý duyệt/từ chối
  const handleApprove = async (request: CourierRequest, action: "approve" | "reject", reason?: string) => {
    if (!request.id) return;
    const newStatus = action === "approve" ? "APPROVED" : (request.status === "APPROVED" ? "SUSPENDED" : "REJECTED");
    updateStatusMutation.mutate({ id: request.id, status: newStatus as any, reason });
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Duyệt người chuyển phát</h1>
        <p className="text-muted-foreground mt-2">
          Duyệt các yêu cầu đăng ký làm người chuyển phát trong hệ thống
        </p>
      </div>

      <DataTable
        data={requests}
        columns={columns}
        keyExtractor={(row) => row.id || row.email}
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

      {/* Modal chi tiết */}
      <CourierRequestDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        request={selectedRequest}
        onApprove={(request) => {
          setSelectedRequest(request)
          setIsDetailModalOpen(false)
          setIsApproveModalOpen(true)
        }}
        onReject={(request) => {
          setSelectedRequest(request)
          setIsDetailModalOpen(false)
          setIsRejectModalOpen(true)
        }}
      />

      {/* Modal duyệt */}
      <ApproveCourierRequestModal
        open={isApproveModalOpen}
        onOpenChange={setIsApproveModalOpen}
        request={selectedRequest}
        onSubmit={handleApprove}
        action="approve"
      />

      {/* Modal từ chối */}
      <ApproveCourierRequestModal
        open={isRejectModalOpen}
        onOpenChange={setIsRejectModalOpen}
        request={selectedRequest}
        onSubmit={handleApprove}
        action="reject"
      />
    </div>
  )
}

export default ManageCourierRequest