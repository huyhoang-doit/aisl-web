import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
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
import { Star, Calendar, DollarSign, User, MessageSquare, Unlock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import type { LockerArea, Transaction, Review } from "../types/lockerArea.types";

interface LockerAreaDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lockerArea: LockerArea;
  onStatusUpdate?: (lockerId: string, newStatus: LockerArea["status"]) => Promise<void> | void;
  onEmergencyOpen?: (lockerId: string) => Promise<void> | void;
}

// Mock data - Thay thế bằng API call thực tế
const mockTransactions: Transaction[] = [
  {
    id: "1",
    lockerId: "1",
    userId: "u1",
    userName: "Nguyễn Văn A",
    type: "rent",
    amount: 50000,
    status: "completed",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    description: "Thuê locker tháng 1",
  },
  {
    id: "2",
    lockerId: "1",
    userId: "u1",
    userName: "Nguyễn Văn A",
    type: "extend",
    amount: 50000,
    status: "completed",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    description: "Gia hạn thêm 1 tháng",
  },
  {
    id: "3",
    lockerId: "1",
    userId: "u2",
    userName: "Trần Thị B",
    type: "rent",
    amount: 50000,
    status: "completed",
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    description: "Thuê locker tháng 1",
  },
];

const mockReviews: Review[] = [
  {
    id: "1",
    lockerId: "1",
    userId: "u1",
    userName: "Nguyễn Văn A",
    rating: 5,
    comment: "Locker rất tốt, sạch sẽ và an toàn. Rất hài lòng với dịch vụ!",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "2",
    lockerId: "1",
    userId: "u2",
    userName: "Trần Thị B",
    rating: 4,
    comment: "Tốt nhưng giá hơi cao một chút. Dịch vụ ổn.",
    createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
  },
  {
    id: "3",
    lockerId: "1",
    userId: "u3",
    userName: "Lê Văn C",
    rating: 5,
    comment: "Tuyệt vời! Sẽ tiếp tục sử dụng.",
    createdAt: new Date(Date.now() - 86400000 * 40).toISOString(),
  },
];

