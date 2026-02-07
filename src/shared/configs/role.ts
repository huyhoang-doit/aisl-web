// Role của user
export const roles = {
  TECHNICAL_STAFF: "TECHNICAL_STAFF",
  COURIER: "COURIER",
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
} as const;

export type RoleType = typeof roles.TECHNICAL_STAFF | typeof roles.COURIER | typeof roles.CUSTOMER | typeof roles.ADMIN;
