import {
  LayoutDashboard,
  Package,
  History,
  AlertTriangle,
  Bell,
  BarChart3,
  User,
  UserCog,
} from "lucide-react"
import { type NavItem } from "@/shared/components/layouts/AppSidebar"

export const staffNavMain: NavItem[] = [
  {
    title: "Trang chủ",
    url: "/staff/dashboard",
    icon: LayoutDashboard,
    isActive: false,
  },
  {
    title: "Báo cáo doanh thu",
    url: "/staff/revenue",
    icon: BarChart3,
  },
  {
    title: "Quản lý lockers ",
    url: "/staff/list-lockers",
    icon: Package,
    // items: [
    //   {
    //     title: "Tất cả khu vực",
    //     url: "/staff/lockers",
    //   },
    //   {
    //     title: "Chi tiết tủ",
    //     url: "/staff/lockers/detail",
    //   },
    // ],
  },
  {
    title: "Quản lý báo cáo",
    url: "/staff/manage-reports",
    icon: AlertTriangle,
    items: [
      {
        title: "Phía khách hàng",
        url: "/staff/manage-reports",
        icon: User,
      },
      {
        title: "Quản lý task",
        url: "/staff/manage-tasks",
        icon: UserCog,
      },
    ],
  },
  {
    title: "Lịch sử giao dịch ",
    url: "/staff/transactions",
    icon: History,
    // items: [
    //   {
    //     title: "Tất cả giao dịch",
    //     url: "/staff/transactions",
    //   },
    //   {
    //     title: "Chi tiết giao dịch",
    //     url: "/staff/transactions/detail",
    //   },
    // ],
  },
]

export const staffNavSecondary: NavItem[] = [
  {
    title: "Thông báo",
    url: "/staff/notifications",
    icon: Bell,
  },
]

