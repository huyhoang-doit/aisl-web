import type {
  LogisticsTypeValue,
  OrderStatusValue,
  OrderDetailStatusValue,
  PaymentStatusValue,
  OrderTypeValue,
} from "@/shared/constants/enums";

export type OrderStatus = OrderStatusValue;
export type OrderType = OrderTypeValue | "SHARED_RENTAL";
export type PaymentStatus = PaymentStatusValue;
export type OrderDetailStatus = OrderDetailStatusValue | "WAITING_FOR_SENDER" | "WAITING_FOR_RECEIVER";
export type LogisticsType = LogisticsTypeValue;

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
  rentalUnitPrice?: number;
  shippingUnitPrice?: number;
  logisticsType?: LogisticsType;
  pickupAddress?: string;
  reason?: string;
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
  receiverPhone?: string;
  receiverAddress?: string;
  receiverLatitude?: number;
  receiverLongitude?: number;
  receiverId?: string;
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
  courierId?: string;
  pickedUpAt?: string;
  row?: number;
  column?: number;
  itemType?: string;
  logisticsType?: LogisticsType;
  pickupAddress?: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
}

export interface OrderWithDetails {
  order: Order;
  orderDetails: OrderDetail[];
}

export interface DispatchInfo {
  id: string;
  senderId: string;
  recipientPhone: string;
  recipientName: string;
  note?: string;
  itemType: string;
  lockerId: string;
  lockerLabel: string;
  cabinetId: string;
  cabinetName: string;
  senderAddress: string;
  receiverAddress: string;
  createdAt: string;
  latitude: number;
  longitude: number;
}

export interface GetOrdersResponse {
  orders: Order[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}
