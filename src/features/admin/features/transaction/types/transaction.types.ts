export type TransactionStatus = "SUCCESS" | "FAILED" | "PENDING";
export type TransactionType = "TOPUP" | "PAYMENT" | "REFUND" | "WITHDRAW" | "LOGISTICS_DEDUCTION";

export interface Transaction {
  id: string;
  userId?: string;
  walletId?: string;
  orderId?: string;
  amount: number;
  type: TransactionType;
  status?: TransactionStatus;
  createdAt: string;
  description?: string;
  code?: string;
  transactionCode?: string;
  balanceAfter?: number;
}

export interface TransactionQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TransactionStatus;
  type?: TransactionType;
  orderBy?: string;
  orderDirection?: "ASC" | "DESC";
  fromDate?: string;
  toDate?: string;
}

export interface PaginatedTransactions {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}
