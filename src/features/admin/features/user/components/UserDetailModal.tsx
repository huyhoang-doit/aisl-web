import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { Lock, Pencil } from "lucide-react";
import type { User, UserStatusValue } from "../types/user.types";
import { getUserStatusDisplay } from "../types/user.types";
import { roles } from "@/shared/configs/role";

const STATUS_CONFIG: Record<
  UserStatusValue,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  ACTIVE: { label: "Hoạt động", variant: "default" },
  INACTIVE: { label: "Không hoạt động", variant: "secondary" },
  BLOCKED: { label: "Đã khóa", variant: "destructive" },
};

interface UserDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean | User) => void;
  user: User;
  onEdit?: (user: User) => void;
  onLock?: (user: User) => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  open,
  onOpenChange,
  user,
  onEdit,
  onLock,
}) => {
  const statusValue = getUserStatusDisplay(user.status);
  const statusInfo = STATUS_CONFIG[statusValue];
  const roleLabel = user.role === roles.ADMIN ? "Quản trị viên" : "Nhân viên";
  const isLocked = statusValue === "BLOCKED";   
  
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (typeof isOpen === "boolean") onOpenChange(isOpen);
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">{user.fullName}</DialogTitle>
              <DialogDescription>
                Chi tiết thông tin người dùng
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2 mr-5">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(user)}
                  className="gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Sửa
                </Button>
              )}
              {onLock && !isLocked && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onLock(user)}
                  className="gap-2"
                >
                  <Lock className="h-4 w-4" />
                  Khóa tài khoản
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Vai trò:</span>
              <Badge variant="outline" className="ml-2">
                {roleLabel}
              </Badge>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Trạng thái:</span>
              <Badge variant={statusInfo.variant} className="ml-2">
                {statusInfo.label}
              </Badge>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Xác minh:</span>
              <Badge variant={user.isVerified ? "default" : "secondary"} className="ml-2">
                {user.isVerified ? "Đã xác minh" : "Chưa xác minh"}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Thông tin cơ bản
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <span className="text-sm text-muted-foreground">Họ và tên:</span>
                <p className="font-medium">{user.fullName}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Email:</span>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  Số điện thoại:
                </span>
                <p className="font-medium">{user.phoneNumber}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Vai trò:</span>
                <p className="font-medium">{roleLabel}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Trạng thái:</span>
                <p className="font-medium">{statusInfo.label}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Keycloak ID:</span>
                <p className="font-medium font-mono text-sm">{user.keycloakUserId}</p>
              </div>
            </div>
          </div>

          {(user.createdAt || user.updatedAt) && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Thông tin hệ thống
                </h3>
                <div className="grid gap-2 text-sm">
                  {user.createdAt && (
                    <div>
                      <span className="text-muted-foreground">Ngày tạo:</span>{" "}
                      <span className="font-medium">
                        {new Date(user.createdAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  )}
                  {user.updatedAt && (
                    <div>
                      <span className="text-muted-foreground">
                        Cập nhật lần cuối:
                      </span>{" "}
                      <span className="font-medium">
                        {new Date(user.updatedAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailModal;
