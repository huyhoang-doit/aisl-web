import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import LockerTable from "../../locker/components/LockerTable";
import CreateOrUpdateLockerModal, { type LockerFormData } from "../../locker/modals/CreateOrUpdateLockerModal";
import LockerDetailModal from "../../locker/modals/LockerDetailModal";
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
import type { Cabinet } from "../types/cabinet.types";
import type { Locker } from "../../locker/types/locker.types";

interface CabinetDetailModalProps {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (open: boolean) => void;
  cabinet: Cabinet;
  // eslint-disable-next-line no-unused-vars
  onEdit?: (cabinet: Cabinet) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete?: (cabinet: Cabinet) => void;
}

// Mock data - Thay thế bằng API call thực tế
const getMockLockers = (cabinetId: string): Locker[] => [
  {
    id: "1",
    cabinetId,
    code: "L001",
    size: "small",
    status: "available",
    price: 50000,
    description: "Locker nhỏ, phù hợp cho đồ nhẹ",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    cabinetId,
    code: "L002",
    size: "medium",
    status: "occupied",
    price: 80000,
    description: "Locker vừa",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    cabinetId,
    code: "L003",
    size: "large",
    status: "available",
    price: 120000,
    description: "Locker lớn, phù hợp cho đồ cồng kềnh",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const CabinetDetailModal: React.FC<CabinetDetailModalProps> = ({
  open,
  onOpenChange,
  cabinet,
  onEdit,
  onDelete,
}) => {
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [isLockerModalOpen, setIsLockerModalOpen] = useState(false);
  const [isLockerDetailModalOpen, setIsLockerDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  const [lockerModalMode, setLockerModalMode] = useState<"create" | "update">("create");
  const [isLoading, setIsLoading] = useState(false);

  // Load lockers when modal opens
  useEffect(() => {
    if (!open) return;
    
    let cancelled = false;
    // Setting loading state at the start of effect is acceptable pattern
    setTimeout(() => {
      setIsLoading(true);
    }, 100);
    
    // Simulate API call
    const timeoutId = setTimeout(() => {
      if (!cancelled) {
        const mockData = getMockLockers(cabinet.id);
        setLockers(mockData);
        setIsLoading(false);
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [open, cabinet.id]);

  const handleCreateLocker = () => {
    setSelectedLocker(null);
    setLockerModalMode("create");
    setIsLockerModalOpen(true);
  };

  const handleEditLocker = (locker: Locker) => {
    setSelectedLocker(locker);
    setLockerModalMode("update");
    setIsLockerModalOpen(true);
  };

  const handleDeleteLocker = (locker: Locker) => {
    setSelectedLocker(locker);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteLocker = () => {
    if (selectedLocker?.id) {
      setLockers(lockers.filter((l) => l.id !== selectedLocker.id));
      setIsDeleteDialogOpen(false);
      setSelectedLocker(null);
      // TODO: Gọi API để xóa locker
      console.log("Deleting locker:", selectedLocker);
    }
  };

  const handleLockerSubmit = async (data: LockerFormData) => {
    if (lockerModalMode === "create") {
      const newLocker: Locker = {
        ...data,
        id: Date.now().toString(),
        cabinetId: cabinet.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setLockers([...lockers, newLocker]);
      // TODO: Gọi API để tạo locker
      console.log("Creating locker:", newLocker);
    } else {
      setLockers(
        lockers.map((l) =>
          l.id === selectedLocker?.id
            ? { ...data, id: l.id, cabinetId: l.cabinetId, createdAt: l.createdAt, updatedAt: new Date().toISOString() }
            : l
        )
      );
      // TODO: Gọi API để cập nhật locker
      console.log("Updating locker:", data);
    }
    setIsLockerModalOpen(false);
    setSelectedLocker(null);
  };

  const handleViewLockerDetails = (locker: Locker) => {
    setSelectedLocker(locker);
    setIsLockerDetailModalOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-xl font-bold">{cabinet.name}</DialogTitle>
                <DialogDescription>
                  Mã: {cabinet.code} | Tổng: {cabinet.totalLockers} | Trống: {cabinet.availableLockers}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2 mr-5">
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (onEdit) {
                        onEdit(cabinet);
                      }
                    }}
                    className="gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    Sửa cabinet
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (onDelete) {
                        onDelete(cabinet);
                      }
                    }}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Xóa cabinet
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>

          {cabinet.description && (
            <div className="rounded-md border border-border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">{cabinet.description}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Danh sách Locker</h3>
              <Button onClick={handleCreateLocker} className="gap-2">
                <Plus className="h-4 w-4" />
                Thêm locker
              </Button>
            </div>

            <LockerTable
              lockers={lockers}
              onEdit={handleEditLocker}
              onDelete={handleDeleteLocker}
              onViewDetails={handleViewLockerDetails}
              // onCreate={handleCreateLocker}
              isLoading={isLoading}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Locker Modal */}
      <CreateOrUpdateLockerModal
        open={isLockerModalOpen}
        onOpenChange={setIsLockerModalOpen}
        lockerData={selectedLocker}
        onSubmit={handleLockerSubmit}
        mode={lockerModalMode}
        cabinetId={cabinet.id}
      />

      {/* Locker Detail Modal */}
      {selectedLocker && (
        <LockerDetailModal
          open={isLockerDetailModalOpen}
          onOpenChange={setIsLockerDetailModalOpen}
          locker={selectedLocker}
        />
      )}

      {/* Delete Locker Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa locker</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa locker{" "}
              <strong>{selectedLocker?.code}</strong>? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteLocker}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CabinetDetailModal;