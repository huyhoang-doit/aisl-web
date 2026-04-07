import { useState } from "react";
import PlanCardItem from "../features/plan/components/PlanCardItem";
import CreateOrUpdatePlanModal, { type PlanFormData } from "../features/plan/modals/CreateOrUpdatePlanModal";
import PlanDetailModal from "../features/plan/modals/PlanDetailModal";
import { DataGrid, type QuickFilter } from "@/shared/components/DataGrid";
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
import { planService } from "../features/plan/services/plan.service";
import { usePlan } from "../features/plan/hooks/usePlan";
import { toast } from "sonner";

const ManagePlanPage = () => {
  const {
    plans,
    total,
    isLoading,
    page,
    pageSize,
    setPlans,
    setTotal,
    setPage,
    setPageSize,
    refetch,
    handleSearch,
    handleFilter,
    handleClearFilters,
  } = usePlan({
    defaultPageSize: 12,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");

  const quickFilters: QuickFilter[] = [
    {
      allSelectedLabel: "Tất cả trạng thái",
      key: "status",
      label: "Trạng thái",
      placeholder: "Chọn trạng thái",
      options: [
        { value: "ACTIVE", label: "Hoạt động" },
        { value: "INACTIVE", label: "Không hoạt động" },
      ],
    },
  ];

  const handleCreate = () => {
    setSelectedPlan(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    setModalMode("update");
    setIsModalOpen(true);
  };

  const handleDelete = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPlan?.id) return;

    try {
      await planService.delete(selectedPlan.id);
      setPlans(plans.filter((p) => p.id !== selectedPlan.id));
      setTotal((prev) => Math.max(0, prev - 1));
      setIsDeleteDialogOpen(false);
      setSelectedPlan(null);

      if (plans.length <= 1 && page > 1) {
        setPage(Math.max(1, page - 1));
      }

      toast.success("Xóa gói đăng ký thành công");
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast.error("Có lỗi xảy ra khi xóa gói đăng ký");
    }
  };

  const handleSubmit = async (data: PlanFormData) => {
    const payload = {
      name: data.name,
      maxLockers: data.maxLockers,
      price: data.price,
      description: data.description,
      status: data.status,
      pricingIds: data.pricingIds,
    };

    try {
      if (modalMode === "create") {
        await planService.create(payload);
        toast.success("Thêm gói đăng ký thành công");
        refetch();
      } else {
        if (!selectedPlan?.id) return;
        const response = await planService.update(selectedPlan.id, payload);
        setPlans(
          plans.map((p) => (p.id === selectedPlan.id ? response.data : p))
        );
        toast.success("Cập nhật gói đăng ký thành công");
      }

      setIsModalOpen(false);
      setSelectedPlan(null);
    } catch (error) {
      console.error("Error saving plan:", error);
      toast.error("Có lỗi xảy ra khi thêm/cập nhật gói đăng ký");
    }
  };

  const handleViewDetails = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsDetailModalOpen(true);
  };

  const handleDetailModalClose = (open: boolean | Plan) => {
    if (typeof open === "boolean") {
      setIsDetailModalOpen(open);
      if (!open && modalMode === "create") {
        setSelectedPlan(null);
      }
    } else {
      setPlans(plans.map((p) => (p.id === open.id ? open : p)));
      setIsDetailModalOpen(false);
      setSelectedPlan(null);
    }
  };

  const handleQuickFilterChange = () => {
    setPage(1);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản lý gói đăng ký</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý các gói đăng ký dịch vụ cho người dùng trong hệ thống
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="text-sm text-muted-foreground">
          Tổng số gói: <strong>{total}</strong>
        </div>
      </div>

      <DataGrid
        data={plans}
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
        isLoading={isLoading}
        gridCols={{ default: 1, md: 2, lg: 3, xl: 4 }}
        // searchable={true}
        // searchPlaceholder="Tìm kiếm theo tên, mô tả..."
        onSearch={handleSearch}
        filterable={true}
        onFilter={handleFilter}
        quickFilters={quickFilters}
        onQuickFilterChange={handleQuickFilterChange}
        onClearFilters={handleClearFilters}
        pagination={{
          page,
          pageSize,
          total,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
          pageSizeOptions: [6, 12, 18, 24],
        }}
      />

      <CreateOrUpdatePlanModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open && selectedPlan && isDetailModalOpen) {
            const updatedPlan = plans.find((p) => p.id === selectedPlan.id);
            if (updatedPlan) {
              setSelectedPlan(updatedPlan);
            }
          }
        }}
        planData={selectedPlan}
        onSubmit={handleSubmit}
        mode={modalMode}
      />

      {selectedPlan && (
        <PlanDetailModal
          open={isDetailModalOpen}
          onOpenChange={handleDetailModalClose}
          plan={selectedPlan}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa gói đăng ký</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa gói đăng ký{" "}
              <strong>{selectedPlan?.name}</strong>? Hành động này không thể hoàn
              tác. Tất cả các đăng ký đang sử dụng gói này sẽ bị ảnh hưởng.
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
