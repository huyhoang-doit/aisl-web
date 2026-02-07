export type UserStatusValue = "ACTIVE" | "INACTIVE" | "BLOCKED";

export type UserStatus = UserStatusValue | Record<string, unknown>;

export type NotificationType = Record<string, unknown>;

/** Role từ API get all user (response mới) */
export interface UserRoleItem {
  id: string;
  name: string;
}

export interface User {
  keycloakUserId?: string;
  id: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  status?: UserStatus;
  isVerified?: boolean;
  isActive?: boolean;
  role?: string;
  roles?: UserRoleItem[];
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

/** Lấy role chính từ user: từ roles[0].name hoặc role (backward compatible) */
export function getPrimaryRole(user: Pick<User, "role" | "roles">): string {
  if (user.roles?.length) return user.roles[0].name;
  return user.role ?? "";
}
