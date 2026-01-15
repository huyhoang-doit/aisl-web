import { useState, useMemo } from "react"
import { DataTable, type Column, type SortConfig, type FilterConfig, type QuickFilter } from "@/shared/components/DataTable"
import { LockedAccountDetailModal } from "../features/lockedAccount/components/LockedAccountDetailModal"
import { UnlockAccountModal } from "../features/lockedAccount/components/UnlockAccountModal"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Lock, Unlock, Eye } from "lucide-react"
import type { LockedAccount } from "../features/lockedAccount/types/lockedAccount.types"
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
const mockLockedAccounts: LockedAccount[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "+84 123 456 789",
    role: "staff",
    lockedAt: new Date(Date.now() - 86400000).toISOString(),
    lockedReason: "Vi phạm quy định sử dụng hệ thống",
    lockedBy: "Admin User",
    unlockRequested: false,
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "tranthib@example.com",
    phone: "+84 987 654 321",
    role: "staff",
    lockedAt: new Date(Date.now() - 172800000).toISOString(),
    lockedReason: "Nghi ngờ hoạt động bất thường",
    lockedBy: "Admin User",
    unlockRequested: true,
    unlockRequestDate: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Lê Văn C",
    email: "levanc@example.com",
    phone: "+84 555 123 456",
    role: "admin",
    lockedAt: new Date(Date.now() - 259200000).toISOString(),
    lockedReason: "Yêu cầu từ quản lý",
    lockedBy: "Super Admin",
    unlockRequested: false,
  },
]

const ManageLockedAccountsPage = () => {
  const [accounts, setAccounts] = useState<LockedAccount[]>(mockLockedAccounts)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<LockedAccount | null>(null)

  // State cho các tính năng mới
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
  const [filters, setFilters] = useState<FilterConfig[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Định nghĩa columns cho bảng
  const columns: Column<LockedAccount>[] = [
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
        <Badge variant={row.role === "admin" ? "default" : "secondary"}>
          {row.role === "admin" ? "Quản trị viên" : "Nhân viên"}
        </Badge>
      ),
    },
    {
      key: "lockedAt",
      header: "Ngày khóa",
      sortable: true,
      filterable: false,
      accessor: (row) => (
        <div className="text-sm text-muted-foreground">
          {row.lockedAt ? new Date(row.lockedAt).toLocaleDateString("vi-VN") : "-"}
        </div>
      ),
    },
    {
      key: "unlockRequested",
      header: "Yêu cầu mở khóa",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: ["Có", "Không"],
      accessor: (row) => (
        <Badge variant={row.unlockRequested ? "default" : "secondary"}>
          {row.unlockRequested ? "Có" : "Không"}
        </Badge>
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
              setSelectedAccount(row)
              setIsDetailModalOpen(true)
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedAccount(row)
              setIsUnlockModalOpen(true)
            }}
            className="text-green-600 hover:text-green-700"
          >
            <Unlock className="h-4 w-4" />
          </Button>
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
      key: "unlockRequested",
      label: "Yêu cầu mở khóa",
      placeholder: "Chọn trạng thái",
      options: [
        { value: "Có", label: "Có yêu cầu" },
        { value: "Không", label: "Không có yêu cầu" },
      ],
    },
  ]

  // Filter và sort data
  const filteredAndSortedData = useMemo(() => {
    let result = [...accounts]

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (account) =>
          account.name.toLowerCase().includes(query) ||
          account.email.toLowerCase().includes(query) ||
          account.phone.toLowerCase().includes(query)
      )
    }

    // Apply filters
    filters.forEach((filter) => {
      if (filter.key === "role") {
        const roleValue = filter.value === "Quản trị viên" ? "admin" : "staff"
        result = result.filter((account) => account.role === roleValue)
      } else if (filter.key === "unlockRequested") {
        const hasRequest = filter.value === "Có"
        result = result.filter((account) => account.unlockRequested === hasRequest)
      } else {
        const value = filter.value.toLowerCase()
        result = result.filter((account) => {
          const fieldValue = String(account[filter.key as keyof LockedAccount] || "").toLowerCase()
          return fieldValue.includes(value)
        })
      }
    })

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof LockedAccount]
        const bValue = b[sortConfig.key as keyof LockedAccount]

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
  }, [accounts, searchQuery, filters, sortConfig])

  // Pagination
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return filteredAndSortedData.slice(start, end)
  }, [filteredAndSortedData, page, pageSize])

  // Xử lý mở khóa
  const handleUnlock = async (account: LockedAccount, reason?: string) => {
    // Remove from locked accounts (in real app, this would update the account status)
    setAccounts(accounts.filter((a) => a.id !== account.id))
    setIsUnlockModalOpen(false)
    setSelectedAccount(null)
    console.log("Unlocking account:", account, "Reason:", reason)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tài khoản đã khóa</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý các tài khoản đã bị khóa trong hệ thống
        </p>
      </div>

      <DataTable
        data={paginatedData}
        columns={columns}
        keyExtractor={(row) => row.id || row.email}
        onCreate={undefined}
        emptyMessage="Chưa có tài khoản nào bị khóa"
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
      <LockedAccountDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        account={selectedAccount}
        onUnlock={(account) => {
          setSelectedAccount(account)
          setIsDetailModalOpen(false)
          setIsUnlockModalOpen(true)
        }}
      />

      {/* Modal mở khóa */}
      <UnlockAccountModal
        open={isUnlockModalOpen}
        onOpenChange={setIsUnlockModalOpen}
        account={selectedAccount}
        onSubmit={handleUnlock}
      />
    </div>
  )
}

export default ManageLockedAccountsPage
