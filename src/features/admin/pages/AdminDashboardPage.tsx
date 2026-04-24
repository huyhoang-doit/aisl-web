import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../features/dashboard/api/analytics.api";
import { format, subMonths } from "date-fns";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Loader2, TrendingUp, Package, Users, MapPin, Database, Server, ChevronDown, ChevronRight, RefreshCcw } from "lucide-react";
import React, { useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

const AdminDashboardPage = () => {
  const initialStartDate = format(subMonths(new Date(), 1), "yyyy-MM-dd");
  const initialEndDate = format(new Date(), "yyyy-MM-dd");
  
  // States specifically for Revenue card inputs (drafts)
  const [revStartDate, setRevStartDate] = useState(initialStartDate);
  const [revEndDate, setRevEndDate] = useState(initialEndDate);

  // Isolated effective dates for Revenue query
  const [effRevStartDate, setEffRevStartDate] = useState(revStartDate);
  const [effRevEndDate, setEffRevEndDate] = useState(revEndDate);

  const [expandedLocations, setExpandedLocations] = useState<Record<string, boolean>>({});
  const [expandedCabinets, setExpandedCabinets] = useState<Record<string, boolean>>({});

  const { data: orderStatsData, isLoading: orderLoading } = useQuery({
    queryKey: ["analytics", "orders", initialStartDate, initialEndDate],
    queryFn: () => analyticsApi.getOrderStats({ startDate: initialStartDate, endDate: initialEndDate }),
  });

  const { data: revenueStatsData, isLoading: revenueLoading } = useQuery({
    queryKey: ["analytics", "revenue", effRevStartDate, effRevEndDate],
    queryFn: () => analyticsApi.getRevenueStats({ startDate: effRevStartDate, endDate: effRevEndDate }),
  });

  const handleUpdateRevenueStats = () => {
    setEffRevStartDate(revStartDate);
    setEffRevEndDate(revEndDate);
  };

  const { data: userStatsData, isLoading: userLoading } = useQuery({
    queryKey: ["analytics", "users"],
    queryFn: () => analyticsApi.getUserGrowth(),
  });

  const { data: lockerStatsData, isLoading: lockerLoading } = useQuery({
    queryKey: ["analytics", "lockers"],
    queryFn: () => analyticsApi.getLockerStats(),
  });

  const orderStats = (orderStatsData as any)?.statistics;
  const revenueStats = (revenueStatsData as any)?.statistics;
  const userStats = (userStatsData as any)?.statistics;
  const lockerStats = (lockerStatsData as any)?.statistics;

  const toggleLocation = (id: string) => {
    setExpandedLocations(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCabinet = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCabinets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (orderLoading || revenueLoading || userLoading || lockerLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const lockerPieData = lockerStats
    ? [
        { name: "Sử dụng", value: lockerStats.occupiedLockers },
        { name: "Trống", value: lockerStats.availableLockers },
        { name: "Ngoại tuyến", value: lockerStats.offlineLockers },
      ]
    : [];

  const revenueByDayData = revenueStats?.revenueByDay 
    ? Object.entries(revenueStats.revenueByDay).map(([date, amount]) => ({ date, amount })) 
    : [];

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-[1600px] mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tổng quan Hệ thống</h1>
          <p className="text-muted-foreground">Theo dõi hoạt động và hiệu suất kinh doanh của bạn.</p>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold uppercase text-muted-foreground">Doanh Thu</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(revenueStats?.totalRevenue || 0).toLocaleString("vi-VN")} đ</div>
            <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Thuê tủ:</span>
                    <span className="font-medium text-blue-600">{(revenueStats?.rentalRevenue || 0).toLocaleString()} đ</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Gửi hàng:</span>
                    <span className="font-medium text-emerald-600">{(revenueStats?.deliveryRevenue || 0).toLocaleString()} đ</span>
                </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold uppercase text-muted-foreground">Đơn Hàng</CardTitle>
            <Package className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats?.totalOrders || 0}</div>
            <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1">
                <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground uppercase">Đang thực hiện</span>
                    <span className="text-xs font-semibold text-blue-600">{orderStats?.activeOrders || 0}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground uppercase">Hoàn thành</span>
                    <span className="text-xs font-semibold text-emerald-600">{orderStats?.completedOrders || 0}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground uppercase">Đã hủy</span>
                    <span className="text-xs font-semibold text-red-600">{orderStats?.cancelledOrders || 0}</span>
                </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold uppercase text-muted-foreground">Người dùng</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(userStats?.totalUsers || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Tổng số thành viên hệ thống</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold uppercase text-muted-foreground">Hạ tầng</CardTitle>
            <Server className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lockerStats?.utilizationRate || 0}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {lockerStats?.occupiedLockers || 0} / {lockerStats?.totalLockers || 0} tủ đang sử dụng
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Section */}
      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 overflow-hidden border-blue-100/50 shadow-sm">
          <CardHeader className="p-4 sm:p-6 bg-slate-50/50 border-b">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg sm:text-xl whitespace-nowrap text-blue-900">Diễn biến Doanh thu</CardTitle>
                  <CardDescription>Doanh thu hàng ngày</CardDescription>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 shrink-0 bg-white p-1 rounded-md border shadow-sm">
                      <Input 
                          type="date" 
                          className="h-8 w-[120px] text-[10px] sm:text-xs border-none bg-transparent focus-visible:ring-0 px-1" 
                          value={revStartDate} 
                          onChange={(e) => setRevStartDate(e.target.value)}
                      />
                      <span className="text-muted-foreground text-xs font-bold">→</span>
                      <Input 
                          type="date" 
                          className="h-8 w-[120px] text-[10px] sm:text-xs border-none bg-transparent focus-visible:ring-0 px-1" 
                          value={revEndDate} 
                          onChange={(e) => setRevEndDate(e.target.value)}
                      />
                  </div>
                  <Button 
                      variant="default" 
                      size="sm" 
                      className="h-8 gap-1.5 px-4 shadow-sm border-1 border-blue-600 bg-transparent hover:bg-blue-700"
                      onClick={handleUpdateRevenueStats}
                      disabled={revenueLoading}
                  >
                      {revenueLoading ? (
                          <RefreshCcw className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                          <RefreshCcw className="h-3.5 w-3.5" />
                      )}
                      Cập nhật
                  </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[350px] w-full">
              {revenueLoading ? (
                <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueByDayData.length > 0 ? revenueByDayData : [{ date: new Date().toISOString(), amount: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="date"
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => format(new Date(value), "dd/MM")}
                    />
                    <YAxis
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${(value / 1000).toLocaleString()}k`}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      formatter={(value: any) => [`${value.toLocaleString()} đ`, "Doanh thu"]}
                      labelFormatter={(label) => format(new Date(label), "dd/MM/yyyy")}
                    />
                    <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 shadow-sm border-blue-50">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="text-blue-900">Trạng thái Tủ</CardTitle>
            <CardDescription>Phân bổ sử dụng trên toàn hệ thống</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={lockerPieData.length ? lockerPieData : [{ name: "Không có dữ liệu", value: 1 }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {(lockerPieData.length ? lockerPieData : [{ name: "Trống", value: 1 }]).map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={lockerPieData.length ? COLORS[index % COLORS.length] : "#f1f5f9"} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    formatter={(value: any) => [value, "Số lượng"]} 
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Infrastructure Summary Section */}
      <Card className="shadow-sm border-blue-100">
        <CardHeader className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 bg-slate-50/60 border-b p-4 sm:p-6">
          <div>
            <CardTitle className="text-blue-900 text-xl font-bold tracking-tight">Chi tiết Hạ tầng & Trạng thái Tủ</CardTitle>
            <CardDescription className="text-slate-500">Thống kê Cabinet và Locker theo từng khu vực (Click để xem chi tiết)</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="group flex flex-col bg-white px-4 py-2 rounded-xl border border-blue-100 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Địa điểm</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-blue-700">{lockerStats?.totalLocations || 0}</span>
                    <div className="flex gap-2 text-[10px]">
                        <span className="text-emerald-600">● {lockerStats?.activeLocations || 0} Hoạt động</span>
                        <span className="text-slate-400">● {lockerStats?.inactiveLocations || 0} Tạm ngưng</span>
                    </div>
                </div>
            </div>
            
            <div className="group flex flex-col bg-white px-4 py-2 rounded-xl border border-orange-100 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-2 mb-1">
                    <Database className="h-4 w-4 text-orange-500" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cụm tủ (Cabinet)</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-orange-700">{lockerStats?.totalCabinets || 0}</span>
                    <div className="flex gap-2 text-[10px]">
                        <span className="text-red-500">● {lockerStats?.inactiveCabinets || 0} Ngoại tuyến</span>
                    </div>
                </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50 border-b">
                <TableHead className="w-[60px]"></TableHead>
                <TableHead className="font-bold text-slate-900">Tên Vị trí / Cabinet</TableHead>
                <TableHead className="text-center font-bold text-slate-900">Trạng thái</TableHead>
                <TableHead className="text-center font-bold text-slate-900">Tổng số Tủ</TableHead>
                <TableHead className="text-center font-bold text-slate-900">Đang dùng</TableHead>
                <TableHead className="text-center font-bold text-slate-900">Còn trống</TableHead>
                <TableHead className="text-center font-bold text-slate-900">Ngoại tuyến</TableHead>
                <TableHead className="text-right font-bold text-slate-900 px-6">Hiệu suất</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lockerStats?.locationStats?.length > 0 ? lockerStats.locationStats.map((loc: any) => (
                <React.Fragment key={loc.locationId}>
                  <TableRow 
                    className="hover:bg-blue-50/30 cursor-pointer group transition-colors"
                    onClick={() => toggleLocation(loc.locationId)}
                  >
                    <TableCell className="text-center">
                      {expandedLocations[loc.locationId] ? (
                        <ChevronDown className="h-4 w-4 text-blue-500 transition-all" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-400 transition-all" />
                      )}
                    </TableCell>
                    <TableCell className="font-bold text-slate-800">{loc.locationName}</TableCell>
                    <TableCell className="text-center">
                        <Badge variant={loc.isActive ? "default" : "secondary"} className={loc.isActive ? "bg-emerald-500 hover:bg-emerald-600 border-none px-3" : "px-3"}>
                            {loc.isActive ? "Đang hoạt động" : "Tạm ngưng"}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-center font-semibold text-slate-700">{loc.totalLockers || 0}</TableCell>
                    <TableCell className="text-center text-blue-600 font-medium">{loc.occupiedLockers || 0}</TableCell>
                    <TableCell className="text-center text-emerald-600 font-medium">{loc.availableLockers || 0}</TableCell>
                    <TableCell className="text-center text-red-500 font-medium">{loc.offlineLockers || 0}</TableCell>
                    <TableCell className="text-right px-6">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${loc.totalLockers > 0 ? Math.round((loc.occupiedLockers / loc.totalLockers) * 100) : 0}%` }}></div>
                        </div>
                        <span className="text-sm font-mono font-bold text-blue-700">
                          {loc.totalLockers > 0 ? Math.round((loc.occupiedLockers / loc.totalLockers) * 100) : 0}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {expandedLocations[loc.locationId] && loc.cabinetStats?.map((cab: any) => (
                    <React.Fragment key={cab.cabinetId}>
                        <TableRow 
                            className="bg-slate-50/40 border-l-4 border-l-blue-400 hover:bg-blue-50/20 transition-colors cursor-pointer"
                            onClick={(e) => toggleCabinet(cab.cabinetId, e)}
                        >
                            <TableCell className="text-right pr-4">
                                {expandedCabinets[cab.cabinetId] ? (
                                    <ChevronDown className="h-3 w-3 text-blue-400 inline" />
                                ) : (
                                    <ChevronRight className="h-3 w-3 text-slate-300 inline" />
                                )}
                            </TableCell>
                            <TableCell className="pl-10 text-sm font-medium text-slate-600 h-10">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                    {cab.cabinetName}
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                <Badge variant="outline" className={`text-[10px] h-5 bg-white ${cab.status === 'ACTIVE' ? 'border-emerald-200 text-emerald-600' : 'border-slate-200 text-slate-500'}`}>
                                {cab.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-center text-sm text-slate-500">{cab.totalLockers}</TableCell>
                            <TableCell className="text-center text-sm text-blue-500/70">{cab.occupiedLockers}</TableCell>
                            <TableCell className="text-center text-sm text-emerald-500/70">{cab.availableLockers}</TableCell>
                            <TableCell className="text-center text-sm text-red-400/80">{cab.offlineLockers}</TableCell>
                            <TableCell className="text-right text-[10px] pr-8 text-slate-400 font-mono">
                                {cab.totalLockers > 0 ? Math.round((cab.occupiedLockers / cab.totalLockers) * 100) : 0}%
                            </TableCell>
                        </TableRow>

                        {expandedCabinets[cab.cabinetId] && (
                            <TableRow className="bg-white/50 border-l-4 border-l-blue-200">
                                <TableCell></TableCell>
                                <TableCell colSpan={7} className="p-4">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                                        {cab.lockerStats?.map((locker: any) => (
                                            <div 
                                                key={locker.lockerId}
                                                className={`flex flex-col items-center justify-center p-2 rounded-lg border text-[10px] transition-all hover:scale-105 ${
                                                    locker.currentStatus === 'OCCUPIED' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                                    locker.hwState === 'OFFLINE' ? 'bg-red-50 border-red-100 text-red-600' :
                                                    'bg-emerald-50 border-emerald-100 text-emerald-700'
                                                }`}
                                            >
                                                <span className="font-bold">{locker.lockerLabel}</span>
                                                <span className="opacity-70 scale-[0.8]">{locker.currentStatus}</span>
                                            </div>
                                        ))}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              )) : (
                <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center text-slate-400 italic">
                        <div className="flex flex-col items-center gap-2">
                            <Server className="h-8 w-8 opacity-20" />
                            <span>Chưa có dữ liệu thống kê hạ tầng</span>
                        </div>
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Growth Chart - Secondary section */}
      <Card className="shadow-sm border-purple-50">
        <CardHeader className="bg-slate-50/50 border-b">
          <CardTitle className="text-purple-900">Tăng trưởng Người dùng</CardTitle>
          <CardDescription>Số lượng tài khoản đăng ký mới theo tháng</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userStats?.newUsersByMonth ? Object.entries(userStats.newUsersByMonth).map(([month, count]) => ({ month, count })) : [{ month: new Date().getMonth() + 1, count: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `Tháng ${value}`}
                />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    formatter={(value: any) => [value, "Người dùng mới"]} 
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
