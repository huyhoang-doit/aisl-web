/** Status từ BE - có thể là string hoặc object */
export type UserStatusValue = "ACTIVE" | "INACTIVE" | "LOCKED";

export type UserStatus = UserStatusValue | Record<string, unknown>;

export type NotificationType = Record<string, unknown>;

export interface User {
  keycloakUserId: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  status?: UserStatus;
  isVerified?: boolean;
  role: string;
  notificationType?: NotificationType;
  createdAt?: string;
  updatedAt?: string;
}

/** Helper: lấy status string để hiển thị */
export function getUserStatusDisplay(status?: UserStatus): UserStatusValue {
  if (!status) return "ACTIVE";
  if (typeof status === "string") return status as UserStatusValue;
  const value = (status as Record<string, unknown>)?.value ?? (status as Record<string, unknown>)?.code;
  return (typeof value === "string" ? value : "ACTIVE") as UserStatusValue;
}
