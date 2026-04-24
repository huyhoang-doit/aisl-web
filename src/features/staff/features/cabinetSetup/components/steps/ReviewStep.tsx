import type { UseFormReturn } from "react-hook-form";
import type { SetupCabinetFormValues } from "../../schemas/cabinetSetup.schema";
import { useQuery } from "@tanstack/react-query";
import { locationService } from "@/features/admin/features/location/services/location.service";
import { cabinetSetupService } from "../../services/cabinetSetup.service";
import { Badge } from "@/shared/components/ui/badge";
import { Box, MapPin, Cpu, LayoutGrid, Database, CheckCircle2 } from "lucide-react";
import { deviceAttachmentService } from "@/features/admin/features/deviceAttachment/services/deviceAttachment.service";

interface ReviewStepProps {
  form: UseFormReturn<SetupCabinetFormValues>;
}

export function ReviewStep({ form }: ReviewStepProps) {
  const values = form.getValues();

  // Fetch location name
  const { data: areas } = useQuery({
    queryKey: ["lockerAreas"],
    queryFn: () => locationService.getAll({ page: 1, limit: 100 }),
  });

  const locationName = areas?.data?.locations?.find((a: any) => a.id === values.locationId)?.name || values.locationId;

  // Fetch cabinet names for display
  const { data: cabinetsData } = useQuery({
    queryKey: ["cabinets-by-location", values.locationId],
    queryFn: () => cabinetSetupService.getCabinetsByLocation(values.locationId, { page: 1, limit: 100 }),
    enabled: !!values.locationId,
  });

  // Fetch device attachments for display
  const { data: attachmentsData } = useQuery({
    queryKey: ["device-attachments-all"],
    queryFn: () => deviceAttachmentService.getAll({ page: 1, limit: 100 }),
    enabled: !!values.deviceAttachmentIds?.length,
  });

  const attachments = (attachmentsData?.data?.deviceAttachments || attachmentsData?.data?.items || []) as any[];
  const selectedAttachments = attachments.filter(a => values.deviceAttachmentIds?.includes(a.id));

  const cabinets = cabinetsData?.data?.cabinets || [];
  const totalLockers = values.configurations.reduce((sum, c) => sum + (c.totalRows * c.totalColumns), 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 overflow-y-auto max-h-[600px] pr-2">
      <div className="space-y-1 mb-4">
        <h3 className="text-xl font-bold">Xác nhận thông tin thiết lập</h3>
        <p className="text-sm text-muted-foreground">
          Vui lòng kiểm tra lại cấu hình trước khi gửi lệnh xuống Raspberry Pi
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="p-4 rounded-xl border bg-secondary/5 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-1" />
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Chi nhánh / Vị trí</p>
              <p className="font-medium">{locationName}</p>
            </div>
         </div>
         <div className="p-4 rounded-xl border bg-secondary/5 flex items-start gap-3">
            <Cpu className="w-5 h-5 text-primary mt-1" />
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">RPi MAC Address</p>
              <p className="font-medium uppercase">{values.macAddress}</p>
            </div>
         </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border overflow-hidden">
          <div className="bg-muted/50 p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Box className="w-5 h-5 text-primary" />
              <h4 className="font-bold">Danh sách Cụm tủ ({values.configurations.length})</h4>
            </div>
            <Badge variant="secondary" className="px-3 py-1 font-bold text-primary">
              Tổng cộng: {totalLockers} Lockers
            </Badge>
          </div>
          <div className="divide-y max-h-[250px] overflow-y-auto">
            {values.configurations.map((config, index) => {
              const cabinetInfo = cabinets.find(c => c.id === config.cabinetId);
              return (
                <div key={config.cabinetId} className="p-4 bg-card flex items-center justify-between hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{cabinetInfo?.name || config.cabinetId}</p>
                      <p className="text-xs text-muted-foreground">Mã: {cabinetInfo?.code || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      <LayoutGrid className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="font-bold text-sm text-primary">{config.totalRows * config.totalColumns} Lockers</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{config.totalRows} hàng &times; {config.totalColumns} cột</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedAttachments.length > 0 && (
          <div className="rounded-2xl border overflow-hidden">
            <div className="bg-muted/50 p-4 border-b">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                <h4 className="font-bold">Thiết bị đi kèm ({selectedAttachments.length})</h4>
              </div>
            </div>
            <div className="p-4 bg-card grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[200px] overflow-y-auto">
              {selectedAttachments.map((da) => (
                <div key={da.id} className="flex items-center gap-2 p-2 rounded-lg border bg-muted/20">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate">{da.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">SN: {da.serialNumber}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/50 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex flex-shrink-0 items-center justify-center">
           <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
           </svg>
        </div>
        <div className="text-sm">
          <p className="font-bold text-amber-800 dark:text-amber-300 mb-1">Cảnh báo vật lý:</p>
          <p className="text-amber-700 dark:text-amber-400 leading-relaxed">
            Hệ thống sẽ gán Slave ID tự động cho từng tủ theo thứ tự trên. Raspberry Pi sẽ bắt đầu kích hoạt solenoid để kiểm tra phần cứng ngay khi bắt đầu. Đảm bảo khu vực tủ an toàn.
          </p>
        </div>
      </div>
    </div>
  );
}
