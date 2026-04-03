import type { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import type { SetupCabinetFormValues } from "../../schemas/cabinetSetup.schema";
import { useWatch } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { cabinetSetupService } from "../../services/cabinetSetup.service";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface LayoutStepProps {
  form: UseFormReturn<SetupCabinetFormValues>;
}

export function LayoutStep({ form }: LayoutStepProps) {
  const { watch } = form;
  const rows = watch("totalRows") || 0;
  const cols = watch("totalColumns") || 0;
  
  const locationId = useWatch({ control: form.control, name: "locationId" });
  const cabinetId = useWatch({ control: form.control, name: "cabinetId" });

  const { data: cabinetsData } = useQuery({
    queryKey: ["cabinets-by-location", locationId],
    queryFn: () => cabinetSetupService.getCabinetsByLocation(locationId!, { page: 1, limit: 100 }),
    enabled: !!locationId,
  });

  const selectedCabinet = cabinetsData?.data?.cabinets?.find((c: any) => c.id === cabinetId);
  
  // Xử lý trường hợp DB trả về 0x0 thì coi như tối thiểu 1x1 để UI không bị dị thường
  const maxRows = Math.max(1, selectedCabinet?.totalRows || 0);
  const maxCols = Math.max(1, selectedCabinet?.totalColumns || 0);
  
  const isExceedingRows = selectedCabinet?.totalRows || 0;
  const isExceedingCols = selectedCabinet?.totalColumns || 0;

  const { data: attachmentsData, isLoading: isLoadingAttachments } = useQuery({
    queryKey: ["device-attachments"],
    queryFn: () => cabinetSetupService.getDeviceAttachments({ 
      page: 1, 
      limit: 100
    }),
  });

  // Filter devices: show those unassigned OR assigned to this specific cabinet
  const availableAttachments = attachmentsData?.data?.deviceAttachments?.filter((device: any) => 
    !device.cabinetConfigId || device.cabinetConfigId === cabinetId
  ) || [];

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-1 mb-6">
        <h3 className="text-lg font-medium">Bố trí Locker</h3>
        <p className="text-sm text-muted-foreground">
          Cấu hình số lượng hàng và cột thực tế trên tủ Locker
        </p>
      </div>

      {(isExceedingRows || isExceedingCols) && (
        <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Cảnh báo: Vượt quá giới hạn vật lý</AlertTitle>
          <AlertDescription>
            Số {isExceedingRows ? "hàng" : ""}{isExceedingRows && isExceedingCols ? " và " : ""}{isExceedingCols ? "cột" : ""} bạn nhập 
            vượt quá thiết kế của cụm tủ ({maxRows}x{maxCols}).
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="totalRows"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số hàng</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totalColumns"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số cột</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <FormField
          control={form.control}
          name="heartbeatInterval"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nhịp Tim (giây)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
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
              <FormLabel>Timeout Mở Cửa (giây)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Visual representation */}
      {rows > 0 && cols > 0 && rows <= 10 && cols <= 10 && (
        <div className="mt-8 p-4 bg-muted/30 rounded-lg border overflow-x-auto">
          <p className="text-sm font-medium mb-4">Minh hoạ cấu trúc: {rows * cols} lockers</p>
          <div 
            className="grid gap-2 min-w-max" 
            style={{ 
              gridTemplateColumns: `repeat(${cols}, minmax(3rem, 1fr))` 
            }}
          >
            {Array.from({ length: rows * cols }).map((_, i) => (
              <div 
                key={i} 
                className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-md flex items-center justify-center text-xs font-medium text-primary/70 shrink-0"
              >
                {i}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tùy chọn thiết bị đính kèm (Device Attachments) */}
      <div className="mt-8">
        <h3 className="text-sm font-medium mb-4">Các thiết bị phụ trợ đính kèm (Tuỳ chọn)</h3>
        <FormField
          control={form.control}
          name="deviceAttachmentIds"
          render={({ field }) => {
            return (
              <FormItem>
                {isLoadingAttachments ? (
                  <p className="text-sm text-muted-foreground">Đang tải danh sách thiết bị...</p>
                ) : availableAttachments.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableAttachments.map((attachment: any) => (
                      <div 
                        key={attachment.id} 
                        className={`flex items-start space-x-3 space-y-0 rounded-md border p-4 cursor-pointer transition-colors ${
                          field.value?.includes(attachment.id) ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                        }`}
                        onClick={() => {
                          const currentValues = field.value || [];
                          const isSelected = currentValues.includes(attachment.id);
                          const newValues = isSelected 
                            ? currentValues.filter((id) => id !== attachment.id)
                            : [...currentValues, attachment.id];
                          field.onChange(newValues);
                        }}
                      >
                        <FormControl>
                          <input
                            type="checkbox"
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            checked={field.value?.includes(attachment.id) || false}
                            onChange={() => {}} // Handle change on parent div
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-medium cursor-pointer">
                            {attachment.name}
                          </FormLabel>
                          <p className="text-xs text-muted-foreground">
                            SN: {attachment.serialNumber}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 border border-dashed rounded-lg bg-muted/10 flex items-center justify-center text-sm text-muted-foreground">
                    Không có thiết bị đính kèm nào khả dụng cho cụm tủ này.
                  </div>
                )}
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>
    </div>
  );
}
