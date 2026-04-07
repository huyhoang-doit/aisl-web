import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Separator } from "@/shared/components/ui/separator";
import { Calendar, User as UserIcon, Package, Loader2 } from "lucide-react";
import type { Subscription } from "../types/subscription.types";
import { userService } from "@/features/admin/features/user/services/user.service";
import type { User } from "@/features/admin/features/user/types/user.types";
import UserRoleComponent from "@/features/admin/features/user/components/UserRoleComponent";
import StatusComponent from "@/shared/components/StatusComponent";

/* eslint-disable no-unused-vars -- callback param names in types are for signature only */
interface SubscriptionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: Subscription;
  onEdit?: (subscription: Subscription) => void;
  onDelete?: (subscription: Subscription) => void;
}
/* eslint-enable no-unused-vars */

const SubscriptionDetailModal: React.FC<SubscriptionDetailModalProps> = ({
  open,
  onOpenChange,
  subscription,
}) => {
  const [userDetail, setUserDetail] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);

  const formatDate = (dateStr?: string) => {
    if (!dateStr?.trim()) return "-";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  useEffect(() => {
    if (!open || !subscription.userId?.trim()) return;

    const userId = subscription.userId;
    let cancelled = false;

    queueMicrotask(() => {
      setUserLoading(true);
      setUserError(null);
    });

    userService
      .getDetail(userId)
      .then((res) => {
        if (!cancelled) {
          setUserDetail(res.data.user);
          setUserLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUserError("Không tải được thông tin người dùng");
          setUserDetail(null);
          setUserLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open, subscription.userId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">
                Đăng ký #{subscription.id.slice(0, 8)}...
              </DialogTitle>
              <DialogDescription className="mt-1">
                <StatusComponent status={subscription.status} />
              </DialogDescription>
            </div>
            {/* <div className="flex items-center gap-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(subscription)}
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
                  onClick={() => onDelete(subscription)}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa
                </Button>
              )}
            </div> */}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="rounded-md border border-border bg-muted/50 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <UserIcon className="h-4 w-4" />
              <span>Người dùng</span>
            </div>
            {userLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang tải thông tin...</span>
              </div>
            )}
            {userError && (
              <p className="text-sm text-destructive">{userError}</p>
            )}
            {!userLoading && !userError && userDetail && (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <span className="text-sm text-muted-foreground">Họ và tên:</span>
                  <p className="font-medium">{userDetail.fullName}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <p className="font-medium">{userDetail.email}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Số điện thoại:</span>
                  <p className="font-medium">{userDetail.phoneNumber}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Vai trò:</span>
                  <p className="font-medium">
                    <UserRoleComponent user={userDetail} />
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Trạng thái:</span>
                  <p className="font-medium">
                    <StatusComponent status={userDetail.status} />
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">ID:</span>
                  <p className="font-medium font-mono text-sm">
                    {userDetail.keycloakUserId ?? userDetail.id}
                  </p>
                </div>
              </div>
            )}
            {!userLoading && !userError && !userDetail && subscription.userId && (
              <p className="font-medium text-muted-foreground">
                User ID: {subscription.userId}
              </p>
            )}
          </div>

          <div className="rounded-md border border-border bg-muted/50 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>Gói dịch vụ</span>
            </div>
            <p className="font-medium">
              {subscription.plan?.name ?? `ID: ${subscription.plan?.id ?? subscription.planId ?? "-"}`}
            </p>
            {subscription.plan?.price != null && (
              <p className="text-sm text-muted-foreground">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(subscription.plan.price)}
              </p>
            )}
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Ngày bắt đầu</span>
              </div>
              <p className="font-medium">{formatDate(subscription.startDate)}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Ngày kết thúc</span>
              </div>
              <p className="font-medium">{formatDate(subscription.endDate)}</p>
            </div>
          </div>

          <Separator />
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            {subscription.createdAt && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  <strong>Tạo:</strong>{" "}
                  {new Date(subscription.createdAt).toLocaleString("vi-VN")}
                </span>
              </div>
            )}
            {subscription.updatedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  <strong>Cập nhật:</strong>{" "}
                  {new Date(subscription.updatedAt).toLocaleString("vi-VN")}
                </span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDetailModal;
