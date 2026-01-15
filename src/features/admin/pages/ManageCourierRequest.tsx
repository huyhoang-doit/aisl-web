import { useState, useMemo } from "react"
import { DataTable, type Column, type SortConfig, type FilterConfig, type QuickFilter } from "@/shared/components/DataTable"
import { CourierRequestDetailModal } from "../features/courierRequest/components/CourierRequestDetailModal"
import { ApproveCourierRequestModal } from "../features/courierRequest/components/ApproveCourierRequestModal"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { CheckCircle2, XCircle, Eye } from "lucide-react"
import type { CourierRequest } from "../features/courierRequest/types/courierRequest.types"

// Mock data - Thay thế bằng API call thực tế
const mockCourierRequests: CourierRequest[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "+84 123 456 789",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    status: "pending",
    requestDate: new Date().toISOString(),
    documents: ["CMND.pdf", "Bằng lái xe.pdf"],
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "tranthib@example.com",
    phone: "+84 987 654 321",
    address: "456 Đường XYZ, Quận 2, TP.HCM",
    status: "approved",
    requestDate: new Date(Date.now() - 86400000).toISOString(),
    reviewedDate: new Date().toISOString(),
    reviewedBy: "Admin User",
    documents: ["CMND.pdf"],
  },
  {
    id: "3",
    name: "Lê Văn C",
    email: "levanc@example.com",
    phone: "+84 555 123 456",
    address: "789 Đường DEF, Quận 3, TP.HCM",
    status: "rejected",
    requestDate: new Date(Date.now() - 172800000).toISOString(),
    reviewedDate: new Date(Date.now() - 86400000).toISOString(),
    reviewedBy: "Admin User",
    rejectionReason: "Thiếu giấy tờ cần thiết",
    documents: ["CMND.pdf"],
  },
]

const ManageCourierRequest = () => {
  const [requests, setRequests] = useState<CourierRequest[]>(mockCourierRequests)
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
      filterOptions: ["Chờ duyệt", "Đã duyệt", "Đã từ chối"],
      accessor: (row) => {
        const statusConfig = {
          pending: { label: "Chờ duyệt", variant: "secondary" as const },
          approved: { label: "Đã duyệt", variant: "default" as const },
          rejected: { label: "Đã từ chối", variant: "destructive" as const },
        }
        const config = statusConfig[row.status]
        return (
          <Badge variant={config.variant}>{config.label}</Badge>
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
          {row.status === "pending" && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedRequest(row)
                  setIsApproveModalOpen(true)
                }}
                className="text-green-600 hover:text-green-700"
              >
                <CheckCircle2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedRequest(row)
                  setIsRejectModalOpen(true)
                }}
                className="text-red-600 hover:text-red-700"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
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
        { value: "Chờ duyệt", label: "Chờ duyệt" },
        { value: "Đã duyệt", label: "Đã duyệt" },
        { value: "Đã từ chối", label: "Đã từ chối" },
      ],
    },
  ]

  // Filter và sort data
  const filteredAndSortedData = useMemo(() => {
    let result = [...requests]

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (request) =>
          request.name.toLowerCase().includes(query) ||
          request.email.toLowerCase().includes(query) ||
          request.phone.toLowerCase().includes(query) ||
          request.address?.toLowerCase().includes(query)
      )
    }

    // Apply filters
    filters.forEach((filter) => {
      if (filter.key === "status") {
        const statusMap: Record<string, CourierRequest["status"]> = {
          "Chờ duyệt": "pending",
          "Đã duyệt": "approved",
          "Đã từ chối": "rejected",
        }
        const statusValue = statusMap[filter.value]
        if (statusValue) {
          result = result.filter((request) => request.status === statusValue)
        }
      } else {
        const value = filter.value.toLowerCase()
        result = result.filter((request) => {
          const fieldValue = String(request[filter.key as keyof CourierRequest] || "").toLowerCase()
          return fieldValue.includes(value)
        })
      }
    })

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof CourierRequest]
        const bValue = b[sortConfig.key as keyof CourierRequest]

        if (aValue === undefined || aValue === null) return 1
        if (bValue === undefined || bValue === null) return -1

        const comparison =
          typeof aValue === "string" && typeof bValue === "string"
            ? aValue.localeCompare(bValue)
            : aValue < bValue
            ? -1
            : aValue > bValue
            ? 1
            : 0

        return sortConfig.direction === "asc" ? comparison : -comparison
      })
    }

    return result
  }, [requests, searchQuery, filters, sortConfig])

  // Pagination
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return filteredAndSortedData.slice(start, end)
  }, [filteredAndSortedData, page, pageSize])

  // Xử lý duyệt/từ chối
  const handleApprove = async (request: CourierRequest, action: "approve" | "reject", reason?: string) => {
    const updatedRequest: CourierRequest = {
      ...request,
      status: action === "approve" ? "approved" : "rejected",
      reviewedDate: new Date().toISOString(),
      reviewedBy: "Admin User", // Thay bằng user thực tế
      rejectionReason: reason,
    }
    setRequests(requests.map((r) => (r.id === request.id ? updatedRequest : r)))
    setIsApproveModalOpen(false)
    setIsRejectModalOpen(false)
    setSelectedRequest(null)
    console.log(`${action === "approve" ? "Approving" : "Rejecting"} request:`, updatedRequest)
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
        data={paginatedData}
        columns={columns}
        keyExtractor={(row) => row.id || row.email}
        onCreate={undefined}
        emptyMessage="Chưa có yêu cầu nào"
        onSort={handleSort}
        onFilter={handleFilter}
        pagination={{
          page,
          pageSize,
          total: filteredAndSortedData.length,
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