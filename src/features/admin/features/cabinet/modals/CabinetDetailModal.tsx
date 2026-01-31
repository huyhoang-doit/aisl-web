import React, { useState, useEffect, useCallback } from "react";
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
import { lockerService } from "../../locker/services/locker.service";
import { toast } from "sonner";
import type { Cabinet } from "../types/cabinet.types";
import type { Locker } from "../../locker/types/locker.types";

interface CabinetDetailModalProps {
  open: boolean;
  /** Đóng modal: (false) hoặc cập nhật list khi edit từ detail: (updatedCabinet) */
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (open: boolean | Cabinet) => void;
  cabinet: Cabinet;
  // eslint-disable-next-line no-unused-vars
  onEdit?: (cabinet: Cabinet) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete?: (cabinet: Cabinet) => void;
}

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

  const loadLockers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await lockerService.getAll({
        cabinetId: cabinet.id,
        limit: 100,
      });
      setLockers(response.data.lockers || []);
    } catch (error) {
      console.error("Error loading lockers:", error);
      toast.error("Có lỗi xảy ra khi tải danh sách locker");
      setLockers([]);
    } finally {
      setIsLoading(false);
    }
  }, [cabinet.id]);

  useEffect(() => {
    if (!open) return;
    loadLockers();
  }, [open, loadLockers]);

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

  const confirmDeleteLocker = async () => {
    if (!selectedLocker?.id) return;
    try {
      await lockerService.delete(selectedLocker.id);
      setLockers(lockers.filter((l) => l.id !== selectedLocker.id));
      setIsDeleteDialogOpen(false);
      setSelectedLocker(null);
      setIsLockerDetailModalOpen(false);
      toast.success("Xóa locker thành công");
    } catch (error) {
      console.error("Error deleting locker:", error);
      toast.error("Có lỗi xảy ra khi xóa locker");
    }
  };

  const handleLockerSubmit = async (data: LockerFormData) => {
    const payload = {
      cabinetId: data.cabinetId,
      sizeId: data.sizeId,
      row: data.row,
      column: data.column,
      status: data.status,
      isActive: data.isActive,
    };
    try {
      if (lockerModalMode === "create") {
        const response = await lockerService.create(payload);
        setLockers([...lockers, response.data]);
        toast.success("Thêm locker thành công");
      } else {
        if (!selectedLocker?.id) return;
        const response = await lockerService.update(selectedLocker.id, payload);
        setLockers(
          lockers.map((l) => (l.id === selectedLocker.id ? response.data : l))
        );
        if (selectedLocker && isLockerDetailModalOpen) {
          setSelectedLocker(response.data);
        }
        toast.success("Cập nhật locker thành công");
      }
      setIsLockerModalOpen(false);
      setSelectedLocker(null);
    } catch (error) {
      console.error("Error saving locker:", error);
      toast.error("Có lỗi xảy ra khi thêm/cập nhật locker");
    }
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
                  MAC: {cabinet.macAddress} | IP: {cabinet.ipAddress} | Hàng: {cabinet.totalRows} × Cột: {cabinet.totalColumns}
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

          {(cabinet.firmwareVersion || cabinet.ipAddress) && (
            <div className="rounded-md border border-border bg-muted/50 p-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              {cabinet.ipAddress && <span>IP: <span className="font-mono">{cabinet.ipAddress}</span></span>}
              {cabinet.firmwareVersion && <span>Firmware: {cabinet.firmwareVersion}</span>}
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
        defaultCabinetId={cabinet.id}
      />

      {/* Locker Detail Modal */}
      {selectedLocker && (
        <LockerDetailModal
          open={isLockerDetailModalOpen}
          onOpenChange={(open) => {
            setIsLockerDetailModalOpen(open);
            if (!open) setSelectedLocker(null);
          }}
          locker={selectedLocker}
          onEdit={handleEditLocker}
          onDelete={handleDeleteLocker}
        />
      )}

      {/* Delete Locker Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa locker</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa locker{" "}
              <strong>
              {selectedLocker?.code ||
                `Hàng ${selectedLocker?.row} - Cột ${selectedLocker?.column}`}
            </strong>
            ? Hành động này không thể hoàn tác.
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