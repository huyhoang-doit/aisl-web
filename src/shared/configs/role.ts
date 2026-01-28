// Role của user
export const roles = {
  STAFF: "STAFF",
  ADMIN: "ADMIN",
} as const;

export type RoleType = typeof roles.STAFF | typeof roles.ADMIN;
