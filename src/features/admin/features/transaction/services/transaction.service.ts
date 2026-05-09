/**
 * Transaction Service
 * Service layer cho transaction API calls
 * APIs: GET /payments/transactions  |  GET /payments/transactions/{id}
 */
import { api } from "@/shared/lib/api/client";
import type {
  Transaction,
  TransactionStatus,
  TransactionType,
} from "../types/transaction.types";


// ─── Params / Payloads ────────────────────────────────────────────────────────

export interface TransactionListParams {
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

// ─── Response shapes ──────────────────────────────────────────────────────────

export interface TransactionDetailResponse {
  data: {
    transaction: Transaction;
  };
}

export interface TransactionListResponse {
  data: {
    transactions: Transaction[];
    total: number;
    page: number;
    limit: number;
  };
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const transactionService = {
  /**
   * GET /payments/transactions
   * Lấy danh sách giao dịch với phân trang và filter
   */
  getAll: async (
    params?: TransactionListParams
  ): Promise<TransactionListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set("page", String(params.page));
    if (params?.limit != null) searchParams.set("limit", String(params.limit));
    if (params?.search) searchParams.set("search", params.search);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.type) searchParams.set("type", params.type);
    if (params?.orderBy) searchParams.set("orderBy", params.orderBy);
    if (params?.orderDirection)
      searchParams.set("orderDirection", params.orderDirection);
    if (params?.fromDate) searchParams.set("fromDate", params.fromDate);
    if (params?.toDate) searchParams.set("toDate", params.toDate);

    const query = searchParams.toString();
    const url = query ? `/payments/admin/transactions?${query}` : "/payments/admin/transactions";
    const response = await api.get<TransactionListResponse>(url);
    return response as unknown as TransactionListResponse;
  },

  /**
   * GET /payments/transactions/{id}
   * Lấy chi tiết giao dịch theo id
   */
  getDetail: async (id: string): Promise<TransactionDetailResponse> => {
    const response = await api.get<TransactionDetailResponse>(
      `/payments/transactions/${id}`
    );
    return response as unknown as TransactionDetailResponse;
  },
};
