import { useMemo, useState } from "react";
import { useLocation } from "../hooks/useLocation";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";

export interface LocationSelectorProps {
  value: string;
  onValueChange: (_locationId: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Chỉ hiển thị location đang active */
  filterActiveOnly?: boolean;
  className?: string;
}

export function LocationSelector({
  value,
  onValueChange,
  placeholder = "Chọn địa điểm",
  disabled = false,
  filterActiveOnly = true,
  className,
}: LocationSelectorProps) {
  const { locations, isLoading } = useLocation({
    defaultPageSize: 100, // Lấy nhiều một chút để search
    fetchOnMount: true,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const availableLocations = useMemo(() => {
    let list = locations;
    if (filterActiveOnly) {
      list = list.filter((l) => l.isActive);
    }
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (l) =>
        l.name?.toLowerCase().includes(q) ||
        l.address?.toLowerCase().includes(q)
    );
  }, [locations, filterActiveOnly, searchQuery]);

  return (
    <Select value={value || undefined} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger
        className={cn("w-full font-normal h-9", className)}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <div
          className="p-2 space-y-2 border-b sticky top-0 bg-popover z-10"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Input
            placeholder="Tìm theo tên, địa chỉ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8"
          />
        </div>

        {isLoading ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Đang tải...
          </div>
        ) : availableLocations.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Không có địa điểm nào
          </div>
        ) : (
          availableLocations.map((loc) => (
            <SelectItem key={loc.id} value={loc.id || ""}>
              {loc.name}
              {loc.address ? ` - ${loc.address}` : ""}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}

export default LocationSelector;
