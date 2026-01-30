"use client";

import { useEffect, useMemo } from "react";
import { useLocation as useLocationList } from "@/features/admin/features/location/hooks/useLocation";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";

const VALUE_ALL = "__all__";

export interface LocationSelectorProps {
  value: string;
  /** id của location được chọn, hoặc "" khi chọn "Tất cả" */
  // eslint-disable-next-line no-unused-vars -- type definition
  onValueChange: (locationId: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Chỉ hiển thị địa điểm đang hoạt động */
  filterActiveOnly?: boolean;
  /** Cho phép chọn "Tất cả" (dùng cho filter trang). Khi false dùng trong form bắt buộc chọn địa điểm */
  allowClear?: boolean;
  className?: string;
}

export function LocationSelector({
  value,
  onValueChange,
  placeholder = "Chọn địa điểm",
  disabled = false,
  filterActiveOnly = true,
  allowClear = true,
  className,
}: LocationSelectorProps) {
  const {
    locations,
    isLoading,
    handleSearch,
    searchQuery,
  } = useLocationList({
    defaultPageSize: 50,
    fetchOnMount: true,
    initialFilters: filterActiveOnly === true ? [
      { key: "isActive", value: "Hoạt động", type: "select" },
    ] : [],
  });


  // Giá trị cho Select: khi allowClear và value rỗng thì hiển thị "Tất cả"
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
        {/* Header: search + checkbox - chặn đóng dropdown khi tương tác */}
        <div
          className="p-2 space-y-2 border-b sticky top-0 bg-popover z-10"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Input
            placeholder="Tìm theo tên địa điểm..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="h-8"
          />
        </div>

        {allowClear && (
          <SelectItem value={VALUE_ALL}>Tất cả địa điểm</SelectItem>
        )}

        {isLoading ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Đang tải...
          </div>
        ) : locations.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Không có địa điểm nào
          </div>
        ) : (
          locations.map((loc) => (
            <SelectItem key={loc.id} value={loc.id}>
              {loc.address ? `${loc.name} - ${loc.address}` : loc.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}

export default LocationSelector;
