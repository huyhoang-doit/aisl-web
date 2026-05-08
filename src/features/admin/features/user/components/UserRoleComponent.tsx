import React from "react";
import { Badge } from "@/shared/components/ui/badge";
import { roles } from "@/shared/configs/role";
import type { User, UserRoleItem } from "../types/user.types";

const ROLE_LABELS: Record<string, string> = {
  [roles.ADMIN]: "Quản trị viên",
  [roles.TECHNICAL_STAFF]: "Nhân viên",
  [roles.COURIER]: "Người vận chuyển",
  [roles.CUSTOMER]: "Khách hàng",
  [roles.TECHNICIAN]: "Nhân viên",
};

function getRoleLabel(roleName: string): string {
  return ROLE_LABELS[roleName] ?? roleName;
}

type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "warning" | "success" | "info" | "progress";

function getRoleVariant(roleName: string): BadgeVariant {
  switch (roleName) {
    case roles.ADMIN:
      return "default";
    case roles.TECHNICIAN:
    case roles.TECHNICAL_STAFF:
      return "info";
    case roles.COURIER:
      return "warning";
    case roles.CUSTOMER:
      return "success";
    default:
      return "secondary";
  }
}

export interface UserRoleComponentProps {
  user?: Pick<User, "role" | "roles"> | null;
  roles?: UserRoleItem[] | null;
  role?: string | null;
  className?: string;
  primaryOnly?: boolean;
}

const UserRoleComponent: React.FC<UserRoleComponentProps> = ({
  user,
  roles: rolesProp,
  role: roleProp,
  className,
  primaryOnly = false,
}) => {
  let list: string[] = [];

  const sourceRoles = rolesProp?.length ? rolesProp : user?.roles;

  if (sourceRoles?.length) {
    list = sourceRoles.map((r: any) => (typeof r === "string" ? r : r.name)).filter(Boolean);
  } else if (roleProp) {
    list = [roleProp];
  } else if (user?.role) {
    list = [user.role];
  }

  // Fallback in case a single string is comma-separated
  if (list.length === 1 && typeof list[0] === "string" && list[0].includes(",")) {
    list = list[0].split(",").map((s) => s.trim());
  }

  // Filter out empty strings
  list = list.filter((r) => r);

  if (!list.length) return null;

  const toShow = primaryOnly ? list.slice(0, 1) : list;

  return (
    <span className={`inline-flex flex-wrap gap-1 ${className ?? ""}`}>
      {toShow.map((roleName, index) => (
        <Badge key={`${roleName}-${index}`} variant={getRoleVariant(roleName)}>
          {getRoleLabel(roleName)}
        </Badge>
      ))}
    </span>
  );
};

export default UserRoleComponent;
