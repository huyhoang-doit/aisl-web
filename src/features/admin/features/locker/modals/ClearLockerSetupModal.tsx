import { useMemo, useState } from "react";
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
import { Loader2, RefreshCw } from "lucide-react";
import CabinetSelector from "../../cabinet/components/CabinetSelector";
import LockerSelector from "../components/LockerSelector";
import { lockerService } from "../services/locker.service";
import { toast } from "sonner";

interface ClearLockerSetupModalProps {
  open: boolean;
  // eslint-disable-next-line no-unused-vars -- callback param for consumer
  onOpenChange: (nextOpen: boolean) => void;
  defaultCabinetId?: string;
  onSuccess?: () => void;
}

export default function ClearLockerSetupModal({
  open,
  onOpenChange,
  defaultCabinetId = "",
  onSuccess,
}: ClearLockerSetupModalProps) {
  const [selectedCabinetId, setSelectedCabinetId] = useState("");
  const [selectedLockerId, setSelectedLockerId] = useState("");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const cabinetId = useMemo(
    () => selectedCabinetId || defaultCabinetId,
    [selectedCabinetId, defaultCabinetId]
  );

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSelectedCabinetId("");
      setSelectedLockerId("");
      setIsConfirmDialogOpen(false);
      setIsClearing(false);
    }
    onOpenChange(nextOpen);
  };

  const handleOpenConfirm = () => {
    if (!selectedLockerId) {
      toast.error("Vui lòng chọn locker cần clear setup");
      return;
    }
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmClearSetup = async () => {
    if (!selectedLockerId) return;

    try {
      setIsClearing(true);
    //   await lockerService.clearSetup(selectedLockerId);
      toast.success("Clear setup locker thành công -dev");
      setIsConfirmDialogOpen(false);
      handleClose(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error clearing locker setup:", error);
      toast.error("Có lỗi xảy ra khi clear setup locker");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Clear setup locker</DialogTitle>
            <DialogDescription>
              Chọn locker cần clear setup trước khi thực hiện thao tác.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Cabinet</p>
              <CabinetSelector
                value={selectedCabinetId}
                onValueChange={(value) => {
                  setSelectedCabinetId(value);
                  setSelectedLockerId("");
                }}
                placeholder="Chọn cabinet"
                allowClear={true}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Locker</p>
              <LockerSelector
                value={selectedLockerId}
                onValueChange={setSelectedLockerId}
                placeholder="Chọn locker cần clear setup"
                cabinetId={cabinetId || undefined}
                allowClear={false}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => handleClose(false)}
                disabled={isClearing}
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                onClick={handleOpenConfirm}
                disabled={!selectedLockerId || isClearing}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear setup
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận clear setup locker</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn clear setup locker đã chọn? Hành động này sẽ
              xóa cấu hình setup hiện tại của locker.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isClearing}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmClearSetup}
              disabled={isClearing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isClearing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang clear...
                </>
              ) : (
                "Xác nhận clear"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}