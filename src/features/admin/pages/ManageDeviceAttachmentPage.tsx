import { useState } from "react";
import {
  DataTable,
  type Column,
  type QuickFilter,
} from "@/shared/components/DataTable";
import {
  CreateOrUpdateDeviceAttachmentModal,
  type DeviceAttachmentFormData,
} from "../features/deviceAttachment/components/CreateOrUpdateDeviceAttachmentModal";
import CabinetSelector from "../features/cabinet/components/CabinetSelector";
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
import { deviceAttachmentService } from "../features/deviceAttachment/services/deviceAttachment.service";
import { useDeviceAttachment } from "../features/deviceAttachment/hooks/useDeviceAttachment";
import type { DeviceAttachment } from "../features/deviceAttachment/types/deviceAttachment.types";
import { toast } from "sonner";

const ManageDeviceAttachmentPage = () => {
  const [selectedCabinetId, setSelectedCabinetId] = useState<string>("");

  const {
    deviceAttachments,
    total,
    isLoading,
    page,
    pageSize,
    setDeviceAttachments,
    setPage,
    setPageSize,
    refetch,
    handleSearch,
    handleFilter,
    handleClearFilters,
  } = useDeviceAttachment({
    defaultPageSize: 10,
    cabinetId: selectedCabinetId || undefined,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<DeviceAttachment | null>(
    null,
  );
  const [modalMode, setModalMode] = useState<"create" | "update">("create");

  const columns: Column<DeviceAttachment>[] = [
    {
      key: "name",
      header: "Tên thiết bị",
      sortable: true,
      accessor: (row) => <div className="font-medium">{row.name}</div>,
    },
    {
      key: "serialNumber",
      header: "Số serial",
      sortable: true,
      accessor: (row) => (
        <div className="text-muted-foreground">{row.serialNumber}</div>
      ),
    },
    {
      key: "cabinetId",
      header: "Cabinet",
      sortable: true,
      accessor: (row) => (
        <div className="text-muted-foreground font-mono text-sm">
          {row.cabinetId}
        </div>
      ),
    },
    {
      key: "description",
      header: "Mô tả",
      accessor: (row) => (
        <div className="max-w-[200px] truncate text-muted-foreground text-sm">
          {row.description || "—"}
        </div>
      ),
    },
    {
      key: "isActive",
      header: "Trạng thái",
      sortable: true,
      accessor: (row) => (
        <Badge variant={row.isActive ? "success" : "secondary"}>
          {row.isActive ? "Hoạt động" : "Không hoạt động"}
        </Badge>
      ),
    },
  ];

  const quickFilters: QuickFilter[] = [
    {
      key: "isActive",
      label: "Trạng thái",
      allStringValue: "Tất cả trạng thái",
      placeholder: "Chọn trạng thái",
      options: [
        { value: "true", label: "Hoạt động" },
        { value: "false", label: "Không hoạt động" },
      ],
    },
  ];

  const handleCreate = () => {
    setSelectedDevice(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEdit = async (device: DeviceAttachment) => {
    try {
      const res = await deviceAttachmentService.getDetail(device.id);
      setSelectedDevice(res.data);
      setModalMode("update");
      setIsModalOpen(true);
    } catch {
      toast.error("Không tải được thông tin thiết bị");
    }
  };

  const handleDelete = (device: DeviceAttachment) => {
    setSelectedDevice(device);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedDevice?.id) return;

    try {
      await deviceAttachmentService.delete(selectedDevice.id);
      setDeviceAttachments((prev) =>
        prev.filter((d) => d.id !== selectedDevice.id),
      );
      setIsDeleteDialogOpen(false);
      setSelectedDevice(null);
      refetch();
      toast.success("Xóa thiết bị thành công");
    } catch (error) {
      console.error("Error deleting device attachment:", error);
      toast.error("Có lỗi xảy ra khi xóa thiết bị");
    }
  };

  const handleSubmit = async (data: DeviceAttachmentFormData) => {
    try {
      const payload: any = {
        name: data.name,
        serialNumber: data.serialNumber,
        isActive: data.isActive,
      };

      if (data.cabinetId) {
        payload.cabinetId = data.cabinetId;
      }
      if (data.cabinetConfigId) {
        payload.cabinetConfigId = data.cabinetConfigId;
      }
      if (data.description && data.description.trim()) {
        payload.description = data.description.trim();
      }

      if (modalMode === "create") {
        await deviceAttachmentService.create(payload);
        toast.success("Thêm thiết bị thành công");
      } else {
        if (!selectedDevice?.id) return;
        await deviceAttachmentService.update(selectedDevice.id, payload);
        toast.success("Cập nhật thiết bị thành công");
      }

      refetch();
      setIsModalOpen(false);
      setSelectedDevice(null);
    } catch (error) {
      console.error("Error saving device attachment:", error);
      toast.error("Có lỗi xảy ra khi thêm/cập nhật thiết bị");
      throw error;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Quản lý thiết bị tủ và setup
        </h1>
        <p className="text-muted-foreground mt-2">
          Quản lý danh sách thiết bị tủ và setup
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-md border border-border bg-card p-4">
        <span className="text-sm font-medium text-muted-foreground">
          Lọc theo cabinet:
        </span>
        <CabinetSelector
          value={selectedCabinetId}
          onValueChange={setSelectedCabinetId}
          placeholder="Tất cả cabinet"
          allowClear={true}
        />
      </div>

      <DataTable
        data={deviceAttachments}
        columns={columns}
        keyExtractor={(row) => row.id}
        onEdit={handleEdit}
        onCreate={handleCreate}
        onDelete={handleDelete}
        emptyMessage="Chưa có thiết bị nào"
        isLoading={isLoading}
        filterable={false}
        onFilter={handleFilter}
        pagination={{
          page,
          pageSize,
          total,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
          pageSizeOptions: [5, 10, 20, 50, 100],
        }}
        searchable={true}
        searchPlaceholder="Tìm theo tên, số serial..."
        onSearch={handleSearch}
        quickFilters={quickFilters}
        onQuickFilterChange={() => setPage(1)}
        onClearFilters={handleClearFilters}
      />

      <CreateOrUpdateDeviceAttachmentModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        deviceAttachmentData={selectedDevice}
        onSubmit={handleSubmit}
        mode={modalMode}
        defaultCabinetId={selectedCabinetId}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa thiết bị</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa thiết bị{" "}
              <strong>{selectedDevice?.name}</strong> (Số serial:{" "}
              {selectedDevice?.serialNumber})? Hành động này không thể hoàn tác.
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

export default ManageDeviceAttachmentPage;
