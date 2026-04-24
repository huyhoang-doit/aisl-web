import { useQuery } from "@tanstack/react-query";
import { cabinetSetupService } from "../../services/cabinetSetup.service";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { AlertTriangle, Info, MonitorCheck } from "lucide-react";
import type { SlaveDetail } from "../../types/cabinetSetup.types";

interface CabinetSelectionStepProps {
  locationId: string;
  discoveredSlaves: SlaveDetail[];
  selectedCabinets: string[];
  onToggleCabinet: (_id: string) => void;
}

export function CabinetSelectionStep({ 
  locationId, 
  discoveredSlaves, 
  selectedCabinets,
  onToggleCabinet 
}: CabinetSelectionStepProps) {
  const { data: cabinetsData, isLoading } = useQuery({
    queryKey: ["cabinets-by-location", locationId],
    queryFn: () => cabinetSetupService.getCabinetsByLocation(locationId, { page: 1, limit: 100 }),
    enabled: !!locationId,
  });

  const cabinets = cabinetsData?.data?.cabinets || [];
  const maxCabinets = discoveredSlaves.length;
  const isLimitReached = selectedCabinets.length >= maxCabinets;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-1 mb-6">
        <h3 className="text-lg font-medium">Bước 2: Chọn các cụm tủ (Cabinets)</h3>
        <p className="text-sm text-muted-foreground">
          Chọn tối đa {maxCabinets} cụm tủ tương ứng với số lượng controller đã tìm thấy.
        </p>
      </div>

      <div className="flex items-center gap-2 p-3 bg-secondary/20 rounded-lg border border-secondary/30">
        <MonitorCheck className="w-5 h-5 text-primary" />
        <span className="text-sm font-medium">
          Đã tìm thấy: <span className="text-primary">{maxCabinets} Controllers</span>
        </span>
        <div className="ml-auto flex items-center gap-1">
          <Badge variant={selectedCabinets.length === maxCabinets ? "default" : "outline"}>
            Đã chọn: {selectedCabinets.length}/{maxCabinets}
          </Badge>
        </div>
      </div>

      {selectedCabinets.length > maxCabinets && (
         <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Vượt quá số lượng cho phép</AlertTitle>
            <AlertDescription>
              Bạn chỉ có {maxCabinets} controller vật lý nhưng đã chọn {selectedCabinets.length} tủ.
            </AlertDescription>
         </Alert>
      )}

      {isLoading ? (
        <div className="flex justify-center py-10 text-muted-foreground italic">
          Đang tải danh sách tủ...
        </div>
      ) : cabinets.length === 0 ? (
        <div className="text-center py-10 border border-dashed rounded-lg bg-muted/5">
          <Info className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Không có tủ nào khả dụng tại chi nhánh này.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {cabinets.map((cabinet) => {
            const isSelected = selectedCabinets.includes(cabinet.id);
            const isDisabled = !isSelected && isLimitReached;
            
            return (
              <div 
                key={cabinet.id}
                className={`
                  flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer
                  ${isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'bg-card hover:border-primary/50'}
                  ${isDisabled ? 'opacity-50 grayscale cursor-not-allowed' : ''}
                `}
                onClick={(e) => {
                  e.preventDefault();
                  if (!isDisabled) onToggleCabinet(cabinet.id);
                }}
              >
                <div onClick={(e) => e.stopPropagation()}>
                  <Checkbox 
                    id={`cabinet-${cabinet.id}`}
                    checked={isSelected}
                    disabled={isDisabled}
                    onCheckedChange={() => !isDisabled && onToggleCabinet(cabinet.id)}
                  />
                </div>
                <div className="flex-1 space-y-0.5">
                  <Label 
                    htmlFor={`cabinet-${cabinet.id}`}
                    className="font-semibold cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {cabinet.name || "Tủ không tên"}
                  </Label>
                  <p className="text-xs text-muted-foreground">Mã: {cabinet.code || "---"}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
