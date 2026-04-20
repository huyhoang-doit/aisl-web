import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";
import CabinetTable from "../../cabinet/components/CabinetTable";
import CabinetDetailModal from "../../cabinet/modals/CabinetDetailModal";
import CreateOrUpdateCabinetModal, { type CabinetFormData } from "../../cabinet/modals/CreateOrUpdateCabinetModal";
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
import type { Location } from "../../location/types/location.types";
import type { Cabinet } from "../../cabinet/types/cabinet.types";
import { locationService } from "../services/location.service";
import { cabinetService } from "../../cabinet/services/cabinet.service";
import { toast } from "sonner";

interface LocationDetailModalProps {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (open: boolean | Location) => void;
  location: Location;
  // eslint-disable-next-line no-unused-vars
  onEdit?: (location: Location) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete?: (location: Location) => void;
  // eslint-disable-next-line no-unused-vars
  onUpdateLocation?: (location: Location) => void;
}

const DEFAULT_PAGE_SIZE = 10;

const LocationDetailModal: React.FC<LocationDetailModalProps> = ({
  open,
  onOpenChange,
  location,
  onEdit,
  onDelete,
}) => {
  const [cabinets, setCabinets] = useState<Cabinet[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCabinetModalOpen, setIsCabinetModalOpen] = useState(false);
  const [isCabinetDetailModalOpen, setIsCabinetDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCabinet, setSelectedCabinet] = useState<Cabinet | null>(null);
  const [cabinetModalMode, setCabinetModalMode] = useState<"create" | "update">("create");
  const [isLoading, setIsLoading] = useState(false);

  const loadCabinets = useCallback(async () => {
    if (!open || !location.id) return;
    try {
      setIsLoading(true);
      const response = await locationService.getCabinetLocation(location.id, {
        page,
        limit: pageSize,
        ...(searchQuery.trim() ? { search: searchQuery.trim() } : {}),
      });
      setCabinets(response.data.cabinets ?? []);
      setTotal(response.data.pagination?.total ?? 0);
    } catch (error) {
      console.error("Error loading cabinets:", error);
      toast.error("Không tải được danh sách cabinet");
      setCabinets([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [open, location.id, page, pageSize, searchQuery]);

  useEffect(() => {
    loadCabinets();
  }, [loadCabinets]);

  const handleClose = () => {
    if (typeof onOpenChange === "function") {
      onOpenChange(false);
    }
  };

  const handleCreateCabinet = () => {
    setSelectedCabinet(null);
    setCabinetModalMode("create");
    setIsCabinetModalOpen(true);
  };

  const handleEditCabinet = (cabinet: Cabinet) => {
    setSelectedCabinet(cabinet);
    setCabinetModalMode("update");
    setIsCabinetModalOpen(true);
  };

  const handleDeleteCabinet = (cabinet: Cabinet) => {
    setSelectedCabinet(cabinet);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteCabinet = async () => {
    if (!selectedCabinet?.id) return;
    try {
      await cabinetService.delete(selectedCabinet.id);
      toast.success("Đã xóa cabinet");
      setIsDeleteDialogOpen(false);
      setSelectedCabinet(null);
      loadCabinets();
    } catch (error) {
      console.error("Error deleting cabinet:", error);
      toast.error("Không xóa được cabinet");
    }
  };

  const handleCabinetSubmit = async (data: CabinetFormData) => {
    try {
      if (cabinetModalMode === "create") {
        await cabinetService.create({
          ...data,
          locationId: location.id,
        });
        toast.success("Đã thêm cabinet");
      } else if (selectedCabinet?.id) {
        await cabinetService.update(selectedCabinet.id, {
          ...data,
          locationId: data.locationId || location.id,
        });
        toast.success("Đã cập nhật cabinet");
      }
      setIsCabinetModalOpen(false);
      setSelectedCabinet(null);
      loadCabinets();
    } catch (error) {
      console.error("Error saving cabinet:", error);
      toast.error(cabinetModalMode === "create" ? "Không tạo được cabinet" : "Không cập nhật được cabinet");
      throw error;
    }
  };

  const handleViewCabinetDetails = (cabinet: Cabinet) => {
    setSelectedCabinet(cabinet);
    setIsCabinetDetailModalOpen(true);
  };

  const handleEditLocation = () => {
    if (onEdit) {
      onEdit(location);
      handleClose();
    }
  };

  const handleDeleteLocation = () => {
    if (onDelete) {
      onDelete(location);
      handleClose();
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
                <DialogTitle className="text-xl font-bold">{location.name}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 mt-2">
                  <MapPin className="h-4 w-4" />
                  <span>{location.address}</span>
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2 mr-5">
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditLocation}
                    className="gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    Sửa địa điểm
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteLocation}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Xóa địa điểm
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>

          {location.description && (
            <div className="rounded-md border border-border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">{location.description}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Danh sách Cabinet</h3>
              {/* <Button onClick={handleCreateCabinet} className="gap-2">
                <Plus className="h-4 w-4" />
                Thêm cabinet
              </Button> */}
            </div>

            <CabinetTable
              cabinets={cabinets}
              onEdit={handleEditCabinet}
              onDelete={handleDeleteCabinet}
              onViewDetails={handleViewCabinetDetails}
              isLoading={isLoading}
              pagination={paginationConfig}
              searchable
              searchPlaceholder="Tìm theo tên cabinet..."
              onSearch={handleSearch}
            />
          </div>
        </DialogContent>
      </Dialog>

      <CreateOrUpdateCabinetModal
        open={isCabinetModalOpen}
        onOpenChange={setIsCabinetModalOpen}
        cabinetData={selectedCabinet}
        onSubmit={handleCabinetSubmit}
        mode={cabinetModalMode}
        defaultLocationId={location.id}
      />

      {selectedCabinet && (
        <CabinetDetailModal
          open={isCabinetDetailModalOpen}
          onOpenChange={(v) => setIsCabinetDetailModalOpen(typeof v === "boolean" ? v : false)}
          cabinet={selectedCabinet}
          onEdit={handleEditCabinet}
          onDelete={handleDeleteCabinet}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa cabinet</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa cabinet{" "}
              <strong>{selectedCabinet?.name}</strong>? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteCabinet}
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

export default LocationDetailModal;
