import {
  LayoutDashboard,
  Users,
  Package,
  DollarSign,
  BarChart3,
  Bell,
  MapPin,
  Box,
  Lock,
  User,
  UserCog,
  UserRoundPen,
  Boxes,
  AlertTriangle,
  History,
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
        title: "Người dùng",
        url: "/admin/users",
        icon: User,
      },
      {
        title: "Nhân viên",
        url: "/admin/staff",
        icon: UserCog,
      },
      {
        title: "Duyệt người chuyển phát",
        url: "/admin/courier-requests",
        icon: UserRoundPen,
      },
      {
        title: "Tài khoản đã khoá",
        url: "/admin/locked-accounts",
        icon: Lock,
      },
    ],
  },
  {
    title: "Quản lý locker",
    url: "/admin/locations",
    icon: Package,
    items: [
      {
        title: "Địa điểm",
        url: "/admin/locations",
        icon: MapPin,
      },
      {
        title: "Cụm tủ",
        url: "/admin/cabinets",
        icon: Boxes,
      },
      {
        title: "Tủ",
        url: "/admin/lockers",
        icon: Box,
      },
    ],
  },
  {
    title: "Quản lý báo cáo",
    url: "/admin/manage-reports",
    icon: AlertTriangle,
    items: [
      {
        title: "Phía khách hàng",
        url: "/admin/manage-reports",
        icon: User,
      },
      {
        title: "Phía nv kỹ thuật",
        url: "/admin/manage-reports-staff",
        icon: UserCog,
      },
    ],
  },
  {
    title: "Quản lý gói đăng ký",
    url: "/admin/plans",
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
  {
    title: "Lịch sử giao dịch ",
    url: "/admin/transactions",
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

export const adminNavSecondary: NavItem[] = [
  {
    title: "Thông báo",
    url: "/admin/notifications",
    icon: Bell,
  },
]

