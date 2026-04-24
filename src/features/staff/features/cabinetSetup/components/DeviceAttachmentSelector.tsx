import { useState, useMemo } from "react";
import { useDeviceAttachment } from "../../../../admin/features/deviceAttachment/hooks/useDeviceAttachment";
import type { DeviceAttachment } from "../../../../admin/features/deviceAttachment/types/deviceAttachment.types";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Loader2, Search, X, Check } from "lucide-react";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";

interface DeviceAttachmentSelectorProps {
  selectedIds: string[];
  // eslint-disable-next-line no-unused-vars
  onChange: (ids: string[]) => void;
}

export function DeviceAttachmentSelector({ selectedIds, onChange }: DeviceAttachmentSelectorProps) {
  const { deviceAttachments, isLoading } = useDeviceAttachment({
    defaultPageSize: 100, // Fetch many for selection
    fetchOnMount: true,
  });

  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [localSearch, setLocalSearch] = useState("");

  // Extract unique types for filtering
  const uniqueTypes = useMemo(() => {
    const types = new Set<string>();
    deviceAttachments.forEach((da: DeviceAttachment) => {
      if (da.type) types.add(da.type);
    });
    return Array.from(types);
  }, [deviceAttachments]);

  const filteredAttachments = useMemo(() => {
    return deviceAttachments.filter((da: DeviceAttachment) => {
      const matchesType = typeFilter === "all" || da.type === typeFilter;
      const searchLower = localSearch.toLowerCase();
      const matchesSearch = 
        da.name.toLowerCase().includes(searchLower) || 
        da.serialNumber.toLowerCase().includes(searchLower);
      return matchesType && matchesSearch;
    });
  }, [deviceAttachments, typeFilter, localSearch]);

  const handleToggle = (id: string) => {
    const newIds = selectedIds.includes(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id];
    onChange(newIds);
  };

  const selectedAttachments = useMemo(() => {
    if (!selectedIds) return [];
    return deviceAttachments.filter((da: DeviceAttachment) => selectedIds.includes(da.id));
  }, [deviceAttachments, selectedIds]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <Label>Tìm kiếm thiết bị</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên hoặc số serial..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="w-full sm:w-[200px] space-y-2">
          <Label>Lọc theo loại</Label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tất cả loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              {uniqueTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-muted/30">
          {selectedAttachments.map((da: DeviceAttachment) => (
            <Badge key={da.id} variant="secondary" className="gap-1 pr-1">
              {da.name}
              <button
                type="button"
                onClick={() => handleToggle(da.id)}
                className="hover:text-destructive transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="border rounded-xl bg-card overflow-hidden">
        <ScrollArea className="h-[250px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full py-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : filteredAttachments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-10 text-muted-foreground">
              <p>Không tìm thấy thiết bị nào</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredAttachments.map((da: DeviceAttachment) => (
                <div
                  key={da.id}
                  className={`flex items-start gap-3 p-3 transition-colors hover:bg-accent/50 cursor-pointer ${
                    selectedIds.includes(da.id) ? "bg-primary/5" : ""
                  }`}
                  onClick={() => handleToggle(da.id)}
                >
                  <div
                    className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border shadow-sm pointer-events-none transition-colors ${
                      selectedIds.includes(da.id)
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-primary bg-transparent"
                    }`}
                  >
                    {selectedIds.includes(da.id) && <Check className="h-3 w-3" strokeWidth={3} />}
                  </div>
                  <div 
                    className="flex-1 min-w-0 pointer-events-none" 
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm truncate">{da.name}</p>
                      {da.type && (
                        <Badge variant="outline" className="text-[10px] uppercase font-bold shrink-0">
                          {da.type}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">SN: {da.serialNumber}</p>
                    {da.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{da.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
      <p className="text-xs text-muted-foreground">
        Đã chọn {selectedIds.length} thiết bị
      </p>
    </div>
  );
}
