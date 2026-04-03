import type { UseFormReturn } from "react-hook-form";
import type { SetupCabinetFormValues } from "../../schemas/cabinetSetup.schema";
import { useQuery } from "@tanstack/react-query";
import { locationService } from "@/features/admin/features/location/services/location.service";

interface ReviewStepProps {
  form: UseFormReturn<SetupCabinetFormValues>;
}

export function ReviewStep({ form }: ReviewStepProps) {
  const values = form.getValues();

  // Fetch location name for display
  const { data: areas } = useQuery({
    queryKey: ["lockerAreas"],
    queryFn: () => locationService.getAll({ page: 1, limit: 100 }),
  });

  const locations = areas?.data.locations || [];

  const locationName = locations.find((a: any) => a.id === values.locationId)?.name || values.locationId;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-1 mb-6">
        <h3 className="text-lg font-medium">Xác nhận thông tin</h3>
        <p className="text-sm text-muted-foreground">
          Vui lòng kiểm tra lại các cấu hình trước khi tiến hành Setup Tủ
        </p>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6 space-y-6">
          
          {/* Section 1 */}
          <div>
            <h4 className="font-semibold mb-2 text-primary">1. Trạm & Định danh</h4>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="flex flex-col">
                <dt className="text-muted-foreground">Vị trí (Location):</dt>
                <dd className="font-medium">{locationName}</dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-muted-foreground">MAC Address:</dt>
                <dd className="font-medium uppercase">{values.macAddress}</dd>
              </div>
            </dl>
          </div>

          <div className="h-px bg-border" />

          {/* Section 2 */}
          <div>
            <h4 className="font-semibold mb-2 text-primary">2. Bố trí tủ</h4>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="flex flex-col">
                <dt className="text-muted-foreground">Tổng số Locker:</dt>
                <dd className="font-medium flex items-center">
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded mr-2">
                    {values.totalRows * values.totalColumns}
                  </span>
                  ({values.totalRows} hàng × {values.totalColumns} cột)
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-muted-foreground">Nhịp tim / Mở cửa:</dt>
                <dd className="font-medium">{values.heartbeatInterval}s / {values.openDoorTimeout}s</dd>
              </div>
            </dl>
          </div>


        </div>
      </div>
      
      <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 p-4 rounded-lg flex items-start mt-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle mr-3 mt-0.5 shrink-0 h-5 w-5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        <div className="text-sm">
          <p className="font-semibold mb-1">Chú ý trước khi thiết lập:</p>
          <ul className="list-disc leading-relaxed ml-4">
            <li>Quá trình cài đặt sẽ gửi yêu cầu xuống trực tiếp Raspberry Pi.</li>
            <li>Raspberry Pi sẽ tự động bật từng cửa tủ để kiểm tra module mạch điện, chốt khoá và cảm biến.</li>
            <li>Vui lòng đứng tránh xa và đảm bảo không có vật cản cản trở cách cửa tủ mở.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
