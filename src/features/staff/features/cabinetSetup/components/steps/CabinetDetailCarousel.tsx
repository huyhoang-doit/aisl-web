import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { SetupCabinetFormValues } from "../../schemas/cabinetSetup.schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { ChevronLeft, ChevronRight, LayoutGrid, MonitorCheck } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { cabinetSetupService } from "../../services/cabinetSetup.service";
import { useWatch } from "react-hook-form";

interface CabinetDetailCarouselProps {
  form: UseFormReturn<SetupCabinetFormValues>;
  selectedCabinets: string[];
}

export function CabinetDetailCarousel({ form, selectedCabinets }: CabinetDetailCarouselProps) {
  const [index, setIndex] = useState(0);
  const locationId = useWatch({ control: form.control, name: "locationId" });

  const { data: cabinetsData } = useQuery({
    queryKey: ["cabinets-by-location", locationId],
    queryFn: () => cabinetSetupService.getCabinetsByLocation(locationId, { page: 1, limit: 100 }),
    enabled: !!locationId,
  });

  const cabinets = cabinetsData?.data?.cabinets || [];
  const currentCabinetId = selectedCabinets[index];
  const cabinetInfo = cabinets.find(c => c.id === currentCabinetId);

  const next = () => setIndex(prev => Math.min(prev + 1, selectedCabinets.length - 1));
  const prev = () => setIndex(prev => Math.max(prev - 1, 0));

  if (!currentCabinetId) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Bước 3: Cấu hình chi tiết layout</h3>
          <p className="text-sm text-muted-foreground">
            Thiết lập số hàng và cột cho từng cụm tủ đã chọn.
          </p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          Tủ {index + 1} / {selectedCabinets.length}
        </Badge>
      </div>

      <div className="p-6 bg-card border rounded-2xl shadow-sm space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <LayoutGrid className="w-24 h-24" />
        </div>

        <div className="flex items-center gap-3 mb-2">
           <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
             {index + 1}
           </div>
           <div>
             <h4 className="font-bold text-xl">{cabinetInfo?.name || "Cabinet"}</h4>
             <p className="text-xs text-muted-foreground uppercase tracking-wider">Mã thiết bị: {cabinetInfo?.code}</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name={`configurations.${index}.totalRows`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số hàng</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="VD: 4" 
                    {...field} 
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`configurations.${index}.totalColumns`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số cột</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="VD: 6" 
                    {...field} 
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Visual Mapping */}
        {index < selectedCabinets.length && (
           <div className="mt-4 p-4 bg-primary/5 border border-primary/10 rounded-xl flex items-center gap-3">
              <MonitorCheck className="w-5 h-5 text-primary" />
              <div className="text-sm">
                <span className="font-medium">Tự động gán Slave ID:</span>
                <Badge variant="secondary" className="ml-2">#{index + 1}</Badge>
                <p className="text-[10px] text-muted-foreground mt-0.5 italic">Slave ID sẽ được hệ thống gán dựa trên thứ tự quét phần cứng.</p>
              </div>
           </div>
        )}

        {/* Navigation within Carousel */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={prev} 
            disabled={index === 0}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" /> Cụm tủ trước
          </Button>
          <div className="flex gap-1">
             {selectedCabinets.map((_, i) => (
               <div 
                 key={i} 
                 className={`w-1.5 h-1.5 rounded-full transition-all ${i === index ? 'bg-primary w-4' : 'bg-muted'}`} 
               />
             ))}
          </div>
          <Button 
            type="button" 
            variant="ghost" 
            onClick={next} 
            disabled={index === selectedCabinets.length - 1}
            className="gap-2"
          >
            Cụm tủ tiếp theo <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="heartbeatInterval"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Heartbeat (s)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="openDoorTimeout"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timeout mở cửa (s)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
