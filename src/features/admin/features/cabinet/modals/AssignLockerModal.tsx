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
import { Search, Loader2, Info, Grid3X3, X } from "lucide-react";
import { lockerService } from "../../locker/services/locker.service";
import { cabinetService } from "../services/cabinet.service";
import type { Cabinet } from "../types/cabinet.types";
import type { Locker } from "../../locker/types/locker.types";
import { toast } from "sonner";
import { Badge } from "@/shared/components/ui/badge";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

interface AssignLockerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cabinet: Cabinet;
  onSuccess?: () => void;
}

const AssignLockerModal: React.FC<AssignLockerModalProps> = ({
  open,
  onOpenChange,
  cabinet,
  onSuccess,
}) => {
  const [availableLockers, setAvailableLockers] = useState<Locker[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAvailableLockers = useCallback(async () => {
    try {
      setIsLoading(true);
      // Lấy tất cả locker. Ta lọc những cái không thuộc cabinet hiện tại.
      const response = await lockerService.getAll({ limit: 100 });
      const lockers = response.data.lockers || [];
      
      // Lọc ra các locker chưa gán cho cabinet hiện tại
      const filtered = lockers.filter(l => l.cabinetId !== cabinet.id);
      setAvailableLockers(filtered);
    } catch (error) {
      console.error("Error loading available lockers:", error);
      toast.error("Không tải được danh sách ngăn tủ sẵn có");
    } finally {
      setIsLoading(false);
    }
  }, [cabinet.id]);

  useEffect(() => {
    if (open) {
      loadAvailableLockers();
      setSelectedIds([]);
    }
  }, [open, loadAvailableLockers]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAssign = async () => {
    if (selectedIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một ngăn tủ");
      return;
    }

    try {
      setIsSubmitting(true);
      await cabinetService.assignLockers(cabinet.id, selectedIds);
      toast.success(`Đã gán ${selectedIds.length} ngăn tủ thành công`);
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error assigning lockers:", error);
      toast.error("Không gán được ngăn tủ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredLockers = availableLockers.filter(l => 
    l.lockerLabel?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Grid3X3 className="h-5 w-5 text-primary" />
            Gán ngăn tủ vào Cabinet
          </DialogTitle>
          <DialogDescription>
            Tìm và chọn các ngăn tủ để gán cho cabinet <strong>{cabinet.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo nhãn ngăn tủ..."
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
                  <p>Đang tải danh sách ngăn tủ...</p>
                </div>
              ) : filteredLockers.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                  <Info className="h-8 w-8 mb-2 opacity-20" />
                  <p>{searchQuery ? "Không tìm thấy ngăn tủ phù hợp" : "Không còn ngăn tủ nào sẵn có để gán"}</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredLockers.map((locker) => (
                    <div 
                      key={locker.id} 
                      className={`flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                        selectedIds.includes(locker.id) ? "bg-primary/5" : ""
                      }`}
                      onClick={() => toggleSelection(locker.id)}
                    >
                      <Checkbox 
                        checked={selectedIds.includes(locker.id)}
                        onCheckedChange={() => toggleSelection(locker.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-sm truncate">{locker.lockerLabel || `Locker ${locker.id.substring(0, 8)}`}</p>
                          {locker.cabinetId && (
                            <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal">
                              Đã gán cabinet khác
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="font-mono">{locker.id}</span>
                          <span>•</span>
                          <span>Vị trí: {locker.row}-{locker.column}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge 
                          variant={locker.status === "AVAILABLE" ? "success" : "secondary"} 
                          className="text-[10px]"
                        >
                          {locker.status}
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
              Đã chọn: <span className="text-primary font-bold">{selectedIds.length}</span> ngăn tủ
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
            Gán ngăn tủ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignLockerModal;
