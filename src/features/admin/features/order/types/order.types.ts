export type OrderStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";
export type OrderType = "PERSONAL_RENTAL" | "LOGISTICS" | "SHARED_RENTAL";
export type PaymentStatus = "PENDING" | "PAID" | "REFUNDED" | "FAILED";
export type OrderDetailStatus = "ACTIVE" | "COMPLETED" | "CANCELLED" | "IN_TRANSIT" | "WAITING_FOR_SENDER" | "WAITING_FOR_RECEIVER";

export interface Order {
  id: string;
  orderCode: string;
  userId: string;
  orderType: OrderType;
  currentRate: number;
  accumulatedFee: number;
  totalCollected: number;
  lastBillingAt: string;
  status: OrderStatus;
  closedAt: string;
  createdAt: string;
  updatedAt: string;
  plannedEndTime?: string;
  isPrepaid: boolean;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  hwStatus?: string;
  rentalCabinetId?: string;
  originCabinetId?: string;
  destinationCabinetId?: string;
}

export interface OrderDetail {
  id: string;
  code: string;
  orderId: string;
  lockerId: string;
  lockerLabel?: string;
  renterId: string;
  senderId?: string;
  delegateeId?: string;
  overdueFee: number;
  status: OrderDetailStatus;
  receiverName?: string;
  receiverEmail?: string;
  note?: string;
  rentMonths?: number;
  rentStartDate?: string;
  rentEndDate?: string;
  isFixed?: boolean;
  createdAt: string;
  updatedAt: string;
  hwStatus?: string;
  accessCode?: {
    code: string;
    type: string;
  };
}

export interface OrderWithDetails {
  order: Order;
  orderDetails: OrderDetail[];
}

export interface GetOrdersResponse {
  orders: Order[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}
