import { useRoles } from "../hooks/useRoles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";
import { getRoleDisplayName } from "@/shared/configs/role";

const VALUE_ALL = "__all__";

export interface RoleSelectorProps {
  value: string;
  /** id hoặc name role được chọn, hoặc "" khi chọn "Tất cả" (nếu allowClear) */
  // eslint-disable-next-line no-unused-vars -- callback param for consumer
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Cho phép chọn "Tất cả". Khi false bắt buộc chọn một role (dùng trong form) */
  allowClear?: boolean;
  /** Khi true, value/onValueChange dùng role name (cho filter). Khi false dùng role id (cho form) */
  valueBy?: "id" | "name";
  className?: string;
}

export function RoleSelector({
  value,
  onValueChange,
  placeholder = "Chọn vai trò",
  disabled = false,
  allowClear = false,
  valueBy = "id",
  className,
}: RoleSelectorProps) {
  const { roles, isLoading } = useRoles();

  const selectValue = value || (allowClear ? VALUE_ALL : undefined);

  const handleSelectChange = (v: string) => {
    onValueChange(v === VALUE_ALL ? "" : v);
  };

  const getOptionValue = (role: { id: string; name: string }) =>
    valueBy === "id" ? role.id : role.name;

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
        {allowClear && (
          <SelectItem value={VALUE_ALL}>Tất cả vai trò</SelectItem>
        )}

        {isLoading ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Đang tải...
          </div>
        ) : roles.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Không có vai trò nào
          </div>
        ) : (
          roles.filter((r) => r.name !== "admin_client").map((role) => (
            <SelectItem key={role.id} value={getOptionValue(role)}>
              {getRoleDisplayName(role.name)}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}

export default RoleSelector;
