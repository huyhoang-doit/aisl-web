import { useState, useMemo } from "react"
import { DataTable, type Column, type SortConfig, type FilterConfig, type QuickFilter } from "@/shared/components/DataTable"
import { CreateOrUpdateStaffModal, type StaffData } from "../features/staff/components/CreateOrUpdateStaffModal"
import { Badge } from "@/shared/components/ui/badge"
import { roles } from "@/shared/configs/role"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog"

// Mock data - Thay thế bằng API call thực tế
const mockStaffs: StaffData[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "+84 123 456 789",
    role: roles.STAFF,
    status: "active",
    department: "Vận hành",
    position: "Nhân viên vận hành",
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "tranthib@example.com",
    phone: "+84 987 654 321",
    role: roles.STAFF,
    status: "active",
    department: "Hỗ trợ",
    position: "Nhân viên hỗ trợ",
  },
  {
    id: "3",
    name: "Lê Văn C",
    email: "levanc@example.com",
    phone: "+84 555 123 456",
    role: roles.STAFF,
    status: "inactive",
    department: "Bảo trì",
    position: "Kỹ thuật viên",
  },
  {
    id: "4",
    name: "Phạm Thị D",
    email: "phamthid@example.com",
    phone: "+84 111 222 333",
    role: roles.STAFF,
    status: "locked",
    department: "Vận hành",
    position: "Nhân viên vận hành",
  },
]

const ManageStaffPage = () => {
  const [staffs, setStaffs] = useState<StaffData[]>(mockStaffs)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<StaffData | null>(null)
  const [modalMode, setModalMode] = useState<"create" | "update">("create")

  // State cho các tính năng mới
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
  const [filters, setFilters] = useState<FilterConfig[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRows, setSelectedRows] = useState<StaffData[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Định nghĩa columns cho bảng
  const columns: Column<StaffData>[] = [
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
      key: "department",
      header: "Phòng ban",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Tìm theo phòng ban",
      accessor: (row) => row.department || "-",
    },
    {
      key: "position",
      header: "Chức vụ",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Tìm theo chức vụ",
      accessor: (row) => row.position || "-",
    },
    {
      key: "status",
      header: "Trạng thái",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: ["Hoạt động", "Không hoạt động", "Đã khóa"],
      accessor: (row) => {
        const statusConfig = {
          active: { label: "Hoạt động", variant: "default" as const },
          inactive: { label: "Không hoạt động", variant: "secondary" as const },
          locked: { label: "Đã khóa", variant: "destructive" as const },
        }
        const config = statusConfig[row.status || "active"]
        return (
          <Badge variant={config.variant}>{config.label}</Badge>
        )
      },
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
        { value: "Hoạt động", label: "Hoạt động" },
        { value: "Không hoạt động", label: "Không hoạt động" },
        { value: "Đã khóa", label: "Đã khóa" },
      ],
    },
  ]

  // Filter và sort data
  const filteredAndSortedData = useMemo(() => {
    let result = [...staffs]

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (staff) =>
          staff.name.toLowerCase().includes(query) ||
          staff.email.toLowerCase().includes(query) ||
          staff.phone.toLowerCase().includes(query) ||
          staff.department?.toLowerCase().includes(query) ||
          staff.position?.toLowerCase().includes(query)
      )
    }

    // Apply filters
    filters.forEach((filter) => {
      if (filter.key === "status") {
        const statusMap: Record<string, StaffData["status"]> = {
          "Hoạt động": "active",
          "Không hoạt động": "inactive",
          "Đã khóa": "locked",
        }
        const statusValue = statusMap[filter.value]
        if (statusValue) {
          result = result.filter((staff) => staff.status === statusValue)
        }
      } else {
        const value = filter.value.toLowerCase()
        result = result.filter((staff) => {
          const fieldValue = String(staff[filter.key as keyof StaffData] || "").toLowerCase()
          return fieldValue.includes(value)
        })
      }
    })

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof StaffData]
        const bValue = b[sortConfig.key as keyof StaffData]

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
  }, [staffs, searchQuery, filters, sortConfig])

  // Pagination
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return filteredAndSortedData.slice(start, end)
  }, [filteredAndSortedData, page, pageSize])

  // Xử lý tạo mới
  const handleCreate = () => {
    setSelectedStaff(null)
    setModalMode("create")
    setIsModalOpen(true)
  }

  // Xử lý chỉnh sửa
  const handleEdit = (staff: StaffData) => {
    setSelectedStaff(staff)
    setModalMode("update")
    setIsModalOpen(true)
  }

  // Xử lý xóa
  const handleDelete = (staff: StaffData) => {
    setSelectedStaff(staff)
    setIsDeleteDialogOpen(true)
  }

  // Xác nhận xóa
  const confirmDelete = () => {
    if (selectedStaff?.id) {
      setStaffs(staffs.filter((s) => s.id !== selectedStaff.id))
      setIsDeleteDialogOpen(false)
      setSelectedStaff(null)
      setSelectedRows(selectedRows.filter((r) => r.id !== selectedStaff.id))
    }
  }

  // Xóa nhiều
  const handleDeleteSelected = () => {
    if (selectedRows.length > 0) {
      const idsToDelete = selectedRows.map((r) => r.id)
      setStaffs(staffs.filter((s) => !idsToDelete.includes(s.id)))
      setSelectedRows([])
    }
  }

  // Xử lý submit form
  const handleSubmit = async (data: StaffData) => {
    if (modalMode === "create") {
      const newStaff: StaffData = {
        ...data,
        id: Date.now().toString(),
      }
      setStaffs([...staffs, newStaff])
      console.log("Creating staff:", newStaff)
    } else {
      setStaffs(
        staffs.map((s) => (s.id === selectedStaff?.id ? { ...data, id: s.id } : s))
      )
      console.log("Updating staff:", data)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản lý nhân viên</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý thông tin và quyền truy cập của nhân viên trong hệ thống
        </p>
      </div>

      {/* Action bar cho selected rows */}
      {selectedRows.length > 0 && (
        <div className="flex items-center justify-between rounded-md border border-border bg-card p-4">
          <div className="text-sm text-muted-foreground">
            Đã chọn <strong>{selectedRows.length}</strong> mục
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDeleteSelected}
              className="text-sm text-destructive hover:underline"
            >
              Xóa đã chọn
            </button>
          </div>
        </div>
      )}

      <DataTable
        data={paginatedData}
        columns={columns}
        keyExtractor={(row) => row.id || row.email}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        emptyMessage="Chưa có nhân viên nào"
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
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        searchable={true}
        searchPlaceholder="Tìm kiếm theo tên, email, số điện thoại, phòng ban..."
        onSearch={handleSearch}
        quickFilters={quickFilters}
        onQuickFilterChange={handleQuickFilterChange}
        onClearFilters={() => {
          setFilters([])
          setSearchQuery("")
          setPage(1)
        }}
      />

      {/* Modal tạo/cập nhật */}
      <CreateOrUpdateStaffModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        staffData={selectedStaff}
        onSubmit={handleSubmit}
        mode={modalMode}
      />

      {/* Dialog xác nhận xóa */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa nhân viên</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa nhân viên{" "}
              <strong>{selectedStaff?.name}</strong>? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default ManageStaffPage