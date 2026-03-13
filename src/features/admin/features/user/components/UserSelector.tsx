import { useMemo } from "react";
import { useUser } from "../hooks/useUser";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";
import { roles } from "@/shared/configs/role";
import type { FilterConfig } from "@/shared/components/DataTable";

const VALUE_ALL = "__all__";

const ROLE_FILTER_LABEL: Record<string, string> = {
  [roles.ADMIN]: "Quản trị viên",
  [roles.TECHNICAL_STAFF]: "Nhân viên",
  [roles.COURIER]: "Người vận chuyển",
  [roles.CUSTOMER]: "Khách hàng",
};

export interface UserSelectorProps {
  value: string;
  /** id user được chọn (keycloakUserId hoặc id), hoặc "" khi chọn "Tất cả" */
  // eslint-disable-next-line no-unused-vars -- callback param for consumer
  onValueChange: (userId: string) => void;
  /** Lọc danh sách theo role (API value: TECHNICAL_STAFF, ADMIN, COURIER, CUSTOMER). Không truyền = không lọc role */
  role?: string;
  placeholder?: string;
  disabled?: boolean;
  /** Cho phép chọn "Tất cả". Khi false bắt buộc chọn một user (dùng trong form) */
  allowClear?: boolean;
  className?: string;
}

export function UserSelector({
  value,
  onValueChange,
  role,
  placeholder = "Chọn người dùng",
  disabled = false,
  allowClear = true,
  className,
}: UserSelectorProps) {
  const initialFilters = useMemo<FilterConfig[]>(() => {
    if (!role) return [];
    const label = ROLE_FILTER_LABEL[role];
    if (!label) return [];
    return [{ key: "role", value: label, type: "select" }];
  }, [role]);

  const {
    users,
    isLoading,
    handleSearch,
    searchQuery,
  } = useUser({
    defaultPageSize: 50,
    fetchOnMount: true,
    initialFilters,
  });

  const selectValue = useMemo(() => {
    if (value) return value;
    return allowClear ? VALUE_ALL : undefined;
  }, [value, allowClear]);

  const handleSelectChange = (v: string) => {
    onValueChange(v === VALUE_ALL ? "" : v);
  };

  const getUserValue = (user: { keycloakUserId?: string; id: string }) =>
    user.keycloakUserId || user.id;

  return (
    <Select
      value={selectValue}
      onValueChange={handleSelectChange}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn(
          "w-full min-w-[180px] font-normal h-9",
          !value && allowClear && "text-muted-foreground",
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <div
          className="p-2 space-y-2 border-b sticky top-0 bg-popover z-10"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Input
            placeholder="Tìm theo tên, email..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="h-8"
          />
        </div>

        {allowClear && (
          <SelectItem value={VALUE_ALL}>Tất cả người dùng</SelectItem>
        )}

        {isLoading ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Đang tải...
          </div>
        ) : users.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Không có người dùng nào
          </div>
        ) : (
          users.map((user) => (
            <SelectItem key={getUserValue(user)} value={getUserValue(user)}>
              {user.fullName}
              {user.email ? ` (${user.email})` : ""}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}

export default UserSelector;
