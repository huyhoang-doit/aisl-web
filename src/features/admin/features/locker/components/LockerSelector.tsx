"use client";

import { useMemo } from "react";
import { useLocker } from "../hooks/useLocker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";

const VALUE_ALL = "__all__";

export interface LockerSelectorProps {
  value: string;
  // eslint-disable-next-line no-unused-vars -- callback param for consumer
  onValueChange: (lockerId: string) => void;
  placeholder?: string;
  disabled?: boolean;
  cabinetId?: string;
  allowClear?: boolean;
  className?: string;
}

export function LockerSelector({
  value,
  onValueChange,
  placeholder = "Chọn locker",
  disabled = false,
  cabinetId,
  allowClear = true,
  className,
}: LockerSelectorProps) {
  const { lockers, isLoading, handleSearch, searchQuery } = useLocker({
    defaultPageSize: 100,
    fetchOnMount: true,
    cabinetId: cabinetId || undefined,
  });

  const selectValue = useMemo(() => {
    if (value) return value;
    return allowClear ? VALUE_ALL : undefined;
  }, [value, allowClear]);

  const handleSelectChange = (v: string) => {
    onValueChange(v === VALUE_ALL ? "" : v);
  };

  return (
    <Select
      value={selectValue}
      onValueChange={handleSelectChange}
      disabled={disabled || !cabinetId}
    >
      <SelectTrigger
        className={cn(
          "w-full min-w-[180px] font-normal h-9",
          !value && allowClear && "text-muted-foreground",
          className
        )}
      >
        <SelectValue
          placeholder={cabinetId ? placeholder : "Vui lòng chọn cabinet trước"}
        />
      </SelectTrigger>
      <SelectContent>
        <div
          className="p-2 space-y-2 border-b sticky top-0 bg-popover z-10"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Input
            placeholder="Tìm theo locker label..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="h-8"
          />
        </div>

        {allowClear && <SelectItem value={VALUE_ALL}>Tất cả locker</SelectItem>}

        {!cabinetId ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Chọn cabinet để hiển thị danh sách locker
          </div>
        ) : isLoading ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Đang tải...
          </div>
        ) : lockers.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Không có locker nào
          </div>
        ) : (
          lockers.map((locker) => (
            <SelectItem key={locker.id} value={locker.id}>
              {locker.lockerLabel || `R${locker.row}-C${locker.column}`}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}

export default LockerSelector;
