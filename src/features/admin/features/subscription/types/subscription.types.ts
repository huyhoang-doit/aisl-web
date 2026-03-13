/** SubscriptionStatus */
export type SubscriptionStatusValue =
  | "ACTIVE"     // Đang hoạt động
  | "SUSPENDED"  // Tạm ngưng
  | "EXPIRED"    // Hết hạn
  | "CANCELLED"; // Đã hủy

export type SubscriptionStatus = SubscriptionStatusValue | Record<string, unknown>;

/** Tham chiếu user đơn giản (embedded) */
export interface SubscriptionUserRef {
  id?: string;
  keycloakUserId?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
}

/** Tham chiếu plan đơn giản (embedded) – theo response API */
export interface SubscriptionPlanRef {
  id: string;
  name?: string;
  price?: number;
  maxLockers?: number;
  description?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  isFreeDefault?: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  /** API list/detail có thể không trả về planId, lấy từ plan.id */
  planId?: string;
  status?: SubscriptionStatus;
  startDate?: string;
  /** API có thể trả về endDate rỗng "" */
  endDate?: string;
  /** User info (khi API trả về embedded) */
  user?: SubscriptionUserRef;
  /** Plan info – API list luôn trả về plan */
  plan?: SubscriptionPlanRef;
  createdAt?: string;
  updatedAt?: string;
}

/** Lấy planId từ subscription (plan.id hoặc planId) */
export function getSubscriptionPlanId(s: Subscription): string {
  return s.plan?.id ?? s.planId ?? "";
}

/** Helper: lấy status string để hiển thị */
export function getSubscriptionStatusDisplay(status?: SubscriptionStatus): SubscriptionStatusValue {
  if (!status) return "ACTIVE";
  if (typeof status === "string") return status as SubscriptionStatusValue;
  const value = (status as Record<string, unknown>)?.value ?? (status as Record<string, unknown>)?.code;
  return (typeof value === "string" ? value : "ACTIVE") as SubscriptionStatusValue;
}
