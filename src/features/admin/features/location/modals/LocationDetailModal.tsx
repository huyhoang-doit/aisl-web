import React, { useState, useEffect } from "react";
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

// Mock data - Thay thế bằng API call thực tế
const getMockCabinets = (locationId: string): Cabinet[] => [
  {
    id: "1",
    locationId,
    name: "Cabinet A1",
    code: "CAB-A1",
    description: "Cabinet đầu tiên tại địa điểm này",
    totalLockers: 20,
    availableLockers: 15,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    locationId,
    name: "Cabinet A2",
    code: "CAB-A2",
    description: "Cabinet thứ hai tại địa điểm này",
    totalLockers: 20,
    availableLockers: 8,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    locationId,
    name: "Cabinet B1",
    code: "CAB-B1",
    description: "Cabinet đang bảo trì",
    totalLockers: 15,
    availableLockers: 0,
    status: "maintenance",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const LocationDetailModal: React.FC<LocationDetailModalProps> = ({
  open,
  onOpenChange,
  location,
  onEdit,
  onDelete,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
}) => {
  const [cabinets, setCabinets] = useState<Cabinet[]>([]);
  const [isCabinetModalOpen, setIsCabinetModalOpen] = useState(false);
  const [isCabinetDetailModalOpen, setIsCabinetDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCabinet, setSelectedCabinet] = useState<Cabinet | null>(null);
  const [cabinetModalMode, setCabinetModalMode] = useState<"create" | "update">("create");
  const [isLoading, setIsLoading] = useState(false);

  // Load cabinets when modal opens
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
        const mockData = getMockCabinets(location.id);
        setCabinets(mockData);
        setIsLoading(false);
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [open, location.id]);

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

  const confirmDeleteCabinet = () => {
    if (selectedCabinet?.id) {
      setCabinets(cabinets.filter((c) => c.id !== selectedCabinet.id));
      setIsDeleteDialogOpen(false);
      setSelectedCabinet(null);
      // TODO: Gọi API để xóa cabinet
      console.log("Deleting cabinet:", selectedCabinet);
    }
  };

  const handleCabinetSubmit = async (data: CabinetFormData) => {
    if (cabinetModalMode === "create") {
      const newCabinet: Cabinet = {
        ...data,
        id: Date.now().toString(),
        locationId: location.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCabinets([...cabinets, newCabinet]);
      // TODO: Gọi API để tạo cabinet
      console.log("Creating cabinet:", newCabinet);
    } else {
      setCabinets(
        cabinets.map((c) =>
          c.id === selectedCabinet?.id
            ? { ...data, id: c.id, locationId: c.locationId, createdAt: c.createdAt, updatedAt: new Date().toISOString() }
            : c
        )
      );
      // TODO: Gọi API để cập nhật cabinet
      console.log("Updating cabinet:", data);
    }
    setIsCabinetModalOpen(false);
    setSelectedCabinet(null);
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
              <Button onClick={handleCreateCabinet} className="gap-2">
                <Plus className="h-4 w-4" />
                Thêm cabinet
              </Button>
            </div>

            <CabinetTable
              cabinets={cabinets}
              onEdit={handleEditCabinet}
              onDelete={handleDeleteCabinet}
              onViewDetails={handleViewCabinetDetails}
              isLoading={isLoading}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Cabinet Modal */}
      <CreateOrUpdateCabinetModal
        open={isCabinetModalOpen}
        onOpenChange={setIsCabinetModalOpen}
        cabinetData={selectedCabinet}
        onSubmit={handleCabinetSubmit}
        mode={cabinetModalMode}
        locationId={location.id}
      />

      {/* Cabinet Detail Modal */}
      {selectedCabinet && (
        <CabinetDetailModal
          open={isCabinetDetailModalOpen}
          onOpenChange={setIsCabinetDetailModalOpen}
          cabinet={selectedCabinet}
          onEdit={handleEditCabinet}
          onDelete={handleDeleteCabinet}
        />
      )}

      {/* Delete Cabinet Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa cabinet</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa cabinet{" "}
              <strong>{selectedCabinet?.name}</strong> ({selectedCabinet?.code})? 
              Hành động này không thể hoàn tác. Tất cả các locker trong cabinet này cũng sẽ bị xóa.
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
