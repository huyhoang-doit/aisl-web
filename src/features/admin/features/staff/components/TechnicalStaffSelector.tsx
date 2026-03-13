import { useMemo, useState } from "react";
import { useTechnicalStaff } from "../hooks/useTechnicalStaff";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";

export interface TechnicalStaffSelectorProps {
  value: string;
  onValueChange: (staffId: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Chỉ hiển thị staff đang active */
  filterActiveOnly?: boolean;
  className?: string;
}

export function TechnicalStaffSelector({
  value,
  onValueChange,
  placeholder = "Chọn nhân viên kỹ thuật",
  disabled = false,
  filterActiveOnly = true,
  className,
}: TechnicalStaffSelectorProps) {
  const { staffList, isLoading } = useTechnicalStaff();
  const [searchQuery, setSearchQuery] = useState("");

  const availableStaff = useMemo(() => {
    let list = staffList;
    if (filterActiveOnly) {
      list = list.filter((s) => s.status === "ACTIVE" || !s.status);
    }
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.phone?.toLowerCase().includes(q)
    );
  }, [staffList, filterActiveOnly, searchQuery]);

  return (
    <Select value={value || undefined} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger
        className={cn("w-full min-w-[200px] font-normal h-9", className)}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <div
          className="p-2 space-y-2 border-b sticky top-0 bg-popover z-10"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Input
            placeholder="Tìm theo tên, email, SĐT..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8"
          />
        </div>

        {isLoading ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Đang tải...
          </div>
        ) : availableStaff.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Không có nhân viên kỹ thuật nào
          </div>
        ) : (
          availableStaff.map((staff) => (
            <SelectItem key={staff.id} value={staff.id || ""}>
              {staff.name}
              {staff.email ? ` (${staff.email})` : ""}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}

export default TechnicalStaffSelector;
