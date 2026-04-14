import React from "react";
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
import { Badge } from "@/shared/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Button } from "@/shared/components/ui/button";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

const VALUE_ALL = "__all__";

export interface RoleSelectorProps {
  value: string | string[];
  /** id hoặc name role được chọn, hoặc "" khi chọn "Tất cả" (nếu allowClear) */
  // eslint-disable-next-line no-unused-vars -- callback param for consumer
  onValueChange: (value: any) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Cho phép chọn "Tất cả". Khi false bắt buộc chọn một role (dùng trong form) */
  allowClear?: boolean;
  /** Khi true, value/onValueChange dùng role name (cho filter). Khi false dùng role id (cho form) */
  valueBy?: "id" | "name";
  className?: string;
  multiple?: boolean;
}

export function RoleSelector({
  value,
  onValueChange,
  placeholder = "Chọn vai trò",
  disabled = false,
  allowClear = false,
  valueBy = "id",
  className,
  multiple = false,
}: RoleSelectorProps) {
  const { roles, isLoading } = useRoles();

  if (multiple) {
    const selectedRoles = Array.isArray(value) ? value : value ? [value] : [];

    const toggleRole = (roleValue: string) => {
      if (selectedRoles.includes(roleValue)) {
        onValueChange(selectedRoles.filter((v) => v !== roleValue));
      } else {
        onValueChange([...selectedRoles, roleValue]);
      }
    };

    const removeRole = (roleValue: string, e: React.MouseEvent) => {
      e.stopPropagation();
      onValueChange(selectedRoles.filter((v) => v !== roleValue));
    };

    const getOptionValue = (role: { id: string; name: string }) =>
      valueBy === "id" ? role.id : role.name;

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between h-auto min-h-10 hover:bg-background px-3 py-2",
              className
            )}
            disabled={disabled}
          >
            <div className="flex flex-wrap gap-1 items-center max-w-[90%]">
              {selectedRoles.length > 0 ? (
                selectedRoles.map((v) => {
                  const role = roles.find((r) => getOptionValue(r) === v);
                  return (
                    <Badge
                      key={v}
                      variant="secondary"
                      className="text-[11px] px-1.5 h-6 flex items-center gap-1 group"
                    >
                      {role ? getRoleDisplayName(role.name) : v}
                      <span
                        onClick={(e) => removeRole(v, e)}
                        className="rounded-full hover:bg-muted-foreground/20 p-0.5 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </span>
                    </Badge>
                  );
                })
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <ScrollArea className="h-60">
            <div className="p-1 space-y-0.5">
              {isLoading ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Đang tải...
                </div>
              ) : roles.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Không có vai trò nào
                </div>
              ) : (
                roles
                  .filter((r) => r.name !== "admin_client")
                  .map((role) => {
                    const roleValue = getOptionValue(role);
                    const isChecked = selectedRoles.includes(roleValue);
                    return (
                      <div
                        key={role.id}
                        className={cn(
                          "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer",
                          isChecked && "bg-accent/50"
                        )}
                        onClick={() => toggleRole(roleValue)}
                      >
                        <span className="flex-1">
                          {getRoleDisplayName(role.name)}
                        </span>
                        {isChecked && (
                          <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                            <Check className="h-4 w-4" />
                          </span>
                        )}
                      </div>
                    );
                  })
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    );
  }

  const selectValue = typeof value === 'string' ? value : (Array.isArray(value) && value.length > 0 ? value[0] : undefined) || (allowClear ? VALUE_ALL : undefined);

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
