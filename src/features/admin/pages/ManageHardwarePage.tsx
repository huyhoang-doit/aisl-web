import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { hardwareApi } from "../features/hardware/api/hardware.api";
import { type HardwareMonitorQueryParams } from "../features/hardware/types/hardware.types";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

export default function ManageHardwarePage() {
  const [params, setParams] = useState<HardwareMonitorQueryParams>({
    page: 1,
    limit: 10,
    status: undefined,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["hardware-monitor", params],
    queryFn: () => hardwareApi.getMonitorStatus(params),
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Giám sát phần cứng</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc trạng thái</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-[250px] space-y-2">
            <label className="text-sm font-medium">Trạng thái kết nối tủ</label>
            <Select
              value={params.status || "ALL"}
              onValueChange={(val) =>
                setParams((prev) => ({
                  ...prev,
                  status: val === "ALL" ? undefined : (val as "ONLINE" | "OFFLINE"),
                  page: 1,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                <SelectItem value="ONLINE">Đang Online</SelectItem>
                <SelectItem value="OFFLINE">Mất kết nối (Offline)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã Tủ (Cabinet ID)</TableHead>
                <TableHead>Tên Tủ</TableHead>
                <TableHead>Trạng Thái Nguồn</TableHead>
                <TableHead>Hoạt động (Heartbeat)</TableHead>
                <TableHead>Tổng Ngăn</TableHead>
                <TableHead>Online</TableHead>
                <TableHead>Offline</TableHead>
                <TableHead>Đang Dùng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-red-500">
                    Đã có lỗi xảy ra khi tải dữ liệu giám sát.
                  </TableCell>
                </TableRow>
              ) : !data?.items?.length ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    Không tìm thấy tủ nào.
                  </TableCell>
                </TableRow>
              ) : (
                data.items.map((cabinet) => (
                  <TableRow key={cabinet.cabinetId}>
                    <TableCell className="font-medium">{cabinet.cabinetId}</TableCell>
                    <TableCell>{cabinet.name}</TableCell>
                    <TableCell>
                      {cabinet.connectionStatus === "ONLINE" ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none">
                          ONLINE
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-none">
                          OFFLINE
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {cabinet.lastHeartbeatAt
                        ? format(new Date(cabinet.lastHeartbeatAt), "dd/MM/yyyy HH:mm:ss")
                        : "Chưa rõ"}
                    </TableCell>
                    <TableCell>{cabinet.totalLockers}</TableCell>
                    <TableCell className="text-green-600 font-medium">
                      {cabinet.onlineLockers}
                    </TableCell>
                    <TableCell className="text-red-600 font-medium">{cabinet.offlineLockers}</TableCell>
                    <TableCell className="text-blue-600 font-medium">{cabinet.inUseLockers}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <span className="text-sm text-muted-foreground">
              Hiển thị trang {data.page} / {data.totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setParams((p) => ({ ...p, page: Math.max(1, (p.page || 1) - 1) }))}
                disabled={data.page <= 1}
              >
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setParams((p) => ({ ...p, page: (p.page || 1) + 1 }))}
                disabled={data.page >= data.totalPages}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
