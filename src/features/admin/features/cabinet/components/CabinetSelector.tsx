"use client";

import { useEffect, useMemo } from "react";
import { useCabinet } from "../hooks/useCabinet";
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

export interface CabinetSelectorProps {
  value: string;
  onValueChange: (cabinetId: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Chỉ hiển thị cabinet trong location cụ thể */
  locationId?: string;
  /** Cho phép chọn "Tất cả" (dùng cho filter). Khi false dùng trong form bắt buộc chọn cabinet */
  allowClear?: boolean;
  className?: string;
}

export function CabinetSelector({
  value,
  onValueChange,
  placeholder = "Chọn cabinet",
  disabled = false,
  locationId,
  allowClear = true,
  className,
}: CabinetSelectorProps) {
  const {
    cabinets,
    isLoading,
    handleSearch,
    searchQuery,
    refetch,
  } = useCabinet({
    defaultPageSize: 100,
    fetchOnMount: true,
    locationId: locationId || undefined,
  });

  useEffect(() => {
    if (locationId) {
      refetch();
    }
  }, [locationId, refetch]);

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
            placeholder="Tìm theo tên cabinet..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="h-8"
          />
        </div>

        {allowClear && (
          <SelectItem value={VALUE_ALL}>Tất cả cabinet</SelectItem>
        )}

        {isLoading ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Đang tải...
          </div>
        ) : cabinets.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Không có cabinet nào
          </div>
        ) : (
          cabinets.map((cab) => (
            <SelectItem key={cab.id} value={cab.id}>
              {cab.name} {cab.macAddress ? `(${cab.macAddress})` : ""}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}

export default CabinetSelector;
