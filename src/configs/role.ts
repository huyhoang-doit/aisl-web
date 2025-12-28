// Role của user
export const roles = {
  STAFF: "staff",
  ADMIN: "admin",
} as const;

export type RoleType = [typeof roles.STAFF, typeof roles.ADMIN]
