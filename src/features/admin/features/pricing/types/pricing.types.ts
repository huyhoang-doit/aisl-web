/** Loại đơn hàng */
export type OrderTypeValue = "LOGISTICS" | "PERSONAL_RENTAL";

export type OrderType = OrderTypeValue | Record<string, unknown>;

export interface Pricing {
  id: string;
  name: string;
  blockDuration: number;
  feePerBlock: number;
  lateFeePerBlock: number;
  orderType: OrderType;
  description?: string;
  gracePeriod: number;
  createdAt?: string;
  updatedAt?: string;
}

/** Helper: lấy orderType string để hiển thị */
export function getOrderTypeDisplay(orderType?: OrderType): OrderTypeValue {
  if (!orderType) return "PERSONAL_RENTAL";
  if (typeof orderType === "string") return orderType as OrderTypeValue;
  const value = (orderType as Record<string, unknown>)?.value ?? (orderType as Record<string, unknown>)?.code;
  return (typeof value === "string" ? value : "PERSONAL_RENTAL") as OrderTypeValue;
}
