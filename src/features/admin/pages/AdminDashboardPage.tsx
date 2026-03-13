import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../features/dashboard/api/analytics.api";
import { format } from "date-fns";
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
import { Loader2 } from "lucide-react";
import { useState } from "react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AdminDashboardPage = () => {
  // Demo state for date picking if required later, using static or a default range for now
  const [startDate] = useState(format(new Date(new Date().setMonth(new Date().getMonth() - 1)), "yyyy-MM-dd"));
  const [endDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const { data: orderStats, isLoading: orderLoading } = useQuery({
    queryKey: ["analytics", "orders", startDate, endDate],
    queryFn: () => analyticsApi.getOrderStats({ startDate, endDate }),
  });

  const { data: revenueStats, isLoading: revenueLoading } = useQuery({
    queryKey: ["analytics", "revenue", startDate, endDate],
    queryFn: () => analyticsApi.getRevenueStats({ startDate, endDate }),
  });

  const { data: userStats, isLoading: userLoading } = useQuery({
    queryKey: ["analytics", "users"],
    queryFn: () => analyticsApi.getUserGrowth(),
  });

  const { data: lockerStats, isLoading: lockerLoading } = useQuery({
    queryKey: ["analytics", "lockers"],
    queryFn: () => analyticsApi.getLockerStats(),
  });

  if (orderLoading || revenueLoading || userLoading || lockerLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const lockerPieData = lockerStats?.statistics
    ? [
        { name: "Sử dụng", value: lockerStats.statistics.occupiedLockers },
        { name: "Trống", value: lockerStats.statistics.availableLockers },
        { name: "Ngoại tuyến", value: lockerStats.statistics.offlineLockers },
      ]
    : [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <div className="text-sm text-muted-foreground">
          Thống kê từ {startDate} đến {endDate}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Doanh Thu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {revenueStats?.statistics?.totalRevenue?.toLocaleString("vi-VN") || 0} đ
            </div>
            <p className="text-xs text-muted-foreground">Doanh thu trong kỳ</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Đơn Hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              Giao/Nhận: {orderStats?.deliveryOrders || 0} | Thuê: {orderStats?.rentalOrders || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Người Dùng Mới</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats?.statistics?.totalUsers || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ sử dụng tủ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lockerStats?.statistics?.utilizationRate || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {lockerStats?.statistics?.occupiedLockers || 0} / {lockerStats?.statistics?.totalLockers || 0} tủ đang dùng
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Biểu đồ doanh thu</CardTitle>
            <CardDescription>Doanh thu hàng ngày ({startDate} - {endDate})</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueStats?.statistics?.revenueByDay ? Object.entries(revenueStats.statistics.revenueByDay).map(([date, amount]) => ({ date, amount })) : [{ date: new Date().toISOString(), amount: 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => format(new Date(value), "dd/MM")}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value.toLocaleString()}`}
                  />
                  <Tooltip
                    formatter={(value: any) => [`${value.toLocaleString()} đ`, "Doanh thu"]}
                    labelFormatter={(label) => format(new Date(label), "dd/MM/yyyy")}
                  />
                  <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Tỷ lệ sử dụng tủ</CardTitle>
            <CardDescription>Tổng số tủ trên toàn hệ thống kết nối</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={lockerPieData.length ? lockerPieData : [{ name: "Trống", value: 1 }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {(lockerPieData.length ? lockerPieData : [{ name: "Trống", value: 1 }]).map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={lockerPieData.length ? COLORS[index % COLORS.length] : "#e5e7eb"} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [value, "Số lượng"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>Biểu đồ tăng trưởng người dùng mới</CardTitle>
            <CardDescription>Số lượng người dùng đăng ký mới</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userStats?.statistics?.newUsersByMonth ? Object.entries(userStats.statistics.newUsersByMonth).map(([month, count]) => ({ month, count })) : [{ month: new Date().getMonth() + 1, count: 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value: any) => [value, "Người dùng mới"]} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#8884d8"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
