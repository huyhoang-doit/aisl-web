import { useState } from "react";
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
import { Plus, Ruler } from "lucide-react";
import type { Size } from "../features/size/types/size.types";
import { sizeService } from "../features/size/services/size.service";
import { useSize } from "../features/size/hooks/useSize";
import { toast } from "sonner";
import SizeTable from "../features/size/components/SizeTable";
import CreateOrUpdateSizeModal, { type SizeFormData } from "../features/size/modals/CreateOrUpdateSizeModal";

const ManageSizePage = () => {
  const {
    sizes,
    total,
    isLoading,
    page,
    pageSize,
    setSizes,
    setTotal,
    setPage,
    setPageSize,
    refetch,
    handleSearch,
  } = useSize({
    defaultPageSize: 10,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");

  const handleCreate = () => {
    setSelectedSize(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEdit = (size: Size) => {
    setSelectedSize(size);
    setModalMode("update");
    setIsModalOpen(true);
  };

  const handleDelete = (size: Size) => {
    setSelectedSize(size);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedSize?.id) return;

    try {
      await sizeService.delete(selectedSize.id);
      setSizes(sizes.filter((s) => s.id !== selectedSize.id));
      setTotal((prev) => Math.max(0, prev - 1));
      setIsDeleteDialogOpen(false);
      setSelectedSize(null);

      if (sizes.length <= 1 && page > 1) {
        setPage(Math.max(1, page - 1));
      }

      toast.success("Xóa kích thước thành công");
    } catch (error) {
      console.error("Error deleting size:", error);
      toast.error("Có lỗi xảy ra khi xóa kích thước");
    }
  };

  const handleSubmit = async (data: SizeFormData) => {
    try {
      if (modalMode === "create") {
        await sizeService.create(data);
        toast.success("Thêm kích thước thành công");
        refetch();
      } else {
        if (!selectedSize?.id) return;
        const response = await sizeService.update(selectedSize.id, data);
        setSizes(
          sizes.map((s) => (s.id === selectedSize.id ? response.data : s))
        );
        toast.success("Cập nhật kích thước thành công");
      }

      setIsModalOpen(false);
      setSelectedSize(null);
    } catch (error) {
      console.error("Error saving size:", error);
      toast.error("Có lỗi xảy ra khi thêm/cập nhật kích thước");
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Ruler className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Quản lý kích thước</h1>
          </div>
          <p className="text-muted-foreground mt-2">
            Quản lý các loại kích thước locker trong hệ thống
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Thêm kích thước mới
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="text-sm text-muted-foreground">
          Tổng số loại kích thước: <strong>{total}</strong>
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <SizeTable
          sizes={sizes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
          pagination={{
            page,
            pageSize,
            total,
            onPageChange: setPage,
            onPageSizeChange: setPageSize,
          }}
          onSearch={handleSearch}
        />
      </div>

      <CreateOrUpdateSizeModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        sizeData={selectedSize}
        onSubmit={handleSubmit}
        mode={modalMode}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa kích thước</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa kích thước{" "}
              <strong>{selectedSize?.name}</strong>? Những locker đang sử dụng kích thước này sẽ bị ảnh hưởng. Hành động này không thể hoàn tác.
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

export default ManageSizePage;
