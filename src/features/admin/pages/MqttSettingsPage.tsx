import { useQuery } from "@tanstack/react-query";
import { systemSettingsApi } from "../api/system-settings.api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Loader2, Server, Key, ShieldCheck, Hash } from "lucide-react";

const MqttSettingsPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["system-settings", "mqtt"],
    queryFn: () => systemSettingsApi.getMqttSettings(),
  });

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Có lỗi xảy ra khi tải cấu hình MQTT. Vui lòng kiểm tra quyền hạn.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Cấu hình Hệ thống</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              <CardTitle>MQTT Broker Settings</CardTitle>
            </div>
            <CardDescription>
              Thông tin kết nối MQTT Broker dùng cho tủ Locker và IoT Gateway
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 border-b pb-2">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Server className="h-4 w-4" /> Host
              </div>
              <div className="col-span-2 font-mono text-sm">{data?.host}</div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-b pb-2">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Hash className="h-4 w-4" /> Port
              </div>
              <div className="col-span-2 font-mono text-sm">{data?.port}</div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-b pb-2">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Key className="h-4 w-4" /> Username
              </div>
              <div className="col-span-2 font-mono text-sm">
                {data?.username || <span className="italic text-muted-foreground">Chưa cấu hình</span>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-b pb-2">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> Password
              </div>
              <div className="col-span-2 font-mono text-sm italic text-muted-foreground">
                •••••••••••• (Ẩn vì lý do bảo mật)
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> TLS/SSL
              </div>
              <div className="col-span-2">
                {data?.useTls ? (
                  <span className="text-green-600 font-semibold">Bật</span>
                ) : (
                  <span className="text-amber-600 font-semibold">Tắt</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hướng dẫn Bảo mật</CardTitle>
            <CardDescription>Các quy tắc khi thao tác với cấu hình</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-2 text-muted-foreground">
            <p>• Cấu hình MQTT Broker được lấy trực tiếp từ biến môi trường của Backend.</p>
            <p>• Chỉ Admin và Kỹ thuật viên (Technician) mới có quyền xem thông tin này.</p>
            <p>• Để thay đổi cấu hình, vui lòng cập nhật file môi trường (.env) trên server Backend.</p>
            <p className="font-bold text-amber-600">⚠ Không chia sẻ thông tin này cho bên thứ ba.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MqttSettingsPage;
