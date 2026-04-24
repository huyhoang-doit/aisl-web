/** Loại vận chuyển */
export const LogisticsType = {
  LOCKER_TO_LOCKER: "LOCKER_TO_LOCKER",
  HOME_TO_LOCKER: "HOME_TO_LOCKER",
} as const;
export type LogisticsTypeValue = (typeof LogisticsType)[keyof typeof LogisticsType];

/** Trạng thái đơn hàng */
export const OrderStatus = {
  PENDING: "PENDING",
  AWAITING_COURIER: "AWAITING_COURIER",
  AWAITING_PICKUP: "AWAITING_PICKUP",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  LOCKED_BY_BALANCE: "LOCKED_BY_BALANCE",
  CANCELLED: "CANCELLED",
} as const;
export type OrderStatusValue = (typeof OrderStatus)[keyof typeof OrderStatus];

/** Trạng thái chi tiết đơn hàng */
export const OrderDetailStatus = {
  PENDING: "PENDING",
  AWAITING_COURIER: "AWAITING_COURIER",
  AWAITING_PICKUP: "AWAITING_PICKUP",
  AWAITING_CONFIRM_DEPOSIT: "AWAITING_CONFIRM_DEPOSIT",
  IN_TRANSIT: "IN_TRANSIT",
  OCCUPIED: "OCCUPIED",
  COMPLETED: "COMPLETED",
  OVERDUE: "OVERDUE",
  COLLECTING: "COLLECTING",
  COLLECTED: "COLLECTED",
} as const;
export type OrderDetailStatusValue = (typeof OrderDetailStatus)[keyof typeof OrderDetailStatus];

/** Trạng thái thanh toán */
export const PaymentStatus = {
  PENDING: "PENDING",
  UNPAID: "UNPAID",
  PAID: "PAID",
  PARTIAL_PAID: "PARTIAL_PAID",
  REFUNDED: "REFUNDED",
} as const;
export type PaymentStatusValue = (typeof PaymentStatus)[keyof typeof PaymentStatus];

/** Loại giao dịch */
export const TransactionType = {
  DEPOSIT: "DEPOSIT",
  RENTAL_DEDUCTION: "RENTAL_DEDUCTION",
  LOGISTICS_DEDUCTION: "LOGISTICS_DEDUCTION",
  OVERDUE_PENALTY: "OVERDUE_PENALTY",
  REFUND: "REFUND",
  TOP_UP: "TOP_UP",
  WITHDRAW: "WITHDRAW",
} as const;
export type TransactionTypeValue = (typeof TransactionType)[keyof typeof TransactionType];

/** Trạng thái giao dịch */
export const TransactionStatus = {
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  PENDING: "PENDING",
  CANCELLED: "CANCELLED",
} as const;
export type TransactionStatusValue = (typeof TransactionStatus)[keyof typeof TransactionStatus];

/** Loại đơn hàng */
export const OrderType = {
  LOGISTICS: "LOGISTICS",
  PERSONAL_RENTAL: "PERSONAL_RENTAL",
  SHARED_RENTAL: "SHARED_RENTAL",
} as const;
export type OrderTypeValue = (typeof OrderType)[keyof typeof OrderType];

/** Loại mặt hàng */
export const ItemType = {
  FOOD: "FOOD",
  OTHER: "OTHER",
} as const;
export type ItemTypeValue = (typeof ItemType)[keyof typeof ItemType];

/** Đơn vị thời gian */
export const FeeBlockUnit = {
  MINUTE: "MINUTE",
  HOUR: "HOUR",
  DAY: "DAY",
  WEEK: "WEEK",
  MONTH: "MONTH",
} as const;
export type FeeBlockUnitValue = (typeof FeeBlockUnit)[keyof typeof FeeBlockUnit];

/** Trạng thái tủ */
export const LockerStatus = {
  AVAILABLE: "AVAILABLE",
  OCCUPIED: "OCCUPIED",
  RESERVED: "RESERVED",
  LOCKED_BY_BALANCE: "LOCKED_BY_BALANCE",
  FAULT: "FAULT",
  MAINTENANCE: "MAINTENANCE",
  INITIALIZING: "INITIALIZING",
} as const;
export type LockerStatusValue = (typeof LockerStatus)[keyof typeof LockerStatus];
