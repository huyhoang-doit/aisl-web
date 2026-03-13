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

function getRoleVariant(roleName: string): "default" | "secondary" | "outline" {
  return roleName === roles.ADMIN ? "default" : "secondary";
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
  primaryOnly = true,
}) => {
  const list: UserRoleItem[] =
    (user?.roles?.length ? user.roles : undefined) ??
    (rolesProp?.length ? rolesProp : undefined) ??
    (roleProp || user?.role ? [{ id: "", name: roleProp || user?.role || "" }] : []);

  if (!list.length) return null;

  const toShow = primaryOnly ? list.slice(0, 1) : list;

  return (
    <span className={`inline-flex flex-wrap gap-1 ${className ?? ""}`}>
      {toShow.map((r) => (
        <Badge key={r.id || r.name} variant={getRoleVariant(r.name)}>
          {getRoleLabel(r.name)}
        </Badge>
      ))}
    </span>
  );
};

export default UserRoleComponent;
