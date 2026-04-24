// Role của user
export const roles = {
  TECHNICAL_STAFF: "TECHNICAL_STAFF",
  COURIER: "COURIER",
  CUSTOMER: "CUSTOMER",
  TECHNICIAN: "TECHNICIAN",
  ADMIN: "ADMIN",
} as const;

export type RoleType = typeof roles.TECHNICAL_STAFF | typeof roles.COURIER | typeof roles.CUSTOMER | typeof roles.ADMIN;

/** Map role name từ API sang label hiển thị (tiếng Việt) */
export const ROLE_DISPLAY_NAME: Record<string, string> = {
  ADMIN: "Quản trị viên",
  TECHNICIAN: "Nhân viên",
  TECHNICAL_STAFF: "Nhân viên",
  COURIER: "Người vận chuyển",
  CUSTOMER: "Khách hàng",
  admin_client: "Admin client",
};

export function getRoleDisplayName(name: string): string {
  return ROLE_DISPLAY_NAME[name] ?? name;
}
