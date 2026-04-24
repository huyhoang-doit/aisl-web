import { useState } from "react";
import LocationCardItem from "../features/location/components/LocationCardItem";
import CreateOrUpdateLocationModal, { type LocationFormData } from "../features/location/modals/CreateOrUpdateLocationModal";
import LocationDetailModal from "../features/location/modals/LocationDetailModal";
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
import type { Location } from "../features/location/types/location.types";
import { DataGrid, type QuickFilter } from "@/shared/components/DataGrid";
import { locationService } from "../features/location/services/location.service";
import { useLocation } from "../features/location/hooks/useLocation";
import { toast } from "sonner";

const ManageLocationPage = () => {
  const {
    locations,
    total,
    isLoading,
    page,
    pageSize,
    setLocations,
    setTotal,
    setPage,
    setPageSize,
    refetch,
    handleSearch,
    handleFilter,
    handleClearFilters,
  } = useLocation({ defaultPageSize: 10 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");

  // Quick filters
  const quickFilters: QuickFilter[] = [
    {
      key: "isActive",
      label: "Trạng thái",
      placeholder: "Chọn trạng thái",
      options: [
        { value: "Hoạt động", label: "Hoạt động" },
        { value: "Không hoạt động", label: "Không hoạt động" },
      ],
    },
  ];

  // Xử lý tạo mới
  const handleCreate = () => {
    setSelectedLocation(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  // Xử lý chỉnh sửa
  const handleEdit = (location: Location) => {
    setSelectedLocation(location);
    setModalMode("update");
    setIsModalOpen(true);
  };

  // Xử lý xóa
  const handleDelete = (location: Location) => {
    setSelectedLocation(location);
    setIsDeleteDialogOpen(true);
  };

  // Xác nhận xóa
  const confirmDelete = async () => {
    if (!selectedLocation?.id) return;

    try {
      await locationService.delete(selectedLocation.id);
      setLocations(locations.filter((l) => l.id !== selectedLocation.id));
      setTotal((prev) => Math.max(0, prev - 1));
      setIsDeleteDialogOpen(false);
      setSelectedLocation(null);

      // Reset page nếu trang hiện tại trống và không phải trang 1
      if (locations.length <= 1 && page > 1) {
        setPage(Math.max(1, page - 1));
      }

      toast.success("Xóa địa điểm thành công");
    } catch (error) {
      console.error("Error deleting location:", error);
      toast.error("Có lỗi xảy ra khi xóa địa điểm");
    }
  };

  // Xử lý submit form
  const handleSubmit = async (data: LocationFormData) => {
    // Payload đúng format backend yêu cầu
    const payload = {
      name: data.name,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      description: data.description,
      isActive: data.isActive,
      plannedCabinetQuantity: data.plannedCabinetQuantity,
      plannedLockerQuantity: data.plannedLockerQuantity,
    };

    try {
      if (modalMode === "create") {
        await locationService.create(payload);
        toast.success("Thêm địa điểm thành công");
        refetch();
      } else {
        if (!selectedLocation?.id) return;

        const response = await locationService.update(selectedLocation.id, payload);
        setLocations(
          locations.map((l) => (l.id === selectedLocation.id ? response.data : l))
        );
        toast.success("Cập nhật địa điểm thành công");
      }

      setIsModalOpen(false);
      setSelectedLocation(null);
    } catch (error) {
      console.error("Error saving location:", error);
      toast.error("Có lỗi xảy ra khi thêm/cập nhật địa điểm");
    }
  };

  // Xử lý xem chi tiết
  const handleViewDetails = (location: Location) => {
    setSelectedLocation(location);
    setModalMode("update");
    setIsDetailModalOpen(true);
  };

  // Xử lý đóng detail modal và refresh data nếu cần
  const handleDetailModalClose = (open: boolean | Location) => {
    if (typeof open === "boolean") {
      setIsDetailModalOpen(open);
      if (!open && modalMode === "create") {
        setSelectedLocation(null);
      }
    } else {
      // Location was updated
      setLocations(
        locations.map((l) => (l.id === open.id ? open : l))
      );
      setIsDetailModalOpen(false);
      setSelectedLocation(null);
    }
  };

  const handleQuickFilterChange = () => {
    setPage(1);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản lý địa điểm đặt tủ</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý các địa điểm đặt các cụm cabinet trong hệ thống
        </p>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Tổng số địa điểm: <strong>{total}</strong>
        </div>
        {/* <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Thêm địa điểm mới
        </Button> */}
      </div>


      <DataGrid
        data={locations}
        keyExtractor={(row) => row.id}
        renderCard={(location) => (
          <LocationCardItem
            location={location}
            onClick={() => handleViewDetails(location)}
          />
        )}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        emptyMessage="Chưa có địa điểm nào"
        isLoading={isLoading}
        gridCols={{ default: 1, md: 2, lg: 3 }}
        // Search
        searchable={true}
        searchPlaceholder="Tìm kiếm theo tên, địa chỉ..."
        onSearch={handleSearch}
        // Filters
        filterable={true}
        // filterColumns={filterColumns}
        onFilter={handleFilter}
        quickFilters={quickFilters}
        onQuickFilterChange={handleQuickFilterChange}
        onClearFilters={handleClearFilters}
        // Pagination (server-side)
        pagination={{
          page,
          pageSize,
          total,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
          pageSizeOptions: [6, 10, 18, 24],
        }}
      />
      {/* Modal tạo/cập nhật */}
      <CreateOrUpdateLocationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        locationData={selectedLocation}
        onSubmit={handleSubmit}
        mode={modalMode}
      />

      {/* Modal chi tiết */}
      {selectedLocation && (
        <LocationDetailModal
          open={isDetailModalOpen}
          onOpenChange={handleDetailModalClose}
          location={selectedLocation}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onUpdateLocation={(updatedLocation) => {
            setLocations(
              locations.map((l) =>
                l.id === updatedLocation.id ? updatedLocation : l
              )
            );
          }}
        />
      )}

      {/* Dialog xác nhận xóa */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa địa điểm</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa địa điểm{" "}
              <strong>{selectedLocation?.name}</strong>? Hành động này không thể hoàn tác.
              Tất cả các cabinet và locker trong địa điểm này cũng sẽ bị xóa.
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

export default ManageLocationPage;