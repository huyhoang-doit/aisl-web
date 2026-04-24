import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LockerCardItem from "../features/locker/components/LockerCardItem";
import CreateOrUpdateLockerModal, {
  type LockerFormData,
} from "../features/locker/modals/CreateOrUpdateLockerModal";
import LockerDetailModal from "../features/locker/modals/LockerDetailModal";
import CabinetSelector from "../features/cabinet/components/CabinetSelector";
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
import { Button } from "@/shared/components/ui/button";
import { Settings } from "lucide-react";
import type { Locker } from "../features/locker/types/locker.types";
import ClearLockerSetupModal from "../features/locker/modals/ClearLockerSetupModal";
import { lockerService } from "../features/locker/services/locker.service";
import { useLocker } from "../features/locker/hooks/useLocker";
import { toast } from "sonner";

const ManageLockerPage = () => {
  const [selectedCabinetId, setSelectedCabinetId] = useState<string>("");

  const {
    lockers,
    total,
    isLoading,
    page,
    pageSize,
    setLockers,
    setTotal,
    setPage,
    setPageSize,
    refetch,
    handleSearch,
    handleFilter,
    handleClearFilters,
  } = useLocker({
    defaultPageSize: 10,
    cabinetId: selectedCabinetId || undefined,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const navigate = useNavigate();
  const [isClearSetupModalOpen, setIsClearSetupModalOpen] = useState(false);

  const quickFilters: QuickFilter[] = [
    {
      key: "status",
      label: "Trạng thái",
      placeholder: "Chọn trạng thái",
      options: [
        { value: "AVAILABLE", label: "Trống" },
        { value: "OCCUPIED", label: "Đã thuê" },
        { value: "MAINTENANCE", label: "Bảo trì" },
        { value: "RESERVED", label: "Đã đặt" },
      ],
    },
  ];

  const handleCreate = () => {
    setSelectedLocker(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEdit = (locker: Locker) => {
    setSelectedLocker(locker);
    setModalMode("update");
    setIsModalOpen(true);
  };

  const handleDelete = (locker: Locker) => {
    setSelectedLocker(locker);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedLocker?.id) return;

    try {
      await lockerService.delete(selectedLocker.id);
      setLockers(lockers.filter((l) => l.id !== selectedLocker.id));
      setTotal((prev) => Math.max(0, prev - 1));
      setIsDeleteDialogOpen(false);
      setSelectedLocker(null);

      if (lockers.length <= 1 && page > 1) {
        setPage(Math.max(1, page - 1));
      }

      toast.success("Xóa locker thành công");
    } catch (error) {
      console.error("Error deleting locker:", error);
      toast.error("Có lỗi xảy ra khi xóa locker");
    }
  };

  const handleSubmit = async (data: LockerFormData) => {
    const payload = {
      cabinetId: data.cabinetId,
      sizeId: data.sizeId,
      row: data.row,
      column: data.column,
      status: data.status,
      isActive: data.isActive,
    };

    try {
      if (modalMode === "create") {
        await lockerService.create(payload);
        toast.success("Thêm locker thành công");
        refetch();
      } else {
        if (!selectedLocker?.id) return;
        const response = await lockerService.update(selectedLocker.id, payload);
        setLockers(
          lockers.map((l) => (l.id === selectedLocker.id ? response.data : l))
        );
        toast.success("Cập nhật locker thành công");
      }

      setIsModalOpen(false);
      setSelectedLocker(null);
    } catch (error) {
      console.error("Error saving locker:", error);
      toast.error("Có lỗi xảy ra khi thêm/cập nhật locker");
    }
  };

  const handleViewDetails = (locker: Locker) => {
    setSelectedLocker(locker);
    setIsDetailModalOpen(true);
  };

  const handleDetailModalClose = (open: boolean | Locker) => {
    if (typeof open === "boolean") {
      setIsDetailModalOpen(open);
      if (!open && modalMode === "create") {
        setSelectedLocker(null);
      }
    } else {
      setLockers(lockers.map((l) => (l.id === open.id ? open : l)));
      setIsDetailModalOpen(false);
      setSelectedLocker(null);
    }
  };

  const handleQuickFilterChange = () => {
    setPage(1);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý locker</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý các locker trong hệ thống
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* <Button
            variant="destructive"
            onClick={() => setIsClearSetupModalOpen(true)}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear setup locker
          </Button> */}
          <Button
            variant="outline"
            onClick={() => navigate("/admin/sizes")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Quản lý kích thước
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="text-sm text-muted-foreground">
          Tổng số locker: <strong>{total}</strong>
        </div>
      </div>

      <DataGrid
        data={lockers}
        keyExtractor={(row) => row.id}
        renderCard={(locker) => (
          <LockerCardItem
            locker={locker}
            onClick={() => handleViewDetails(locker)}
          />
        )}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        emptyMessage="Chưa có locker nào"
        isLoading={isLoading}
        gridCols={{ default: 1, md: 2, lg: 3, xl: 4 }}
        searchable={true}
        searchPlaceholder="Tìm kiếm theo mã locker..."
        onSearch={handleSearch}
        filterable={true}
        onFilter={handleFilter}
        quickFilters={quickFilters}
        onQuickFilterChange={handleQuickFilterChange}
        extraFiltersComponent={
          <CabinetSelector
            value={selectedCabinetId}
            onValueChange={setSelectedCabinetId}
            placeholder="Tất cả cabinet"
            allowClear={true}
            className="w-[200px]"
          />
        }
        onClearFilters={() => {
          handleClearFilters();
          setSelectedCabinetId("");
        }}
        pagination={{
          page,
          pageSize,
          total,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
          pageSizeOptions: [6, 10, 18, 24],
        }}
      />

      <CreateOrUpdateLockerModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open && selectedLocker && isDetailModalOpen) {
            const updatedLocker = lockers.find((l) => l.id === selectedLocker.id);
            if (updatedLocker) {
              setSelectedLocker(updatedLocker);
            }
          }
        }}
        lockerData={selectedLocker}
        onSubmit={handleSubmit}
        mode={modalMode}
        defaultCabinetId={selectedCabinetId}
      />

      {selectedLocker && (
        <LockerDetailModal
          open={isDetailModalOpen}
          onOpenChange={handleDetailModalClose}
          locker={selectedLocker}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa locker</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa locker{" "}
              <strong>
                {selectedLocker?.lockerLabel ??
                  `${selectedLocker?.row}-${selectedLocker?.column}`}
              </strong>
              ? Hành động này không thể hoàn tác.
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


      <ClearLockerSetupModal
        open={isClearSetupModalOpen}
        onOpenChange={setIsClearSetupModalOpen}
        defaultCabinetId={selectedCabinetId}
        onSuccess={refetch}
      />
    </div>
  );
};

export default ManageLockerPage;
