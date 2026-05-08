import {
  Users,
  Package,
  DollarSign,
  MapPin,
  Box,
  User,
  UserCog,
  UserRoundPen,
  Boxes,
  AlertTriangle,
  History,
  ServerCog,
  Activity,
  Monitor,
  Bell,
  ShoppingBag,
  Ruler,
  Cpu,
} from "lucide-react"
import { type NavItem } from "@/shared/components/layouts/AppSidebar"

export const adminNavMain: NavItem[] = [
  // {
  //   title: "Trang chủ",
  //   url: "/admin/dashboard",
  //   icon: LayoutDashboard,
  //   isActive: false,
  // },
  // {
  //   title: "Báo cáo doanh thu",
  //   url: "/admin/revenue",
  //   icon: BarChart3,
  // },
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
      // {
      //   title: "Duyệt người chuyển phát",
      //   url: "/admin/courier-requests",
      //   icon: UserRoundPen,
      // },
      {
        title: "Duyệt yêu cầu nhân viên",
        url: "/admin/staff-applications",
        icon: UserRoundPen,
      },
      // {
      //   title: "Tài khoản đã khoá",
      //   url: "/admin/locked-accounts",
      //   icon: Lock,
      // },
    ],
  },
  {
    title: "Quản lý tủ",
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
      {
        title: "Kích thước",
        url: "/admin/sizes",
        icon: Ruler,
      },
      {
        title: "Thiết bị tủ và setup",
        url: "/admin/device-attachments",
        icon: Monitor,
      },
      {
        title: "Giám sát hệ thống",
        url: "/admin/hardware-monitor",
        icon: Activity,
      },
      {
        title: "Setup Tủ Mới (RPi)",
        url: "/admin/setup-cabinet",
        icon: ServerCog,
      },
    ],
  },
  {
    title: "Cấu hình Hệ thống AI",
    url: "/admin/ai-config",
    icon: Cpu,
  },
  {
    title: "Điều phối Logistics",
    url: "/admin/dispatch-map",
    icon: MapPin,
    items: [
      {
        title: "Bản đồ Shipper",
        url: "/admin/dispatch-map",
        icon: MapPin,
      },
      {
        title: "Loại phương tiện",
        url: "/admin/vehicles",
        icon: MapPin,
      },
    ],
  },
  {
    title: "Quản lý Đơn hàng",
    url: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "Giao dịch",
    url: "/admin/transactions",
    icon: DollarSign,
  },
  {
    title: "Quản lý báo cáo",
    url: "/admin/manage-reports",
    icon: AlertTriangle,
    items: [
      {
        title: "Báo cáo sự cố",
        url: "/admin/manage-reports",
        icon: AlertTriangle,
      },
      {
        title: "Công việc kỹ thuật",
        url: "/admin/manage-tasks",
        icon: UserCog,
      },
    ],
  },
  {
    title: "Quản lý dịch vụ",
    url: "/admin/plans",
    icon: DollarSign,
    items: [
      {
        title: "Gói đăng ký",
        url: "/admin/plans",
        icon: Package,
      },
      {
        title: "Danh sách đã đăng ký",
        url: "/admin/subscriptions",
        icon: History,
      },
      {
        title: "Bảng giá",
        url: "/admin/pricing",
        icon: DollarSign,
      },
    ],
  },
  {
    title: "Logs ",
    url: "/admin/device-logs",
    icon: History,
    items: [
      {
        title: "Logs thiết bị",
        url: "/admin/device-logs",
        icon: Monitor,
      },
      {
        title: "Logs hoạt động",
        url: "/admin/activity-logs",
        icon: Activity,
      },
    ],
  },
 
]

export const adminNavSecondary: NavItem[] = [
  {
    title: "Thông báo",
    url: "/admin/notifications",
    icon: Bell,
  },
]

