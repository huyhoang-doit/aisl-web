import React, { useState, useEffect, useCallback, useMemo } from "react";
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

const DEFAULT_PAGE_SIZE = 10;

const CabinetDetailModal: React.FC<CabinetDetailModalProps> = ({
  open,
  onOpenChange,
  cabinet,
  onEdit,
  onDelete,
}) => {
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLockerModalOpen, setIsLockerModalOpen] = useState(false);
  const [isLockerDetailModalOpen, setIsLockerDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  const [lockerModalMode, setLockerModalMode] = useState<"create" | "update">("create");
  const [isLoading, setIsLoading] = useState(false);

  const loadLockers = useCallback(async () => {
    if (!open || !cabinet.id) return;
    try {
      setIsLoading(true);
      const response = await lockerService.getLockerCabinet(cabinet.id, {
        page,
        limit: pageSize,
        ...(searchQuery.trim() ? { search: searchQuery.trim() } : {}),
      });
      setLockers(response.data.lockers ?? []);
      setTotal(response.data.pagination?.total ?? 0);
    } catch (error) {
      console.error("Error loading lockers:", error);
      toast.error("Không tải được danh sách locker");
      setLockers([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [open, cabinet.id, page, pageSize, searchQuery]);

  useEffect(() => {
    loadLockers();
  }, [loadLockers]);

  const handleClose = (value: boolean | Cabinet) => {
    if (typeof onOpenChange === "function") {
      onOpenChange(value);
    }
  };

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
      toast.success("Đã xóa locker");
      setIsDeleteDialogOpen(false);
      setSelectedLocker(null);
      loadLockers();
    } catch (error) {
      console.error("Error deleting locker:", error);
      toast.error("Không xóa được locker");
    }
  };

  const handleLockerSubmit = async (data: LockerFormData) => {
    const payload = {
      cabinetId: data.cabinetId || cabinet.id,
      sizeId: data.sizeId,
      row: data.row,
      column: data.column,
      status: data.status,
      isActive: data.isActive,
    };
    try {
      if (lockerModalMode === "create") {
        await lockerService.create(payload);
        toast.success("Đã thêm locker");
      } else if (selectedLocker?.id) {
        await lockerService.update(selectedLocker.id, payload);
        toast.success("Đã cập nhật locker");
      }
      setIsLockerModalOpen(false);
      setSelectedLocker(null);
      loadLockers();
    } catch (error) {
      console.error("Error saving locker:", error);
      toast.error(lockerModalMode === "create" ? "Không tạo được locker" : "Không cập nhật được locker");
      throw error;
    }
  };

  const handleViewLockerDetails = (locker: Locker) => {
    setSelectedLocker(locker);
    setIsLockerDetailModalOpen(true);
  };

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  }, []);

  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q);
    setPage(1);
  }, []);

  const paginationConfig = useMemo(
    () => ({
      page,
      pageSize,
      total,
      onPageChange: handlePageChange,
      onPageSizeChange: handlePageSizeChange,
      pageSizeOptions: [5, 10, 20] as number[],
    }),
    [page, pageSize, total, handlePageChange, handlePageSizeChange]
  );

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
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
                    onClick={() => onEdit(cabinet)}
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
                    onClick={() => onDelete(cabinet)}
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
              {/* <Button onClick={handleCreateLocker} className="gap-2">
                <Plus className="h-4 w-4" />
                Thêm locker
              </Button> */}
            </div>

            <LockerTable
              lockers={lockers}
              onEdit={handleEditLocker}
              onDelete={handleDeleteLocker}
              onViewDetails={handleViewLockerDetails}
              isLoading={isLoading}
              pagination={paginationConfig}
              searchable
              searchPlaceholder="Tìm theo mã, vị trí locker..."
              onSearch={handleSearch}
            />
          </div>
        </DialogContent>
      </Dialog>

      <CreateOrUpdateLockerModal
        open={isLockerModalOpen}
        onOpenChange={setIsLockerModalOpen}
        lockerData={selectedLocker}
        onSubmit={handleLockerSubmit}
        mode={lockerModalMode}
        defaultCabinetId={cabinet.id}
      />

      {selectedLocker && (
        <LockerDetailModal
          open={isLockerDetailModalOpen}
          onOpenChange={(v) => setIsLockerDetailModalOpen(typeof v === "boolean" ? v : false)}
          locker={selectedLocker}
          onEdit={handleEditLocker}
          onDelete={handleDeleteLocker}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
