import { useState } from "react";
import PricingCardItem from "../features/pricing/components/PricingCardItem";
import CreateOrUpdatePricingModal, {
  type PricingFormData,
} from "../features/pricing/modals/CreateOrUpdatePricingModal";
import PricingDetailModal from "../features/pricing/modals/PricingDetailModal";
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
import { pricingService } from "../features/pricing/services/pricing.service";
import { usePricing } from "../features/pricing/hooks/usePricing";
import type { Pricing } from "../features/pricing/types/pricing.types";
import { toast } from "sonner";

const ManagePricingPage = () => {
  const {
    pricings,
    total,
    isLoading,
    page,
    pageSize,
    setPricings,
    setPage,
    setPageSize,
    refetch,
    handleSearch,
    handleFilter,
    handleClearFilters,
  } = usePricing({ defaultPageSize: 12 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPricing, setSelectedPricing] = useState<Pricing | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");

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
    {
      allSelectedLabel: "Tất cả loại",
      key: "orderType",
      label: "Loại đơn hàng",
      placeholder: "Chọn loại",
      options: [
        { value: "Logistics", label: "Logistics" },
        { value: "Thuê cá nhân", label: "Thuê cá nhân" },
      ],
    },
  ];

  const handleCreate = () => {
    setSelectedPricing(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEdit = async (pricing: Pricing) => {
    try {
      const res = await pricingService.getDetail(pricing.id);
      setSelectedPricing(res.data);
      setModalMode("update");
      setIsDetailModalOpen(false);
      setIsModalOpen(true);
    } catch {
      toast.error("Không tải được thông tin bảng giá");
    }
  };

  const handleDelete = (pricing: Pricing) => {
    setSelectedPricing(pricing);
    setIsDeleteDialogOpen(true);
  };

  const handleViewDetails = (pricing: Pricing) => {
    setSelectedPricing(pricing);
    setIsDetailModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPricing?.id) return;

    try {
      await pricingService.delete(selectedPricing.id);
      setPricings(pricings.filter((p) => p.id !== selectedPricing.id));
      refetch();
      setIsDeleteDialogOpen(false);
      setSelectedPricing(null);
      toast.success("Xóa mục bảng giá thành công");
    } catch (error) {
      console.error("Error deleting pricing:", error);
      toast.error("Có lỗi xảy ra khi xóa bảng giá");
    }
  };

  const handleSubmit = async (data: PricingFormData) => {
    try {
      const payload = {
        name: data.name,
        blockDuration: data.blockDuration,
        feePerBlock: data.feePerBlock,
        lateFeePerBlock: data.lateFeePerBlock,
        orderType: data.orderType,
        description: data.description,
        gracePeriod: data.gracePeriod,
      };

      if (modalMode === "create") {
        await pricingService.create(payload);
        toast.success("Thêm bảng giá thành công");
        refetch();
      } else {
        if (!selectedPricing?.id) return;
        const response = await pricingService.update(selectedPricing.id, payload);
        setPricings(
          pricings.map((p) => (p.id === selectedPricing.id ? response.data : p))
        );
        toast.success("Cập nhật bảng giá thành công");
      }

      setIsModalOpen(false);
      setSelectedPricing(null);
    } catch (error) {
      console.error("Error saving pricing:", error);
      toast.error("Có lỗi xảy ra khi thêm/cập nhật bảng giá");
      throw error;
    }
  };

  const handleDetailModalClose = (open: boolean | Pricing) => {
    if (typeof open === "boolean") {
      setIsDetailModalOpen(open);
      if (!open && modalMode === "create") {
        setSelectedPricing(null);
      }
    } else {
      setPricings(
        pricings.map((p) => (p.id === open.id ? open : p))
      );
      setIsDetailModalOpen(false);
      setSelectedPricing(null);
    }
  };

  const handleQuickFilterChange = () => {
    setPage(1);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản lý bảng giá</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý các mục giá dịch vụ: phí theo block, phí trễ, loại đơn hàng
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="text-sm text-muted-foreground">
          Tổng số bảng giá: <strong>{total}</strong>
        </div>
      </div>

      <DataGrid
        data={pricings}
        keyExtractor={(row) => row.id}
        renderCard={(pricing) => (
          <PricingCardItem
            pricing={pricing}
            onClick={() => handleViewDetails(pricing)}
          />
        )}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        emptyMessage="Chưa có mục bảng giá nào"
        isLoading={isLoading}
        gridCols={{ default: 1, md: 2, lg: 3, xl: 4 }}
        searchable={true}
        searchPlaceholder="Tìm kiếm theo tên, mô tả..."
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

      <CreateOrUpdatePricingModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open && selectedPricing && isDetailModalOpen) {
            const updatedPricing = pricings.find((p) => p.id === selectedPricing.id);
            if (updatedPricing) {
              setSelectedPricing(updatedPricing);
            }
          }
        }}
        pricingData={selectedPricing}
        onSubmit={handleSubmit}
        mode={modalMode}
      />

      {selectedPricing && (
        <PricingDetailModal
          open={isDetailModalOpen}
          onOpenChange={handleDetailModalClose}
          pricing={selectedPricing}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa mục bảng giá</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa mục giá{" "}
              <strong>{selectedPricing?.name}</strong>? Hành động này không thể
              hoàn tác.
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

export default ManagePricingPage;
