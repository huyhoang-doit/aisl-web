import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { format } from "date-fns";
import type { Transaction, TransactionStatus, TransactionType } from "../types/transaction.types";

interface TransactionDetailModalProps {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (val: boolean) => void;
  transaction: Transaction;
}

const TYPE_LABEL: Record<TransactionType, string> = {
  DEPOSIT: "Nạp tiền",
  TOP_UP: "Top-up",
  RENTAL_DEDUCTION: "Trừ tiền thuê",
  LOGISTICS_DEDUCTION: "Trừ tiền vận chuyển",
  OVERDUE_PENALTY: "Phạt quá hạn",
  REFUND: "Hoàn tiền",
  WITHDRAW: "Rút tiền",
};

const TYPE_VARIANT: Record<
  TransactionType,
  "default" | "secondary" | "destructive" | "outline"
> = {
  DEPOSIT: "default",
  TOP_UP: "default",
  RENTAL_DEDUCTION: "destructive",
  LOGISTICS_DEDUCTION: "destructive",
  OVERDUE_PENALTY: "destructive",
  REFUND: "outline",
  WITHDRAW: "secondary",
};

const STATUS_LABEL: Record<TransactionStatus, string> = {
  SUCCESS: "Thành công",
  PENDING: "Đang chờ xử lý",
  FAILED: "Thất bại",
};

const STATUS_CLASS: Record<TransactionStatus, string> = {
  SUCCESS: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  FAILED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const isDebit = (type: TransactionType) =>
  type === "RENTAL_DEDUCTION" ||
  type === "LOGISTICS_DEDUCTION" ||
  type === "OVERDUE_PENALTY" ||
  type === "WITHDRAW";

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  open,
  onOpenChange,
  transaction,
}) => {
  const status = transaction.status ?? "SUCCESS";
  const displayCode =
    transaction.code ?? transaction.transactionCode ?? transaction.id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">
                Chi tiết giao dịch
              </DialogTitle>
              <DialogDescription>
                Mã:{" "}
                <span className="font-mono text-xs">{displayCode}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status + Type */}
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <span className="text-sm text-muted-foreground">Loại:</span>
              <Badge
                variant={TYPE_VARIANT[transaction.type]}
                className="ml-2"
              >
                {TYPE_LABEL[transaction.type] ?? transaction.type}
              </Badge>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Trạng thái:</span>
              <Badge
                variant="secondary"
                className={`ml-2 ${STATUS_CLASS[status]}`}
              >
                {STATUS_LABEL[status] ?? status}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Main info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Thông tin giao dịch
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <span className="text-sm text-muted-foreground">Số tiền:</span>
                <p className="font-semibold text-base">
                  {isDebit(transaction.type) ? "-" : "+"}
                  {transaction.amount.toLocaleString("vi-VN")} đ
                </p>
              </div>
              {transaction.balanceAfter != null && (
                <div>
                  <span className="text-sm text-muted-foreground">
                    Số dư sau GD:
                  </span>
                  <p className="font-medium">
                    {transaction.balanceAfter.toLocaleString("vi-VN")} đ
                  </p>
                </div>
              )}
              {transaction.userId && (
                <div>
                  <span className="text-sm text-muted-foreground">User ID:</span>
                  <p className="font-mono text-sm break-all">
                    {transaction.userId}
                  </p>
                </div>
              )}
              {transaction.walletId && (
                <div>
                  <span className="text-sm text-muted-foreground">
                    Wallet ID:
                  </span>
                  <p className="font-mono text-sm break-all">
                    {transaction.walletId}
                  </p>
                </div>
              )}
              {transaction.orderId && (
                <div>
                  <span className="text-sm text-muted-foreground">
                    Order ID:
                  </span>
                  <p className="font-mono text-sm break-all">
                    {transaction.orderId}
                  </p>
                </div>
              )}
              <div>
                <span className="text-sm text-muted-foreground">
                  Thời gian:
                </span>
                <p className="font-medium">
                  {transaction.createdAt
                    ? format(new Date(transaction.createdAt), "dd/MM/yyyy HH:mm:ss")
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          {transaction.description && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Mô tả
                </h3>
                <p className="text-sm p-3 bg-muted rounded-md">
                  {transaction.description}
                </p>
              </div>
            </>
          )}

          <Separator />

          {/* System info */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Thông tin hệ thống
            </h3>
            <div className="grid gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">ID giao dịch:</span>{" "}
                <span className="font-mono text-xs">{transaction.id}</span>
              </div>
              {transaction.transactionCode && (
                <div>
                  <span className="text-muted-foreground">
                    Mã giao dịch (hệ thống):
                  </span>{" "}
                  <span className="font-mono text-xs">
                    {transaction.transactionCode}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailModal;
