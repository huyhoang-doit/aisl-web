import { useState } from "react"
import { DataTable, type Column, type SortConfig, type QuickFilter } from "@/shared/components/DataTable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { CourierRequestDetailModal } from "../features/courierRequest/components/CourierRequestDetailModal"
import { ApproveCourierRequestModal } from "../features/courierRequest/components/ApproveCourierRequestModal"
import { Button } from "@/shared/components/ui/button"
import { CheckCircle2, XCircle, Eye } from "lucide-react"
import type { CourierApplication, VehicleTypeValue } from "../features/courierRequest/types/courierRequest.types"
import { CourierStatus, VehicleType } from "../features/courierRequest/types/courierRequest.types"
import {
  useCourierApplication,
  type CourierStatusTab,
} from "../features/courierRequest/hooks/useCourierApplication"

/** Các tab theo trạng thái */
const COURIER_STATUS_TABS: CourierStatusTab[] = [
  CourierStatus.PENDING,
  CourierStatus.APPROVED,
  CourierStatus.REJECTED,
]

const STATUS_LABELS: Record<CourierStatusTab, string> = {
  [CourierStatus.PENDING]: "Chờ duyệt",
  [CourierStatus.APPROVED]: "Đã duyệt",
  [CourierStatus.REJECTED]: "Đã từ chối",
}

/** Màu tab khi active */
const TAB_COLOR_CLASS: Record<CourierStatusTab, string> = {
  [CourierStatus.PENDING]:
    "data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800 data-[state=active]:border-amber-300 border border-transparent border-border",
  [CourierStatus.APPROVED]:
    "data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800 data-[state=active]:border-emerald-300 border border-transparent border-border",
  [CourierStatus.REJECTED]:
    "data-[state=active]:bg-red-100 data-[state=active]:text-red-800 data-[state=active]:border-red-300 border border-transparent border-border",
}

const VEHICLE_LABELS: Record<VehicleTypeValue, string> = {
  [VehicleType.BIKE]: "Xe đạp",
  [VehicleType.MOTORBIKE]: "Xe máy",
  [VehicleType.CAR]: "Ô tô",
}

const ManageCourierRequest = () => {
  const [currentTab, setCurrentTab] = useState<CourierStatusTab>(CourierStatus.PENDING)

  const {
    applications,
    total,
    isLoading,
    page,
    pageSize,
    setPage,
    setPageSize,
    handleSearch,
    handleFilter,
    handleClearFilters,
    approve,
    reject,
    isApproving,
    isRejecting,
  } = useCourierApplication({ defaultPageSize: 10, status: currentTab })

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<CourierApplication | null>(null)
  const [, setSortConfig] = useState<SortConfig | null>(null)

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
      filterOptions: Object.values(VehicleType).map((v) => VEHICLE_LABELS[v]),
      accessor: (row) => (
        <div className="text-muted-foreground">{VEHICLE_LABELS[row.vehicleType] ?? row.vehicleType}</div>
      ),
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
          {row.status === CourierStatus.PENDING && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedApplication(row)
                  setIsApproveModalOpen(true)
                }}
                className="text-green-600 hover:text-green-700"
                disabled={isApproving || isRejecting}
              >
                <CheckCircle2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedApplication(row)
                  setIsRejectModalOpen(true)
                }}
                className="text-red-600 hover:text-red-700"
                disabled={isApproving || isRejecting}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
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
    action: "approve" | "reject",
    reviewNote: string
  ) => {
    if (action === "approve") {
      await approve(application.id, { reviewNote })
    } else {
      await reject(application.id, { reviewNote })
    }
    setIsApproveModalOpen(false)
    setIsRejectModalOpen(false)
    setSelectedApplication(null)
  }

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
  ]

  const emptyMessages: Record<CourierStatusTab, string> = {
    [CourierStatus.PENDING]: "Chưa có đơn nào chờ duyệt",
    [CourierStatus.APPROVED]: "Chưa có đơn nào đã duyệt",
    [CourierStatus.REJECTED]: "Chưa có đơn nào đã từ chối",
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Duyệt người chuyển phát</h1>
        <p className="text-muted-foreground mt-2">
          Duyệt các đơn đăng ký làm người chuyển phát trong hệ thống
        </p>
      </div>

      <Tabs
        value={currentTab}
        onValueChange={(value) => {
          setCurrentTab(value as CourierStatusTab)
          setPage(1)
        }}
        className="w-full"
      >
        <TabsList className="flex justify-start flex-wrap h-auto gap-1 p-1 bg-muted/50">
          {COURIER_STATUS_TABS.map((status) => (
            <TabsTrigger
              key={status}
              value={status}
              className={TAB_COLOR_CLASS[status]}
            >
              {STATUS_LABELS[status]}
            </TabsTrigger>
          ))}
        </TabsList>

        {COURIER_STATUS_TABS.map((tabValue) => (
          <TabsContent key={tabValue} value={tabValue} className="space-y-4 mt-4">
            <DataTable
              data={applications}
              columns={columns}
              keyExtractor={(row) => row.id}
              emptyMessage={emptyMessages[tabValue]}
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
              searchable
              searchPlaceholder="Tìm theo tên, biển số xe..."
              onSearch={handleSearch}
              quickFilters={quickFilters}
              onQuickFilterChange={() => setPage(1)}
              onClearFilters={handleClearFilters}
              isLoading={isLoading}
            />
          </TabsContent>
        ))}
      </Tabs>

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
