import { useState, useMemo } from "react";
import PlanCardItem from "../features/plan/components/PlanCardItem";
import CreateOrUpdatePlanModal, { type PlanFormData } from "../features/plan/modals/CreateOrUpdatePlanModal";
import PlanDetailModal from "../features/plan/modals/PlanDetailModal";
import { DataGrid, type Column, type FilterConfig, type QuickFilter } from "@/shared/components/DataGrid";
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
import type { Plan } from "../features/plan/types/plan.types";

// Mock data - Thay thế bằng API call thực tế
const mockPlans: Plan[] = [
  {
    id: "1",
    name: "Gói Cơ Bản",
    code: "PLAN-BASIC",
    description: "Gói đăng ký cơ bản phù hợp cho người dùng mới",
    price: 50000,
    duration: 1,
    durationUnit: "month",
    features: [
      "Sử dụng locker nhỏ",
      "Hỗ trợ 24/7",
      "Thông báo qua email",
    ],
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Gói Tiêu Chuẩn",
    code: "PLAN-STANDARD",
    description: "Gói đăng ký tiêu chuẩn với nhiều tính năng hơn",
    price: 100000,
    duration: 1,
    durationUnit: "month",
    features: [
      "Sử dụng locker nhỏ và vừa",
      "Hỗ trợ 24/7",
      "Thông báo qua email và SMS",
      "Ưu tiên đặt chỗ",
    ],
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Gói Premium",
    code: "PLAN-PREMIUM",
    description: "Gói đăng ký cao cấp với đầy đủ tính năng",
    price: 200000,
    duration: 1,
    durationUnit: "month",
    features: [
      "Sử dụng tất cả loại locker",
      "Hỗ trợ 24/7",
      "Thông báo qua email, SMS và push notification",
      "Ưu tiên đặt chỗ",
      "Miễn phí hủy đặt chỗ",
      "Tích điểm thưởng",
    ],
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Gói Năm",
    code: "PLAN-YEARLY",
    description: "Gói đăng ký theo năm với giá ưu đãi",
    price: 2000000,
    duration: 1,
    durationUnit: "year",
    features: [
      "Sử dụng tất cả loại locker",
      "Hỗ trợ 24/7",
      "Thông báo qua email, SMS và push notification",
      "Ưu tiên đặt chỗ",
      "Miễn phí hủy đặt chỗ",
      "Tích điểm thưởng",
      "Giảm giá 20% so với đăng ký tháng",
    ],
    status: "inactive",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const ManagePlanPage = () => {
  const [plans, setPlans] = useState<Plan[]>(mockPlans);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter columns for DataGrid
  const filterColumns: Column<Plan>[] = [
    {
      key: "name",
      header: "Tên gói",
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Tìm theo tên",
    },
    {
      key: "code",
      header: "Mã gói",
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Tìm theo mã",
    },
    {
      key: "status",
      header: "Trạng thái",
      filterable: true,
      filterType: "select",
      filterOptions: ["Hoạt động", "Không hoạt động"],
    },
  ];

  // Quick filters
  const quickFilters: QuickFilter[] = [
    {
      key: "status",
      label: "Trạng thái",
      placeholder: "Chọn trạng thái",
      options: [
        { value: "Hoạt động", label: "Hoạt động" },
        { value: "Không hoạt động", label: "Không hoạt động" },
      ],
    },
  ];

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let result = [...plans];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (plan) =>
          plan.name.toLowerCase().includes(query) ||
          plan.code.toLowerCase().includes(query) ||
          plan.description?.toLowerCase().includes(query) ||
          plan.features.some((feature) => feature.toLowerCase().includes(query))
      );
    }

    // Apply filters
    filters.forEach((filter) => {
      if (filter.key === "status") {
        const statusMap: Record<string, Plan["status"]> = {
          "Hoạt động": "active",
          "Không hoạt động": "inactive",
        };
        const statusValue = statusMap[filter.value];
        if (statusValue) {
          result = result.filter((plan) => plan.status === statusValue);
        }
      } else {
        const value = filter.value.toLowerCase();
        result = result.filter((plan) => {
          const fieldValue = String(plan[filter.key as keyof Plan] || "").toLowerCase();
          return fieldValue.includes(value);
        });
      }
    });

    return result;
  }, [plans, searchQuery, filters]);

  // Pagination
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredAndSortedData.slice(start, end);
  }, [filteredAndSortedData, page, pageSize]);

  // Xử lý tạo mới
  const handleCreate = () => {
    setSelectedPlan(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  // Xử lý chỉnh sửa
  const handleEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    setModalMode("update");
    setIsModalOpen(true);
  };

  // Xử lý xóa
  const handleDelete = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsDeleteDialogOpen(true);
  };

  // Xác nhận xóa
  const confirmDelete = () => {
    if (selectedPlan?.id) {
      setPlans(plans.filter((p) => p.id !== selectedPlan.id));
      setIsDeleteDialogOpen(false);
      setSelectedPlan(null);
      // Reset page if current page is empty
      const newTotalPages = Math.ceil((filteredAndSortedData.length - 1) / pageSize);
      if (page > newTotalPages && newTotalPages > 0) {
        setPage(newTotalPages);
      }
    }
  };

  // Xử lý submit form
  const handleSubmit = async (data: PlanFormData) => {
    if (modalMode === "create") {
      // Tạo plan mới
      const newPlan: Plan = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPlans([...plans, newPlan]);
      // TODO: Gọi API để tạo plan
      console.log("Creating plan:", newPlan);
    } else {
      // Cập nhật plan
      setPlans(
        plans.map((p) =>
          p.id === selectedPlan?.id
            ? { ...data, id: p.id, createdAt: p.createdAt, updatedAt: new Date().toISOString() }
            : p
        )
      );
      // TODO: Gọi API để cập nhật plan
      console.log("Updating plan:", data);
    }
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  // Xử lý xem chi tiết
  const handleViewDetails = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsDetailModalOpen(true);
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
    setSelectedPlan(null);
  };

  // Handler functions for DataGrid
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset về trang đầu khi search
  };

  const handleFilter = (newFilters: FilterConfig[]) => {
    setFilters(newFilters);
    setPage(1); // Reset về trang đầu khi filter
  };

  const handleQuickFilterChange = () => {
    setPage(1); // Reset về trang đầu khi quick filter thay đổi
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản lý gói đăng ký</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý các gói đăng ký dịch vụ cho người dùng trong hệ thống
        </p>
      </div>

      <DataGrid
        data={paginatedData}
        keyExtractor={(row) => row.id}
        renderCard={(plan) => (
          <PlanCardItem
            plan={plan}
            onClick={() => handleViewDetails(plan)}
          />
        )}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        emptyMessage="Chưa có gói đăng ký nào"
        isLoading={false}
        gridCols={{ default: 1, md: 2, lg: 3, xl: 4 }}
        // Search
        searchable={true}
        searchPlaceholder="Tìm kiếm theo tên, mã gói, tính năng..."
        onSearch={handleSearch}
        // Filters
        filterable={true}
        filterColumns={filterColumns}
        onFilter={handleFilter}
        quickFilters={quickFilters}
        onQuickFilterChange={handleQuickFilterChange}
        onClearFilters={() => {
          setFilters([]);
          setSearchQuery("");
          setPage(1);
        }}
        // Pagination
        pagination={{
          page,
          pageSize,
          total: filteredAndSortedData.length,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
          pageSizeOptions: [6, 12, 18, 24],
        }}
      />

      {/* Modal tạo/cập nhật */}
      <CreateOrUpdatePlanModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        planData={selectedPlan}
        onSubmit={handleSubmit}
        mode={modalMode}
      />

      {/* Modal chi tiết */}
      {selectedPlan && (
        <PlanDetailModal
          open={isDetailModalOpen}
          onOpenChange={handleDetailModalClose}
          plan={selectedPlan}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Dialog xác nhận xóa */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa gói đăng ký</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa gói đăng ký{" "}
              <strong>{selectedPlan?.name}</strong> ({selectedPlan?.code})? 
              Hành động này không thể hoàn tác. Tất cả các đăng ký đang sử dụng gói này sẽ bị ảnh hưởng.
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
  );
};

export default ManagePlanPage;
