import { axiosInstance } from "@/shared/lib/api/axios-instance";
import type { PaginatedTransactions, TransactionQueryParams } from "../types/transaction.types";

export const transactionApi = {
  getTransactions: async (params?: TransactionQueryParams): Promise<PaginatedTransactions> => {
    return axiosInstance.get("payments/admin/transactions", { params });
  },
};
