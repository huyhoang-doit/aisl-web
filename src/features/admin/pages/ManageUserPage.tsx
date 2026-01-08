import { useState, useMemo } from "react"
import { DataTable, type Column, type SortConfig, type FilterConfig, type QuickFilter } from "@/shared/components/DataTable"
import { CreateOrUpdateUserModal, type UserData } from "../modals/CreateOrUpdateUserModal"
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
const mockUsers: UserData[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "+84 123 456 789",
    role: roles.STAFF,
    status: "active",
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "tranthib@example.com",
    phone: "+84 987 654 321",
    role: roles.ADMIN,
    status: "active",
  },
  {
    id: "3",
    name: "Lê Văn C",
    email: "levanc@example.com",
    phone: "+84 555 123 456",
    role: roles.STAFF,
    status: "inactive",
  },
  {
    id: "4",
    name: "Phạm Thị D",
    email: "phamthid@example.com",
    phone: "+84 111 222 333",
    role: roles.STAFF,
    status: "locked",
  },
  {
    id: "5",
    name: "Hoàng Văn E",
    email: "hoangvane@example.com",
    phone: "+84 444 555 666",
    role: roles.ADMIN,
    status: "active",
  },
  {
    id: "6",
    name: "Vũ Thị F",
    email: "vuthif@example.com",
    phone: "+84 777 888 999",
    role: roles.STAFF,
    status: "active",
  },
]

const ManageUserPage = () => {
  const [users, setUsers] = useState<UserData[]>(mockUsers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [modalMode, setModalMode] = useState<"create" | "update">("create")

  // State cho các tính năng mới
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
  const [filters, setFilters] = useState<FilterConfig[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRows, setSelectedRows] = useState<UserData[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Định nghĩa columns cho bảng với các tính năng mới
  const columns: Column<UserData>[] = [
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
      key: "role",
      header: "Vai trò",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: ["Quản trị viên", "Nhân viên"],
      accessor: (row) => (
        <Badge
          variant={row.role === roles.ADMIN ? "default" : "secondary"}
        >
          {row.role === roles.ADMIN ? "Quản trị viên" : "Nhân viên"}
        </Badge>
      ),
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
    setPage(1) // Reset về trang đầu khi sort
  }

  // Xử lý filtering
  const handleFilter = (newFilters: FilterConfig[]) => {
    setFilters(newFilters)
    setPage(1) // Reset về trang đầu khi filter
  }

  // Xử lý search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPage(1) // Reset về trang đầu khi search
  }

  // Xử lý quick filter change
  const handleQuickFilterChange = () => {
    // Quick filter sẽ tự động cập nhật filters thông qua onFilter callback
    // Reset về trang đầu khi filter thay đổi
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
    let result = [...users]

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.phone.toLowerCase().includes(query)
      )
    }

    // Apply filters
    filters.forEach((filter) => {
      if (filter.key === "role") {
        const roleValue = filter.value === "Quản trị viên" ? roles.ADMIN : roles.STAFF
        result = result.filter((user) => user.role === roleValue)
      } else if (filter.key === "status") {
        const statusMap: Record<string, UserData["status"]> = {
          "Hoạt động": "active",
          "Không hoạt động": "inactive",
          "Đã khóa": "locked",
        }
        const statusValue = statusMap[filter.value]
        if (statusValue) {
          result = result.filter((user) => user.status === statusValue)
        }
      } else {
        const value = filter.value.toLowerCase()
        result = result.filter((user) => {
          const fieldValue = String(user[filter.key as keyof UserData] || "").toLowerCase()
          return fieldValue.includes(value)
        })
      }
    })

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof UserData]
        const bValue = b[sortConfig.key as keyof UserData]

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
  }, [users, searchQuery, filters, sortConfig])

  // Pagination
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return filteredAndSortedData.slice(start, end)
  }, [filteredAndSortedData, page, pageSize])

  // Total pages calculated in Pagination component

  // Xử lý tạo mới
  const handleCreate = () => {
    setSelectedUser(null)
    setModalMode("create")
    setIsModalOpen(true)
  }

  // Xử lý chỉnh sửa
  const handleEdit = (user: UserData) => {
    setSelectedUser(user)
    setModalMode("update")
    setIsModalOpen(true)
  }

  // Xử lý xóa
  const handleDelete = (user: UserData) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  // Xác nhận xóa
  const confirmDelete = () => {
    if (selectedUser?.id) {
      setUsers(users.filter((u) => u.id !== selectedUser.id))
      setIsDeleteDialogOpen(false)
      setSelectedUser(null)
      // Remove from selected rows if selected
      setSelectedRows(selectedRows.filter((r) => r.id !== selectedUser.id))
    }
  }

  // Xóa nhiều
  const handleDeleteSelected = () => {
    if (selectedRows.length > 0) {
      const idsToDelete = selectedRows.map((r) => r.id)
      setUsers(users.filter((u) => !idsToDelete.includes(u.id)))
      setSelectedRows([])
    }
  }

  // Xử lý submit form
  const handleSubmit = async (data: UserData) => {
    if (modalMode === "create") {
      // Tạo user mới
      const newUser: UserData = {
        ...data,
        id: Date.now().toString(), // Thay bằng ID từ API
      }
      setUsers([...users, newUser])
      // TODO: Gọi API để tạo user
      console.log("Creating user:", newUser)
    } else {
      // Cập nhật user
      setUsers(
        users.map((u) => (u.id === selectedUser?.id ? { ...data, id: u.id } : u))
      )
      // TODO: Gọi API để cập nhật user
      console.log("Updating user:", data)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản lý người dùng</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý thông tin và quyền truy cập của người dùng trong hệ thống
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
        emptyMessage="Chưa có người dùng nào"
        // className="bg-card"
        // Sorting
        // sortable={true}
        // defaultSort={{ key: "name", direction: "asc" }}
        onSort={handleSort}
        // Filtering
        // filterable={true}
        onFilter={handleFilter}
        // Pagination
        pagination={{
          page,
          pageSize,
          total: filteredAndSortedData.length,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
          pageSizeOptions: [5, 10, 20, 50, 100],
        }}
        // Selection
        // selectable={true}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        // Search
        searchable={true}
        searchPlaceholder="Tìm kiếm theo tên, email, số điện thoại..."
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

      {/* Modal tạo/cập nhật */}
      <CreateOrUpdateUserModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        userData={selectedUser}
        onSubmit={handleSubmit}
        mode={modalMode}
      />

      {/* Dialog xác nhận xóa */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa người dùng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa người dùng{" "}
              <strong>{selectedUser?.name}</strong>? Hành động này không thể hoàn tác.
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

export default ManageUserPage
