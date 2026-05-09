import { useState } from "react";
import {
  DataTable,
  type Column,
  type QuickFilter,
} from "@/shared/components/DataTable";
import TransactionDetailModal from "../features/transaction/components/TransactionDetailModal";
import { transactionService } from "../features/transaction/services/transaction.service";
import { useTransaction } from "../features/transaction/hooks/useTransaction";
import type {
  Transaction,
  TransactionStatus,
  TransactionType,
} from "../features/transaction/types/transaction.types";
import { Badge } from "@/shared/components/ui/badge";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

// ─── Display helpers ──────────────────────────────────────────────────────────

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
  PENDING: "Đang chờ",
  FAILED: "Thất bại",
};

const STATUS_CLASS: Record<TransactionStatus, string> = {
  SUCCESS:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  FAILED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const isDebit = (type: TransactionType) =>
  type === "RENTAL_DEDUCTION" ||
  type === "LOGISTICS_DEDUCTION" ||
  type === "OVERDUE_PENALTY" ||
  type === "WITHDRAW";

// ─── Page ─────────────────────────────────────────────────────────────────────

const ManageTransactionPage = () => {
  const {
    transactions,
    total,
    isLoading,
    page,
    pageSize,
    setPage,
    setPageSize,
    handleSearch,
    handleFilter,
    handleClearFilters,
  } = useTransaction({ defaultPageSize: 10 });

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  // ── Columns ────────────────────────────────────────────────────────────────

  const columns: Column<Transaction>[] = [
    {
      key: "code",
      header: "Mã giao dịch",
      sortable: true,
      accessor: (row) => (
        <span className="font-mono text-xs">
          {row.code ?? row.transactionCode ?? row.id}
        </span>
      ),
    },
    {
      key: "userId",
      header: "User ID",
      sortable: false,
      accessor: (row) => (
        <span
          className="text-muted-foreground text-xs truncate block max-w-[120px]"
          title={row.userId ?? row.walletId ?? "—"}
        >
          {row.userId ?? row.walletId ?? "—"}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Số tiền",
      sortable: true,
      accessor: (row) => (
        <span className="font-semibold">
          {isDebit(row.type) ? "-" : "+"}
          {row.amount.toLocaleString("vi-VN")} đ
        </span>
      ),
    },
    {
      key: "type",
      header: "Loại",
      sortable: true,
      accessor: (row) => (
        <Badge variant={TYPE_VARIANT[row.type]}>
          {TYPE_LABEL[row.type] ?? row.type}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      sortable: true,
      accessor: (row) => {
        const status = row.status ?? "SUCCESS";
        return (
          <Badge variant="secondary" className={STATUS_CLASS[status]}>
            {STATUS_LABEL[status] ?? status}
          </Badge>
        );
      },
    },
    {
      key: "createdAt",
      header: "Thời gian",
      sortable: true,
      accessor: (row) =>
        row.createdAt
          ? format(new Date(row.createdAt), "dd/MM/yyyy HH:mm")
          : "—",
    },
  ];

  // ── Quick filters ──────────────────────────────────────────────────────────

  const quickFilters: QuickFilter[] = [
    {
      key: "sortOrder",
      label: "Sắp xếp",
      placeholder: "Sắp xếp",
      hideAllOption: true,
      defaultValue: "Mới nhất",
      options: [
        { value: "Mới nhất", label: "Mới nhất" },
        { value: "Cũ nhất", label: "Cũ nhất" },
      ],
    },
    {
      key: "type",
      label: "Loại giao dịch",
      allStringValue: "Tất cả loại",
      placeholder: "Chọn loại",
      options: [
        { value: "Nạp tiền", label: "Nạp tiền" },
        { value: "Top-up", label: "Top-up" },
        { value: "Trừ tiền thuê", label: "Trừ tiền thuê" },
        { value: "Trừ tiền vận chuyển", label: "Trừ tiền vận chuyển" },
        { value: "Phạt quá hạn", label: "Phạt quá hạn" },
        { value: "Hoàn tiền", label: "Hoàn tiền" },
        { value: "Rút tiền", label: "Rút tiền" },
      ],
    },
    // {
    //   key: "status",
    //   label: "Trạng thái",
    //   allStringValue: "Tất cả trạng thái",
    //   placeholder: "Chọn trạng thái",
    //   options: [
    //     { value: "Thành công", label: "Thành công" },
    //     { value: "Đang chờ", label: "Đang chờ" },
    //     { value: "Thất bại", label: "Thất bại" },
    //   ],
    // },
  ];

  // ── Actions ────────────────────────────────────────────────────────────────

  const handleViewDetails = async (tx: Transaction) => {
    try {
      const res = await transactionService.getDetail(tx.id);
      setSelectedTransaction(res.data.transaction);
      setIsDetailModalOpen(true);
    } catch {
      toast.error("Không tải được chi tiết giao dịch");
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Quản lý giao dịch
        </h1>
        <p className="text-muted-foreground mt-2">
          Xem lịch sử và chi tiết các giao dịch trong hệ thống
        </p>
      </div>

      <DataTable
        data={transactions}
        columns={columns}
        keyExtractor={(row) => row.id}
        // customActions={[
        //   {
        //     label: "Xem chi tiết",
        //     icon: <Eye className="h-4 w-4" />,
        //     onClick: handleViewDetails,
        //     variant: "ghost",
        //   },
        // ]}
        emptyMessage="Chưa có giao dịch nào"
        isLoading={isLoading}
        filterable={false}
        onFilter={handleFilter}
        pagination={{
          page,
          pageSize,
          total,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
          pageSizeOptions: [5, 10, 20, 50, 100],
        }}
        searchable={true}
        searchPlaceholder="Tìm kiếm theo mã giao dịch..."
        onSearch={handleSearch}
        quickFilters={quickFilters}
        onQuickFilterChange={() => setPage(1)}
        onClearFilters={handleClearFilters}
      />

      {selectedTransaction && (
        <TransactionDetailModal
          open={isDetailModalOpen}
          onOpenChange={(open) => {
            setIsDetailModalOpen(open);
            if (!open) setSelectedTransaction(null);
          }}
          transaction={selectedTransaction}
        />
      )}
    </div>
  );
};

export default ManageTransactionPage;
