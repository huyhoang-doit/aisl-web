import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderAdminApi } from "../api/order.api";
import { toast } from "sonner";
import { Loader2, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
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

interface QuickHandleOrderProps {
    isOpen: boolean;
    onClose: () => void;
}

const QuickHandleOrderModal: React.FC<QuickHandleOrderProps> = ({ isOpen, onClose }) => {
    const queryClient = useQueryClient();
    const [orderId, setOrderId] = useState("");
    const [confirmType, setConfirmType] = useState<"CANCEL" | "COMPLETE" | null>(null);

    const cancelMutation = useMutation({
        mutationFn: (id: string) => orderAdminApi.forceCancelOrder(id),
        onSuccess: () => {
            toast.success("Hủy đơn hàng thành công");
            setOrderId("");
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            onClose();
        },
        onError: (error: any) => {
            toast.error(error?.message || "Hủy đơn hàng thất bại");
        },
    });

    const completeMutation = useMutation({
        mutationFn: (id: string) => orderAdminApi.forceCompleteOrder(id),
        onSuccess: () => {
            toast.success("Hoàn thành đơn hàng thành công");
            setOrderId("");
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            onClose();
        },
        onError: (error: any) => {
            toast.error(error?.message || "Hoàn thành đơn hàng thất bại");
        },
    });

    const handleAction = () => {
        if (!orderId) {
            toast.error("Vui lòng nhập ID đơn hàng");
            return;
        }
        if (confirmType === "CANCEL") {
            cancelMutation.mutate(orderId);
        } else if (confirmType === "COMPLETE") {
            completeMutation.mutate(orderId);
        }
        setConfirmType(null);
    };

    const isPending = cancelMutation.isPending || completeMutation.isPending;

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                            Thao tác nhanh cho đơn hàng
                        </DialogTitle>
                        <DialogDescription>
                            Thực hiện thay đổi trạng thái cưỡng bức cho đơn hàng khi gặp sự cố kĩ thuật.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                ID Đơn hàng (Quick ID)
                            </label>
                            <Input
                                placeholder="Nhập ID hệ thống (VD: 61f5d5aa...)"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                disabled={isPending}
                                className="font-mono"
                            />
                            <p className="text-[11px] text-muted-foreground italic">
                                * Thao tác này sẽ bỏ qua các ràng buộc nghiệp vụ thông thường.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <Button
                                variant="outline"
                                className="justify-start gap-2 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900/50 dark:hover:bg-red-900/20"
                                onClick={() => setConfirmType("CANCEL")}
                                disabled={isPending || !orderId}
                            >
                                <XCircle className="h-4 w-4" />
                                Hủy đơn hàng (Force Cancel)
                            </Button>

                            <Button
                                variant="outline"
                                className="justify-start gap-2 border-green-200 hover:bg-green-50 hover:text-green-600 dark:border-green-900/50 dark:hover:bg-green-900/20"
                                onClick={() => setConfirmType("COMPLETE")}
                                disabled={isPending || !orderId}
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                Hoàn thành đơn (Force Complete)
                            </Button>
                        </div>
                    </div>

                    <DialogFooter className="sm:justify-start">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800/30 w-full">
                            <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed">
                                <strong>Lưu ý:</strong> Chỉ sử dụng khi hệ thống IoT gặp sự cố không thể tự động cập nhật trạng thái đơn.
                            </p>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={confirmType !== null} onOpenChange={(val) => !val && setConfirmType(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận thao tác cưỡng bức?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn đang thực hiện {confirmType === "CANCEL" ? "HỦY" : "HOÀN THÀNH"} đơn hàng
                            <span className="font-mono font-bold mx-1 text-foreground">{orderId}</span>.
                            Hành động này không thể hoàn tác và sẽ ảnh hưởng đến dòng tiền/giao dịch của khách hàng.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleAction}
                            className={confirmType === "CANCEL" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Xác nhận thực hiện
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default QuickHandleOrderModal;
