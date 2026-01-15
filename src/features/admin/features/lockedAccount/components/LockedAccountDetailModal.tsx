import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Separator } from "@/shared/components/ui/separator"
import { Calendar, Mail, Phone, Lock, User, AlertCircle } from "lucide-react"
import type { LockedAccount } from "../types/lockedAccount.types"

interface LockedAccountDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  account: LockedAccount | null
  onUnlock?: (account: LockedAccount) => void
}

export function LockedAccountDetailModal({
  open,
  onOpenChange,
  account,
  onUnlock,
}: LockedAccountDetailModalProps) {
  if (!account) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết tài khoản đã khóa</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về tài khoản đã bị khóa trong hệ thống
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <Badge variant="destructive">
              <Lock className="h-3 w-3 mr-1" />
              Đã khóa
            </Badge>
            {account.lockedAt && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Ngày khóa: {new Date(account.lockedAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
            )}
          </div>

          <Separator />

          {/* Thông tin cơ bản */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Thông tin tài khoản
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <div className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Họ và tên
                </div>
                <div className="text-sm text-muted-foreground">{account.name}</div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
                <div className="text-sm text-muted-foreground">{account.email}</div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Số điện thoại
                </div>
                <div className="text-sm text-muted-foreground">{account.phone}</div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium">Vai trò</div>
                <div className="text-sm text-muted-foreground">
                  {account.role === "admin" ? "Quản trị viên" : "Nhân viên"}
                </div>
              </div>
            </div>
          </div>

          {/* Lock Information */}
          <Separator />
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Thông tin khóa
            </h3>
            <div className="space-y-2">
              {account.lockedReason && (
                <div className="space-y-1">
                  <div className="text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Lý do khóa
                  </div>
                  <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                    {account.lockedReason}
                  </div>
                </div>
              )}
              {account.lockedBy && (
                <div className="text-sm">
                  <span className="font-medium">Người khóa: </span>
                  <span className="text-muted-foreground">{account.lockedBy}</span>
                </div>
              )}
            </div>
          </div>

          {/* Unlock Request */}
          {account.unlockRequested && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="text-sm font-medium">Yêu cầu mở khóa</div>
                {account.unlockRequestDate && (
                  <div className="text-sm text-muted-foreground">
                    Ngày yêu cầu: {new Date(account.unlockRequestDate).toLocaleDateString("vi-VN")}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Đóng
          </Button>
          {onUnlock && (
            <Button
              type="button"
              onClick={() => onUnlock(account)}
            >
              Mở khóa tài khoản
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default LockedAccountDetailModal
