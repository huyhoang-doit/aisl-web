import type { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import type { SetupCabinetFormValues } from "../../schemas/cabinetSetup.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { locationService } from "@/features/admin/features/location/services/location.service";
import { Loader2, RefreshCw, Cpu, Database } from "lucide-react";
import { DeviceAttachmentSelector } from "../DeviceAttachmentSelector";

interface BasicInfoStepProps {
  form: UseFormReturn<SetupCabinetFormValues>;
  isScanning: boolean;
  onScan: () => Promise<void>;
  hasScanned: boolean;
}

export function BasicInfoStep({ form, isScanning, onScan, hasScanned }: BasicInfoStepProps) {
  const { data: areas, isLoading } = useQuery({
    queryKey: ["lockerAreas"],
    queryFn: () => locationService.getAll({ page: 1, limit: 100 }),
  });

  const locations = areas?.data.locations || [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1 mb-6">
        <h3 className="text-lg font-medium">Bước 1: Thông tin cơ bản & Thiết bị đi kèm</h3>
        <p className="text-sm text-muted-foreground">
          Chọn chi nhánh, quét phần cứng Raspberry Pi và chọn các thiết bị ngoại vi kết nối cùng
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="locationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location (Chi nhánh)</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoading ? "Loading..." : "Chọn Location"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {locations.map((area: any) => (
                      <SelectItem key={area.id} value={area.id}>
                        {area.name} - {area.address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="macAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa chỉ MAC (Raspberry Pi 5)</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input placeholder="DC:A6:32:00:00:00" {...field} />
                  </FormControl>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={onScan}
                    disabled={isScanning || !field.value}
                    className="shrink-0"
                  >
                    {isScanning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                    Quét
                  </Button>
                </div>
                <FormMessage />
                {hasScanned && (
                  <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-1">
                    <Cpu className="w-3 h-3" /> Đã quét hardware
                  </p>
                )}
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center gap-4 py-2">
          <div className="h-[1px] flex-1 bg-border" />
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <Database className="w-3 h-3" /> Thiết bị đi kèm (Attachments)
          </div>
          <div className="h-[1px] flex-1 bg-border" />
        </div>

        <FormField
          control={form.control}
          name="deviceAttachmentIds"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div>
                  <DeviceAttachmentSelector
                    selectedIds={field.value ?? []}
                    onChange={field.onChange}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
