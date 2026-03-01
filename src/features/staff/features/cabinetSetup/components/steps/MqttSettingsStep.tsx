import type { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import type { SetupCabinetFormValues } from "../../schemas/cabinetSetup.schema";

interface MqttSettingsStepProps {
  form: UseFormReturn<SetupCabinetFormValues>;
}

export function MqttSettingsStep({ form }: MqttSettingsStepProps) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-1 mb-6">
        <h3 className="text-lg font-medium">Kết nối MQTT</h3>
        <p className="text-sm text-muted-foreground">
          Cấu hình thông tin kết nối Broker MQTT cho tủ Locker
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <FormField
            control={form.control}
            name="mqttBrokerHost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Broker Host IP</FormLabel>
                <FormControl>
                  <Input placeholder="Ví dụ: 192.168.1.100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="mqttBrokerPort"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Port</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="mqttUsername"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tên đăng nhập (Username)</FormLabel>
            <FormControl>
              <Input placeholder="Tùy chọn" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="mqttPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mật khẩu (Password)</FormLabel>
            <FormControl>
              <Input type="password" placeholder="Tùy chọn" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
