import { useState } from "react";
import CabinetCardItem from "../features/cabinet/components/CabinetCardItem";
import LocationSelector from "../features/cabinet/components/LocationSelector";
import CreateOrUpdateCabinetModal, { type CabinetFormData } from "../features/cabinet/modals/CreateOrUpdateCabinetModal";
import CabinetDetailModal from "../features/cabinet/modals/CabinetDetailModal";
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
import type { Cabinet } from "../features/cabinet/types/cabinet.types";
import { cabinetService } from "../features/cabinet/services/cabinet.service";
import { useCabinet } from "../features/cabinet/hooks/useCabinet";
import { toast } from "sonner";

const ManageCabinetPage = () => {
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");

  const {
    cabinets,
    total,
    isLoading,
    page,
    pageSize,
    setCabinets,
    setTotal,
    setPage,
    setPageSize,
    refetch,
    handleSearch,
    handleFilter,
    handleClearFilters,
  } = useCabinet({
    defaultPageSize: 10,
    locationId: selectedLocationId || undefined,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCabinet, setSelectedCabinet] = useState<Cabinet | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");

  // Quick filters (không dùng filter columns - tham khảo ManageLocationPage)
  const quickFilters: QuickFilter[] = [];

  const handleCreate = () => {
    setSelectedCabinet(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEdit = (cabinet: Cabinet) => {
    setSelectedCabinet(cabinet);
    setModalMode("update");
    setIsModalOpen(true);
  };

  const handleDelete = (cabinet: Cabinet) => {
    setSelectedCabinet(cabinet);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCabinet?.id) return;

    try {
      await cabinetService.delete(selectedCabinet.id);
      setCabinets(cabinets.filter((c) => c.id !== selectedCabinet.id));
      setTotal((prev) => Math.max(0, prev - 1));
      setIsDeleteDialogOpen(false);
      setSelectedCabinet(null);

      if (cabinets.length <= 1 && page > 1) {
        setPage(Math.max(1, page - 1));
      }

      toast.success("Xóa cabinet thành công");
    } catch (error) {
      console.error("Error deleting cabinet:", error);
      toast.error("Có lỗi xảy ra khi xóa cabinet");
    }
  };

  const handleSubmit = async (data: CabinetFormData) => {
    try {
      const payload = {
        locationId: data.locationId,
        name: data.name,
        macAddress: data.macAddress,
        ipAddress: data.ipAddress,
        firmwareVersion: data.firmwareVersion,
        totalRows: data.totalRows,
        totalColumns: data.totalColumns,
      };
      if (modalMode === "create") {
        await cabinetService.create(payload);
        toast.success("Thêm cabinet thành công");
        refetch();
      } else {
        if (!selectedCabinet?.id) return;
        const response = await cabinetService.update(selectedCabinet.id, payload);
        setCabinets(
          cabinets.map((c) => (c.id === selectedCabinet.id ? response.data : c))
        );
        toast.success("Cập nhật cabinet thành công");
      }

      setIsModalOpen(false);
      setSelectedCabinet(null);
    } catch (error) {
      console.error("Error saving cabinet:", error);
      toast.error("Có lỗi xảy ra khi thêm/cập nhật cabinet");
    }
  };

  const handleViewDetails = (cabinet: Cabinet) => {
    setSelectedCabinet(cabinet);
    setIsDetailModalOpen(true);
  };

  const handleDetailModalClose = (open: boolean | Cabinet) => {
    if (typeof open === "boolean") {
      setIsDetailModalOpen(open);
      if (!open && modalMode === "create") {
        setSelectedCabinet(null);
      }
    } else {
      setCabinets(cabinets.map((c) => (c.id === open.id ? open : c)));
      setIsDetailModalOpen(false);
      setSelectedCabinet(null);
    }
  };

  const handleQuickFilterChange = () => {
    setPage(1);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản lý cụm tủ</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý các cụm tủ chứa nhiều tủ
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="text-sm text-muted-foreground">
          Tổng số cụm tủ: <strong>{total}</strong>
        </div>
      </div>

      <DataGrid
        data={cabinets}
        keyExtractor={(row) => row.id}
        renderCard={(cabinet) => (
          <CabinetCardItem
            cabinet={cabinet}
            onClick={() => handleViewDetails(cabinet)}
          />
        )}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        emptyMessage="Chưa có cụm tủ nào"
        isLoading={isLoading}
        gridCols={{ default: 1, md: 2, lg: 3, xl: 4 }}
        searchable={true}
        searchPlaceholder="Tìm kiếm theo tên, MAC..."
        onSearch={handleSearch}
        filterable={true}
        onFilter={handleFilter}
        quickFilters={quickFilters}
        onQuickFilterChange={handleQuickFilterChange}
        extraFiltersComponent={<LocationSelector
          value={selectedLocationId}
          onValueChange={setSelectedLocationId}
          placeholder="Tất cả địa điểm"
          filterActiveOnly={false}
          className="w-[200px]"
        />}
        onClearFilters={() => {
          handleClearFilters();
          setSelectedLocationId("");
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

      <CreateOrUpdateCabinetModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        cabinetData={selectedCabinet}
        onSubmit={handleSubmit}
        mode={modalMode}
      />

      {selectedCabinet && (
        <CabinetDetailModal
          open={isDetailModalOpen}
          onOpenChange={handleDetailModalClose}
          cabinet={selectedCabinet}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa cụm tủ</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa cụm tủ{" "}
              <strong>{selectedCabinet?.name}</strong>? Hành động này không thể
              hoàn tác. Tất cả các tủ trong cụm tủ này cũng sẽ bị xóa.
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

export default ManageCabinetPage;
