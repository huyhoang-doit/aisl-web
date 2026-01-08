import {
  LayoutDashboard,
  Users,
  Package,
  DollarSign,
  BarChart3,
  Bell,
} from "lucide-react"
import { type NavItem } from "@/shared/components/layouts/AppSidebar"

export const adminNavMain: NavItem[] = [
  {
    title: "Trang chủ",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
    isActive: false,
  },
  {
    title: "Báo cáo doanh thu",
    url: "/admin/revenue",
    icon: BarChart3,
  },
  {
    title: "Quản lý tài khoản",
    url: "/admin/users",
    icon: Users,
    items: [
      {
        title: "Danh sách người dùng",
        url: "/admin/users",
      },
      {
        title: "Danh sách nhân viên",
        url: "/admin/staff",
      },
      {
        title: "Yêu cầu duyệt Courier",
        url: "/admin/courier-requests",
      },
      {
        title: "Danh sách tài khoản đã khoá",
        url: "/admin/locked-accounts",
      },
    ],
  },
  {
    title: "Quản lý locker",
    url: "/admin/lockers",
    icon: Package,
    // items: [
    //   {
    //     title: "Tất cả tủ",
    //     url: "/admin/lockers",
    //   },
    //   {
    //     title: "Chi tiết tủ",
    //     url: "/admin/lockers/detail",
    //   },
    // ],
  },
  {
    title: "Quản lý bảng giá",
    url: "/admin/pricing",
    icon: DollarSign,
    // items: [
    //   {
    //     title: "Tất cả bảng giá",
    //     url: "/admin/pricing",
    //   },
    //   {
    //     title: "Chi tiết bảng giá",
    //     url: "/admin/pricing/detail",
    //   },
    // ],
  },
 
]

export const adminNavSecondary: NavItem[] = [
  {
    title: "Thông báo",
    url: "/admin/notifications",
    icon: Bell,
  },
]

