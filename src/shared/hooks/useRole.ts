import { roles, type RoleType } from "../configs/role";

// Custom hook cho việc kiểm tra vai trò của người dùng
export const useRole = (userRole?: RoleType | string) => {
  if (!userRole) {
    return { isStaff: false, isAdmin: false };
  }

  const isStaff = userRole === roles.STAFF;
  const isAdmin = userRole === roles.ADMIN;

  return { isStaff, isAdmin };
};
