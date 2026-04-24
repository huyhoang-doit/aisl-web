import { useState } from "react";
import {
  DataTable,
  type Column,
} from "@/shared/components/DataTable";
import {
  CreateOrUpdateVehicleTypeModal,
  type VehicleTypeFormData,
} from "../features/vehicleType/components/CreateOrUpdateVehicleTypeModal";
import VehicleTypeDetailModal from "../features/vehicleType/components/VehicleTypeDetailModal";
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
import { Badge } from "@/shared/components/ui/badge";
import { Eye } from "lucide-react";
import { vehicleTypeService } from "../features/vehicleType/services/vehicleType.service";
import { useVehicleTypes } from "../features/vehicleType/hooks/useVehicleTypes";
import type { VehicleType } from "../features/vehicleType/types/vehicleType.types";
import { toast } from "sonner";

const ManageVehiclesPage = () => {
  const {
    vehicleTypes,
    total,
    isLoading,
    page,
    pageSize,
    setVehicleTypes,
    setPage,
    setPageSize,
    refetch,
    handleSearch,
  } = useVehicleTypes({ defaultPageSize: 10 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");

  const columns: Column<VehicleType>[] = [
    {
      key: "name",
      header: "Tên loại phương tiện",
      sortable: true,
      accessor: (row) => (
        <div className="font-medium">{row.name}</div>
      ),
    },
    {
      key: "isActive",
      header: "Trạng thái",
      sortable: true,
      accessor: (row) => (
        <Badge variant={row.isActive ? "default" : "secondary"}>
          {row.isActive ? "Hoạt động" : "Không hoạt động"}
        </Badge>
      ),
    },
  ];

  const handleCreate = () => {
    setSelectedVehicleType(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEdit = async (vehicleType: VehicleType) => {
    try {
      const res = await vehicleTypeService.getDetail(vehicleType.id);
      setSelectedVehicleType(res.data);
      setModalMode("update");
      setIsDetailModalOpen(false);
      setIsModalOpen(true);
    } catch {
      toast.error("Không tải được thông tin loại phương tiện");
    }
  };

  const handleViewDetails = async (vehicleType: VehicleType) => {
    try {
      const res = await vehicleTypeService.getDetail(vehicleType.id);
      setSelectedVehicleType(res.data);
      setIsDetailModalOpen(true);
    } catch {
      toast.error("Không tải được chi tiết loại phương tiện");
    }
  };

  const handleDelete = (vehicleType: VehicleType) => {
    setSelectedVehicleType(vehicleType);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedVehicleType?.id) return;
    try {
      await vehicleTypeService.delete(selectedVehicleType.id);
      setIsDeleteDialogOpen(false);
      setSelectedVehicleType(null);
      refetch();
      toast.success("Xóa loại phương tiện thành công");
    } catch (error) {
      console.error("Error deleting vehicle type:", error);
      toast.error("Có lỗi xảy ra khi xóa loại phương tiện");
    }
  };

  const handleSubmit = async (data: VehicleTypeFormData) => {
    try {
      if (modalMode === "create") {
        await vehicleTypeService.create(data);
        toast.success("Thêm loại phương tiện thành công");
        refetch();
      } else {
        if (!selectedVehicleType?.id) return;
        await vehicleTypeService.update(selectedVehicleType.id, data);
        toast.success("Cập nhật loại phương tiện thành công");
        refetch();
      }
      setIsModalOpen(false);
      setSelectedVehicleType(null);
    } catch (error) {
      console.error("Error saving vehicle type:", error);
      toast.error("Có lỗi xảy ra khi thêm/cập nhật loại phương tiện");
      throw error;
    }
  };

  const handleDetailModalClose = (open: boolean | VehicleType) => {
    if (typeof open === "boolean") {
      setIsDetailModalOpen(open);
      if (!open) setSelectedVehicleType(null);
    } else {
      setVehicleTypes(
        vehicleTypes.map((v) => (v.id === open.id ? open : v))
      );
      setIsDetailModalOpen(false);
      setSelectedVehicleType(null);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản lý loại phương tiện</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý các loại phương tiện (BIKE, MOTORBIKE, CAR...) dùng trong điều phối
        </p>
      </div>

      <DataTable
        data={vehicleTypes}
        columns={columns}
        keyExtractor={(row) => row.id}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        customActions={[
          {
            label: "Xem chi tiết",
            icon: <Eye className="h-4 w-4" />,
            onClick: handleViewDetails,
            variant: "ghost",
          },
        ]}
        emptyMessage="Chưa có loại phương tiện nào"
        isLoading={isLoading}
        filterable={false}
        pagination={{
          page,
          pageSize,
          total,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
          pageSizeOptions: [5, 10, 20, 50],
        }}
        searchable={true}
        searchPlaceholder="Tìm theo tên loại phương tiện..."
        onSearch={handleSearch}
      />

      <CreateOrUpdateVehicleTypeModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        vehicleTypeData={selectedVehicleType}
        onSubmit={handleSubmit}
        mode={modalMode}
      />

      {selectedVehicleType && (
        <VehicleTypeDetailModal
          open={isDetailModalOpen}
          onOpenChange={handleDetailModalClose}
          vehicleType={selectedVehicleType}
          onEdit={handleEdit}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa loại phương tiện{" "}
              <strong>{selectedVehicleType?.name}</strong>? Hành động này không thể hoàn tác.
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

export default ManageVehiclesPage;
