import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
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
import { Plus } from "lucide-react";
import type { Size } from "../../size/types/size.types";
import CreateOrUpdateSizeModal, { type SizeFormData } from "../../size/modals/CreateOrUpdateSizeModal";
import SizeTable from "../../size/components/SizeTable";
import { sizeService } from "../../size/services/size.service";
import { toast } from "sonner";

interface ManageSizeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ManageSizeModal({
  open,
  onOpenChange,
}: ManageSizeModalProps) {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [isSizeDeleteDialogOpen, setIsSizeDeleteDialogOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [sizeModalMode, setSizeModalMode] = useState<"create" | "update">("create");

  // Load sizes khi modal mở
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (!open) return;

    const loadSizes = async () => {
      try {
        const response = await sizeService.getAll();
        setSizes(response.data.sizes || []);
      } catch (error) {
        console.error("Error loading sizes:", error);
      }
    };

    loadSizes();
  }, [open]);

  // Xử lý tạo size mới
  const handleCreateSize = () => {
    setSelectedSize(null);
    setSizeModalMode("create");
    setIsSizeModalOpen(true);
  };

  // Xử lý chỉnh sửa size
  const handleEditSize = (size: Size) => {
    setSelectedSize(size);
    setSizeModalMode("update");
    setIsSizeModalOpen(true);
  };

  // Xử lý xóa size
  const handleDeleteSize = (size: Size) => {
    setSelectedSize(size);
    setIsSizeDeleteDialogOpen(true);
  };

  // Xác nhận xóa size
  const confirmDeleteSize = async () => {
    if (!selectedSize?.id) return;

    try {
      await sizeService.delete(selectedSize.id);
      setSizes(sizes.filter((s) => s.id !== selectedSize.id));
      setIsSizeDeleteDialogOpen(false);
      setSelectedSize(null);
      toast.success("Xóa kích thước thành công");
    } catch (error) {
      console.error("Error deleting size:", error);
      toast.error("Có lỗi xảy ra khi xóa kích thước");
    }
  };

  // Xử lý submit form size
  const handleSubmitSize = async (data: SizeFormData) => {
    // Payload đúng format backend yêu cầu: { name, width, height, depth }
    const payload = {
      name: data.name,
      width: data.width,
      height: data.height,
      depth: data.depth,
    };

    try {
      if (sizeModalMode === "create") {
        const response = await sizeService.create(payload);
        // Thêm size mới vào danh sách
        setSizes([...sizes, response.data]);
        toast.success("Thêm kích thước thành công");
      } else {
        if (!selectedSize?.id) return;
        const response = await sizeService.update(selectedSize.id, payload);
        // Cập nhật size trong danh sách
        setSizes(sizes?.map((s) => (s.id === selectedSize.id ? response.data : s)));
        toast.success("Cập nhật kích thước thành công");
      }
      setIsSizeModalOpen(false);
      setSelectedSize(null);
    } catch (error) {
      console.error("Error saving size:", error);
      toast.error("Có lỗi xảy ra khi thêm/cập nhật kích thước");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quản lý kích thước</DialogTitle>
            <DialogDescription>
              Quản lý các kích thước locker có sẵn trong hệ thống
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={handleCreateSize} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Thêm kích thước
              </Button>
            </div>

            <SizeTable
              sizes={sizes}
              onEdit={handleEditSize}
              onDelete={handleDeleteSize}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal tạo/cập nhật size */}
      <CreateOrUpdateSizeModal
        open={isSizeModalOpen}
        onOpenChange={(open) => {
          setIsSizeModalOpen(open);
          if (!open) {
            setSelectedSize(null);
          }
        }}
        sizeData={selectedSize}
        onSubmit={handleSubmitSize}
        mode={sizeModalMode}
      />

      {/* Dialog xác nhận xóa size */}
      <AlertDialog 
        open={isSizeDeleteDialogOpen} 
        onOpenChange={(open) => {
          setIsSizeDeleteDialogOpen(open);
          if (!open) {
            setSelectedSize(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa kích thước</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa kích thước{" "}
              <strong>{selectedSize?.name}</strong>? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteSize}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
