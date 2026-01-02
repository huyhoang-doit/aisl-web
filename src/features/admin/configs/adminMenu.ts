import {
  LayoutDashboard,
  Users,
  UserCog,
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
    title: "Quản lý người dùng",
    url: "/admin/users",
    icon: Users,
    // items: [
    //   {
    //     title: "Danh sách người dùng",
    //     url: "/admin/users",
    //   },
    //   {
    //     title: "Danh sách người dùng đã khoá",
    //     url: "/admin/users/locked",
    //   },
    // ],
  },
  {
    title: "Quản lý nhân viên",
    url: "/admin/staff",
    icon: UserCog,
    // items: [
    //   {
    //     title: "Tất cả nhân viên",
    //     url: "/admin/staff",
    //   },
    //   {
    //     title: "Chi tiết nhân viên",
    //     url: "/admin/staff/detail",
    //   },
    // ],
  },
  {
    title: "Yêu cầu duyệt Courier",
    url: "/admin/courier-requests",
    icon: UserCog,
    // items: [
    //   {
    //     title: "Tất cả nhân viên",
    //     url: "/admin/staff",
    //   },
    //   {
    //     title: "Chi tiết nhân viên",
    //     url: "/admin/staff/detail",
    //   },
    // ],
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

