/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import { Search, Loader2, Info, LayoutGrid, X } from "lucide-react";
import { cabinetService } from "../../cabinet/services/cabinet.service";
import { locationService } from "../services/location.service";
import type { Cabinet } from "../../cabinet/types/cabinet.types";
import type { Location } from "../types/location.types";
import { toast } from "sonner";
import { Badge } from "@/shared/components/ui/badge";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

interface AssignCabinetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location: Location;
  onSuccess?: () => void;
}

const AssignCabinetModal: React.FC<AssignCabinetModalProps> = ({
  open,
  onOpenChange,
  location,
  onSuccess,
}) => {
  const [availableCabinets, setAvailableCabinets] = useState<Cabinet[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAvailableCabinets = useCallback(async () => {
    try {
      setIsLoading(true);
      // Lấy tất cả cabinet. Backend có thể trả về thông tin đã gán hay chưa.
      // Ở đây ta lấy hết và lọc những cái không thuộc location hiện tại.
      const response = await cabinetService.getAll({ limit: 100 });
      const cabinets = response.data.cabinets || [];
      
      // Lọc ra các cabinet chưa gán cho location hiện tại
      // hoặc các cabinet chưa được gán cho bất kỳ location nào (nếu cần)
      const filtered = cabinets.filter(c => c.locationId !== location.id);
      setAvailableCabinets(filtered);
    } catch (error) {
      console.error("Error loading available cabinets:", error);
      toast.error("Không tải được danh sách cụm tủ sẵn có");
    } finally {
      setIsLoading(false);
    }
  }, [location.id]);

  useEffect(() => {
    if (open) {
      loadAvailableCabinets();
      setSelectedIds([]);
    }
  }, [open, loadAvailableCabinets]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAssign = async () => {
    if (selectedIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một cụm tủ");
      return;
    }

    try {
      setIsSubmitting(true);
      await locationService.assignCabinets(location.id, selectedIds);
      toast.success(`Đã gán ${selectedIds.length} cụm tủ thành công`);
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error assigning cabinets:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Không gán được cụm tủ");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCabinets = availableCabinets.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.macAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-primary" />
            Gán cụm tủ vào địa điểm
          </DialogTitle>
          <DialogDescription>
            Tìm và chọn các cụm tủ để gán cho <strong>{location.name}</strong>.
            Các cụm tủ này sẽ tự động được gán thông tin địa chỉ của địa điểm hiện tại.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên hoặc mã MAC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex-1 overflow-hidden border rounded-md">
            <ScrollArea className="h-full max-h-[400px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center p-12 gap-3 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p>Đang tải danh sách cụm tủ...</p>
                </div>
              ) : filteredCabinets.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                  <Info className="h-8 w-8 mb-2 opacity-20" />
                  <p>{searchQuery ? "Không tìm thấy cụm tủ phù hợp" : "Không còn cụm tủ nào sẵn có để gán"}</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredCabinets.map((cabinet) => (
                    <div 
                      key={cabinet.id} 
                      className={`flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                        selectedIds.includes(cabinet.id) ? "bg-primary/5" : ""
                      }`}
                      onClick={() => toggleSelection(cabinet.id)}
                    >
                      <Checkbox 
                        checked={selectedIds.includes(cabinet.id)}
                        onCheckedChange={() => toggleSelection(cabinet.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-sm truncate">{cabinet.name}</p>
                          {cabinet.locationName && (
                            <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal">
                              Hiện tại: {cabinet.locationName}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="font-mono">{cabinet.macAddress}</span>
                          <span>•</span>
                          <span>{cabinet.totalRows} Hàng × {cabinet.totalColumns} Cột</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge variant={cabinet.status === "ACTIVE" ? "success" : "secondary"} className="text-[10px]">
                          {cabinet.status === "ACTIVE" ? "Hoạt động" : "N/A"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg border border-primary/10">
            <div className="text-sm font-medium">
              Đã chọn: <span className="text-primary font-bold">{selectedIds.length}</span> cụm tủ
            </div>
            {selectedIds.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedIds([])}
                className="h-8 text-xs text-muted-foreground hover:text-destructive"
              >
                <X className="h-3 w-3 mr-1" /> Bỏ chọn tất cả
              </Button>
            )}
          </div>
        </div>

        <DialogFooter className="p-6 pt-2 bg-muted/20 border-t">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleAssign} 
            disabled={isSubmitting || selectedIds.length === 0}
            className="min-w-[120px]"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Gán cụm tủ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignCabinetModal;
