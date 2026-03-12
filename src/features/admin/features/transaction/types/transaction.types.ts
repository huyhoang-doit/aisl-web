export type TransactionStatus = "SUCCESS" | "FAILED" | "PENDING";
export type TransactionType = "TOPUP" | "PAYMENT" | "REFUND" | "WITHDRAW";

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  createdAt: string;
  description?: string;
  transactionCode?: string;
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
  items: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
