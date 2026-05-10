import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { hardwareApi } from "../features/hardware/api/hardware.api";
import { type HardwareMonitorQueryParams, type HardwareMonitorStats } from "../features/hardware/types/hardware.types";
import { format, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Loader2,
  Activity,
  Server,
  XCircle,
  DoorOpen,
  Signal,
  SignalLow,
  MapPin,
  RefreshCw,
  Search,
} from "lucide-react";
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
import { Input } from "@/shared/components/ui/input";

export default function ManageHardwarePage() {
  const [params, setParams] = useState<HardwareMonitorQueryParams>({
    page: 1,
    limit: 10,
    status: undefined,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["hardware-monitor", params],
    queryFn: () => hardwareApi.getMonitorStatus(params),
    refetchInterval: 30000,
  });

  const stats: HardwareMonitorStats[] = data?.statuses || [];
  const pagination = data?.pagination;

  const totalCabinets = pagination?.total || 0;
  const onlineCabinets = stats.filter((s) => s.isOnline).length;
  const offlineCabinets = stats.filter((s) => !s.isOnline).length;
  const totalOpenDoors = stats.reduce((acc, curr) => acc + (curr.openDoors || 0), 0);

  const filteredStats = stats.filter(
    (cabinet) =>
      cabinet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cabinet.cabinetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cabinet.locationName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header — đồng bộ với AdminDashboardPage */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Giám sát hệ thống tủ</h1>
          <p className="text-muted-foreground">
            Theo dõi trạng thái kết nối và sức khỏe phần cứng thời gian thực.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground italic">
            {isFetching ? "Đang cập nhật..." : "Cập nhật tự động sau 30s"}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="shadow-sm gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng số cụm tủ</p>
                <h3 className="text-2xl font-bold mt-1">{totalCabinets}</h3>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Server className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Đang hoạt động</p>
                <h3 className="text-2xl font-bold mt-1 text-green-500">{onlineCabinets}</h3>
              </div>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Signal className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {totalCabinets > 0 ? Math.round((onlineCabinets / totalCabinets) * 100) : 0}% tỉ lệ kết nối
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mất kết nối</p>
                <h3 className="text-2xl font-bold mt-1 text-red-500">{offlineCabinets}</h3>
              </div>
              <div className="p-2 bg-red-500/10 rounded-lg">
                <SignalLow className="w-5 h-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cửa đang mở</p>
                <h3 className="text-2xl font-bold mt-1 text-orange-500">{totalOpenDoors}</h3>
              </div>
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <DoorOpen className="w-5 h-5 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Table Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3 px-6 bg-muted/30 border-b">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Trạng thái chi tiết các cabinet
            </CardTitle>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm tủ..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
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
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                  <SelectItem value="ONLINE">Đang Online</SelectItem>
                  <SelectItem value="OFFLINE">Mất kết nối</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-hidden border-b">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-[200px] pl-6">Cabinet &amp; Vị trí</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Tín hiệu cuối</TableHead>
                  <TableHead>Tổng ngăn</TableHead>
                  <TableHead>Sức khỏe Locker</TableHead>
                  <TableHead className="text-right pr-6">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground font-medium">Đang tải dữ liệu giám sát...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center text-red-500">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <XCircle className="w-8 h-8" />
                        <p className="font-semibold">Đã có lỗi xảy ra</p>
                        <p className="text-sm">Không thể kết nối đến máy chủ để lấy dữ liệu.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : !filteredStats.length ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Server className="w-8 h-8 text-muted-foreground/30" />
                        <p className="font-medium text-muted-foreground">Không tìm thấy cabinet nào phù hợp.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStats.map((cabinet) => (
                    <TableRow key={cabinet.cabinetId} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="pl-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold">{cabinet.name}</span>
                          <span className="text-xs text-muted-foreground flex items-center mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {cabinet.locationName || "Chưa gán vị trí"}
                          </span>
                          <code className="text-[10px] mt-1 bg-muted px-1 py-0.5 rounded w-fit text-muted-foreground uppercase">
                            ID: {cabinet.cabinetId.split("-")[0]}...
                          </code>
                        </div>
                      </TableCell>
                      <TableCell>
                        {cabinet.isOnline ? (
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <Badge className="bg-green-500/15 text-green-600 dark:text-green-400 hover:bg-green-500/15 border-none px-2 py-0.5">
                              ONLINE
                            </Badge>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-400" />
                            <Badge className="bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-500/15 border-none px-2 py-0.5">
                              OFFLINE
                            </Badge>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {cabinet.lastHeartbeat
                              ? format(new Date(cabinet.lastHeartbeat), "HH:mm:ss dd/MM")
                              : "N/A"}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {cabinet.lastHeartbeat
                              ? formatDistanceToNow(new Date(cabinet.lastHeartbeat), { addSuffix: true, locale: vi })
                              : "Chưa nhận tín hiệu"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">{cabinet.totalLockers}</span>
                          <span className="text-xs text-muted-foreground">ngăn</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1.5 w-[140px]">
                          <div className="flex justify-between text-[10px] font-medium">
                            <span className="text-green-500">Ổn định: {cabinet.onlineLockers}</span>
                            <span className="text-red-500">Lỗi: {cabinet.offlineLockers}</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex">
                            <div
                              className="h-full bg-green-500"
                              style={{ width: `${(cabinet.onlineLockers / cabinet.totalLockers) * 100}%` }}
                            />
                            <div
                              className="h-full bg-red-500"
                              style={{ width: `${(cabinet.offlineLockers / cabinet.totalLockers) * 100}%` }}
                            />
                          </div>
                          {cabinet.openDoors > 0 && (
                            <div className="flex items-center gap-1 text-[10px] text-orange-500 font-semibold">
                              <DoorOpen className="w-3 h-3" />
                              {cabinet.openDoors} cửa đang mở
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/admin/cabinets?id=${cabinet.cabinetId}`}>Chi tiết</a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination && pagination.total > params.limit! && (
            <div className="flex items-center justify-between p-4 px-6 border-t">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Trang {pagination.page} / {Math.ceil(pagination.total / pagination.limit)}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => setParams((p) => ({ ...p, page: Math.max(1, (p.page || 1) - 1) }))}
                  disabled={pagination.page <= 1}
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => setParams((p) => ({ ...p, page: (p.page || 1) + 1 }))}
                  disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