const LockerAreaDetailModal: React.FC<LockerAreaDetailModalProps> = ({
  open,
  onOpenChange,
  lockerArea,
  onStatusUpdate,
  onEmergencyOpen,
}) => {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [reviews] = useState<Review[]>(mockReviews);
  const [currentStatus, setCurrentStatus] = useState<LockerArea["status"]>(lockerArea.status);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isEmergencyDialogOpen, setIsEmergencyDialogOpen] = useState(false);
  const [isOpeningDoor, setIsOpeningDoor] = useState(false);
  const [isStatusChangeDialogOpen, setIsStatusChangeDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<LockerArea["status"] | null>(null);

  // Cập nhật currentStatus khi lockerArea thay đổi
  useEffect(() => {
    setCurrentStatus(lockerArea.status);
  }, [lockerArea.status]);

  const sizeConfig = {
    small: { label: "Nhỏ", variant: "secondary" as const },
    medium: { label: "Vừa", variant: "default" as const },
    large: { label: "Lớn", variant: "default" as const },
  };

  const statusConfig = {
    available: { label: "Trống", variant: "default" as const },
    occupied: { label: "Đã thuê", variant: "secondary" as const },
    maintenance: { label: "Bảo trì", variant: "destructive" as const },
    reserved: { label: "Đã đặt", variant: "outline" as const },
  };

  const transactionTypeConfig = {
    rent: { label: "Thuê", variant: "default" as const },
    extend: { label: "Gia hạn", variant: "secondary" as const },
    cancel: { label: "Hủy", variant: "destructive" as const },
    refund: { label: "Hoàn tiền", variant: "outline" as const },
  };

  const transactionStatusConfig = {
    pending: { label: "Đang xử lý", variant: "outline" as const },
    completed: { label: "Hoàn thành", variant: "default" as const },
    failed: { label: "Thất bại", variant: "destructive" as const },
    cancelled: { label: "Đã hủy", variant: "secondary" as const },
  };

  const sizeInfo = sizeConfig[lockerArea.size || "medium"];
  const statusInfo = statusConfig[currentStatus || "available"];

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  // Xử lý chọn trạng thái mới (mở dialog xác nhận)
  const handleStatusSelect = (newStatus: LockerArea["status"]) => {
    if (newStatus === currentStatus) return;
    setPendingStatus(newStatus);
    setIsStatusChangeDialogOpen(true);
  };

  // Xử lý cập nhật trạng thái (sau khi xác nhận)
  const handleConfirmStatusChange = async () => {
    if (!pendingStatus) return;

    setIsUpdatingStatus(true);
    try {
      if (onStatusUpdate) {
        await onStatusUpdate(lockerArea.id, pendingStatus);
      }
      setCurrentStatus(pendingStatus);
      toast.success("Cập nhật trạng thái thành công");
      setIsStatusChangeDialogOpen(false);
      setPendingStatus(null);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Xử lý mở cửa khẩn cấp
  const handleEmergencyOpen = async () => {
    setIsOpeningDoor(true);
    try {
      if (onEmergencyOpen) {
        await onEmergencyOpen(lockerArea.id);
      }
      toast.success("Đã mở cửa locker thành công");
      setIsEmergencyDialogOpen(false);
    } catch (error) {
      console.error("Error opening door:", error);
      toast.error("Có lỗi xảy ra khi mở cửa");
    } finally {
      setIsOpeningDoor(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto flex flex-col justify-start">
        <DialogHeader className="border-b border-primary/20 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">{lockerArea.code}</DialogTitle>
              <DialogDescription>Chi tiết thông tin locker area</DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {/* Cập nhật trạng thái */}
              <Select
                value={currentStatus}
                onValueChange={(value) => handleStatusSelect(value as LockerArea["status"])}
                disabled={isUpdatingStatus}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Trống</SelectItem>
                  <SelectItem value="occupied">Đã thuê</SelectItem>
                  <SelectItem value="maintenance">Bảo trì</SelectItem>
                  <SelectItem value="reserved">Đã đặt</SelectItem>
                </SelectContent>
              </Select>
              {/* Nút mở cửa khẩn cấp */}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsEmergencyDialogOpen(true)}
                disabled={isOpeningDoor}
                className="gap-2"
              >
                <Unlock className="h-4 w-4" />
                {isOpeningDoor ? "Đang mở..." : "Mở cửa"}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full h-full">
          <TabsList className="grid w-full grid-cols-3 bg-primary/10 border border-primary/20">
            <TabsTrigger 
              value="info"
              className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
            >
              Thông tin
            </TabsTrigger>
            <TabsTrigger 
              value="transactions"
              className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
            >
              Lịch sử giao dịch
            </TabsTrigger>
            <TabsTrigger 
              value="reviews"
              className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
            >
              Đánh giá
            </TabsTrigger>
          </TabsList>

          {/* Tab Thông tin */}
          <TabsContent value="info" className="space-y-6 mt-4 ">
            {/* Status Badges */}
            <div className="flex items-center gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Kích thước:</span>
                <Badge variant={sizeInfo.variant} className="ml-2">
                  {sizeInfo.label}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Trạng thái:</span>
                <Badge variant={statusInfo.variant} className="ml-2">
                  {statusInfo.label}
                </Badge>
              </div>
            </div>


            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Thông tin cơ bản
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <span className="text-sm text-muted-foreground">Mã locker:</span>
                  <p className="font-medium">{lockerArea.code}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Giá thuê:</span>
                  <p className="font-medium">
                    {lockerArea.price
                      ? `${lockerArea.price.toLocaleString("vi-VN")} đ/tháng`
                      : "Chưa có"}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {lockerArea.description && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Mô tả
                  </h3>
                  <p className="text-sm">{lockerArea.description}</p>
                </div>
              </>
            )}

            {/* Timestamps */}
            {(lockerArea.createdAt || lockerArea.updatedAt) && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Thông tin hệ thống
                  </h3>
                  <div className="grid gap-2 text-sm">
                    {lockerArea.createdAt && (
                      <div>
                        <span className="text-muted-foreground">Ngày tạo:</span>{" "}
                        <span className="font-medium">
                          {new Date(lockerArea.createdAt).toLocaleString("vi-VN")}
                        </span>
                      </div>
                    )}
                    {lockerArea.updatedAt && (
                      <div>
                        <span className="text-muted-foreground">Cập nhật lần cuối:</span>{" "}
                        <span className="font-medium">
                          {new Date(lockerArea.updatedAt).toLocaleString("vi-VN")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* Tab Lịch sử giao dịch */}
          <TabsContent value="transactions" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Lịch sử giao dịch ({transactions.length})
              </h3>
            </div>

            {transactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có giao dịch nào</p>
              </div>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Thời gian</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Số tiền</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Mô tả</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => {
                      const typeInfo = transactionTypeConfig[transaction.type];
                      const statusInfo = transactionStatusConfig[transaction.status];
                      return (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {new Date(transaction.createdAt).toLocaleString("vi-VN")}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>{transaction.userName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={typeInfo.variant}>{typeInfo.label}</Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {transaction.amount.toLocaleString("vi-VN")} đ
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {transaction.description || "-"}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Tab Đánh giá */}
          <TabsContent value="reviews" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Đánh giá từ khách hàng ({reviews.length})
              </h3>
              {reviews.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Đánh giá trung bình:</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{averageRating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">({reviews.length})</span>
                  </div>
                </div>
              )}
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có đánh giá nào</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <CardTitle className="text-base">{review.userName}</CardTitle>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    {review.comment && (
                      <CardContent>
                        <p className="text-sm">{review.comment}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>

      {/* Dialog xác nhận cập nhật trạng thái */}
      <AlertDialog open={isStatusChangeDialogOpen} onOpenChange={setIsStatusChangeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận cập nhật trạng thái</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn thay đổi trạng thái của locker{" "}
              <strong>{lockerArea.code}</strong> từ{" "}
              <strong>{statusConfig[currentStatus].label}</strong> sang{" "}
              <strong>
                {pendingStatus ? statusConfig[pendingStatus].label : ""}
              </strong>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isUpdatingStatus}
              onClick={() => {
                setPendingStatus(null);
              }}
            >
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmStatusChange}
              disabled={isUpdatingStatus}
            >
              {isUpdatingStatus ? "Đang xử lý..." : "Xác nhận"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog xác nhận mở cửa khẩn cấp */}
      <AlertDialog open={isEmergencyDialogOpen} onOpenChange={setIsEmergencyDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <AlertDialogTitle>Xác nhận mở cửa khẩn cấp</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-2">
              Bạn có chắc chắn muốn mở cửa locker <strong>{lockerArea.code}</strong> ngay bây giờ?
              <br />
              <span className="text-destructive font-medium">
                Hành động này chỉ nên được thực hiện trong trường hợp khẩn cấp.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isOpeningDoor}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEmergencyOpen}
              disabled={isOpeningDoor}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isOpeningDoor ? "Đang xử lý..." : "Xác nhận mở cửa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};

export default LockerAreaDetailModal;
