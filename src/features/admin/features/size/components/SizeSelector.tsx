"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";
import { sizeService } from "../services/size.service";
import type { Size } from "../types/size.types";

const VALUE_ALL = "__all__";

export interface SizeSelectorProps {
  value: string;
  // eslint-disable-next-line no-unused-vars
  onValueChange: (sizeId: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Cho phép chọn "Tất cả" (dùng cho filter). Khi false dùng trong form bắt buộc chọn size */
  allowClear?: boolean;
  className?: string;
}

export function SizeSelector({
  value,
  onValueChange,
  placeholder = "Chọn kích thước",
  disabled = false,
  allowClear = true,
  className,
}: SizeSelectorProps) {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await sizeService.getAll();
        if (!cancelled) setSizes(res.data.sizes ?? []);
      } catch {
        if (!cancelled) setSizes([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredSizes = useMemo(() => {
    if (!searchQuery.trim()) return sizes;
    const q = searchQuery.trim().toLowerCase();
    return sizes.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        [s.width, s.height, s.depth]
          .filter(Boolean)
          .some((n) => String(n).includes(q))
    );
  }, [sizes, searchQuery]);

  const selectValue = useMemo(() => {
    if (value) return value;
    return allowClear ? VALUE_ALL : undefined;
  }, [value, allowClear]);

  const handleSelectChange = (v: string) => {
    onValueChange(v === VALUE_ALL ? "" : v);
  };

  const sizeLabel = (s: Size) => {
    const dims = [s.width, s.height, s.depth].filter((n) => n != null);
    if (dims.length === 0) return s.name;
    return `${s.name} (${dims.join("×")} cm)`;
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
            placeholder="Tìm theo tên, kích thước..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8"
          />
        </div>

        {allowClear && (
          <SelectItem value={VALUE_ALL}>Tất cả kích thước</SelectItem>
        )}

        {isLoading ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Đang tải...
          </div>
        ) : filteredSizes.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Không có kích thước nào
          </div>
        ) : (
          filteredSizes.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {sizeLabel(s)}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}

export default SizeSelector;
