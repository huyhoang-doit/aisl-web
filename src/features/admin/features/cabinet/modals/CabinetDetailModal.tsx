import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Plus, Pencil, Trash2, Hash, Activity, MapPin, Calendar, Info, Globe, Link2, RefreshCw, Plug } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import LockerTable from "../../locker/components/LockerTable";
import CreateOrUpdateLockerModal, { type LockerFormData } from "../../locker/modals/CreateOrUpdateLockerModal";
import LockerDetailModal from "../../locker/modals/LockerDetailModal";
import AssignLockerModal from "./AssignLockerModal";
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
import { cabinetService } from "../services/cabinet.service";
import { cabinetSetupService } from "@/features/staff/features/cabinetSetup/services/cabinetSetup.service";
import { deviceAttachmentService } from "@/features/admin/features/deviceAttachment/services/deviceAttachment.service";
import { toast } from "sonner";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
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
  const [isAssignLockerOpen, setIsAssignLockerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  const [lockerModalMode, setLockerModalMode] = useState<"create" | "update">("create");
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [isLoadingAttachments, setIsLoadingAttachments] = useState(false);

  const loadAttachments = useCallback(async () => {
    if (!open || !cabinet.id) return;
    try {
      setIsLoadingAttachments(true);
      const response = await deviceAttachmentService.getAll({
        cabinetId: cabinet.id,
        page: 1,
        limit: 100,
      });
      const items = response.data.deviceAttachments ?? response.data.items ?? response.data.content ?? response.data.data ?? [];
      setAttachments(items);
    } catch (error) {
      console.error("Error loading attachments:", error);
      setAttachments([]);
    } finally {
      setIsLoadingAttachments(false);
    }
  }, [open, cabinet.id]);

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
    loadAttachments();
  }, [loadLockers, loadAttachments]);

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

  const handleUnassignLocker = async (locker: Locker) => {
    try {
      await cabinetService.unassignLockers(cabinet.id, [locker.id]);
      toast.success(`Đã gỡ ngăn tủ ${locker.lockerLabel || locker.id} thành công`);
      loadLockers();
    } catch (error) {
      console.error("Error unassigning locker:", error);
      toast.error("Không gỡ được ngăn tủ");
    }
  };
  
  const handleResetSetup = async () => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa cài đặt cho cụm tủ "${cabinet.name}"? Toàn bộ slotIndex của các locker sẽ bị xóa và Location sẽ trở nên Inactive.`)) {
      return;
    }
    
    setIsResetting(true);
    try {
      const result = await cabinetSetupService.resetSetup(cabinet.id);
      if (result.success) {
        toast.success(result.message);
        // Refresh lockers and cabinet info if needed
        loadLockers();
        // Since we don't have a direct refetch for cabinet here, we might want to close or notify parent
        handleClose(true); // Close and signal change
      } else {
        toast.error("Không thể xóa cài đặt");
      }
    } catch (error) {
      console.error("Reset setup error:", error);
      toast.error("Đã xảy ra lỗi khi xóa cài đặt");
    } finally {
      setIsResetting(false);
    }
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
                <DialogDescription className="flex items-center gap-2 mt-1">
                  <Hash className="h-3.5 w-3.5" />
                  <span className="font-mono text-xs selection:bg-primary/20">{cabinet.id}</span>
                </DialogDescription>
              </div>
              <div className="flex items-center gap-3 mr-5">
                <Badge variant={cabinet.status === "ACTIVE" ? "success" : "secondary"}>
                  {cabinet.status === "ACTIVE" ? "Đang hoạt động" : (cabinet.status || "Chưa xác định")}
                </Badge>
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(cabinet)}
                    className="gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    Sửa
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
                    Xóa
                  </Button>
                )}
              <Button
                variant="destructive"
                size="sm"
                onClick={handleResetSetup}
                disabled={isResetting}
                className="gap-2"
              >
                {isResetting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Xóa Setup
              </Button>
            </div>
          </div>
        </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
            {/* Cột 1: Thông tin cơ sở & Vị trí */}
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="h-3 w-3" /> Địa điểm
                  </span>
                  <p className="text-sm font-medium">{cabinet.locationName || "Chưa gán địa điểm"}</p>
                  {cabinet.address && (
                    <p className="text-xs text-muted-foreground flex items-start gap-1 mt-1">
                      <span className="shrink-0">•</span> <span>{cabinet.address}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="h-3 w-3" /> Cấu hình
                  </span>
                  <p className="text-sm font-medium">
                    {cabinet.totalRows} Hàng × {cabinet.totalColumns} Cột
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Phiên bản firmware: {cabinet.firmwareVersion || "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="rounded-lg border border-border bg-muted/20 p-3">
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1.5">
                    <Globe className="h-3 w-3" /> Mạng
                  </span>
                  <div className="grid gap-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">MAC Address:</span>
                      <span className="font-mono font-medium">{cabinet.macAddress}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">IP Address:</span>
                      <span className="font-mono font-medium">{cabinet.ipAddress || "Trống"}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3">
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1.5">
                    <Calendar className="h-3 w-3" /> Thời gian
                  </span>
                  <div className="grid gap-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Ngày tạo:</span>
                      <span>
                        {cabinet.createdAt
                          ? format(new Date(cabinet.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })
                          : "---"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Cập nhật:</span>
                      <span>
                        {cabinet.updatedAt
                          ? format(new Date(cabinet.updatedAt), "dd/MM/yyyy HH:mm", { locale: vi })
                          : "---"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột 2: Thống kê nhanh hoặc trạng thái */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-4 mb-3">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Info className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold text-sm">Thống kê Cabinet</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-end border-b border-dashed pb-2">
                    <span className="text-xs text-muted-foreground">Tổng số locker</span>
                    <span className="text-lg font-bold">{(cabinet.totalRows || 0) * (cabinet.totalColumns || 0)}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-dashed pb-2">
                    <span className="text-xs text-muted-foreground">Locker đã tạo</span>
                    <span className="text-lg font-bold">{total}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-4 mb-3">
                  <div className="rounded-lg bg-success/10 p-2 text-success">
                    <Plug className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold text-sm">Thiết bị đi kèm ({attachments.length})</h4>
                </div>
                {isLoadingAttachments ? (
                  <div className="py-6 flex justify-center">
                    <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : attachments.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">Chưa gán thiết bị nào</p>
                ) : (
                  <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
                    {attachments.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2.5 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors">
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold">{item.name}</p>
                          <p className="font-mono text-[10px] text-muted-foreground">SN: {item.serialNumber}</p>
                        </div>
                        <Badge variant={item.isActive ? "success" : "secondary"} className="text-[10px] px-1.5 py-0">
                          {item.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-2" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Danh sách Locker</h3>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setIsAssignLockerOpen(true)}
                  className="gap-2 border-primary text-primary hover:bg-primary/5"
                >
                  <Link2 className="h-4 w-4" />
                  Gán tủ vào cụm tủ
                </Button>
                <Button size="sm" onClick={handleCreateLocker} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Thêm locker
                </Button>
              </div>
            </div>

            <LockerTable
              lockers={lockers}
              onEdit={handleEditLocker}
              onDelete={handleDeleteLocker}
              onViewDetails={handleViewLockerDetails}
              onUnassign={handleUnassignLocker}
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

      <AssignLockerModal
        open={isAssignLockerOpen}
        onOpenChange={setIsAssignLockerOpen}
        cabinet={cabinet}
        onSuccess={loadLockers}
      />

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
