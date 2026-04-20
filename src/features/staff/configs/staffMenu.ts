import {
  LayoutDashboard,
  Bell,
  User,
  ClipboardList,
  Settings,
  Package,
  MapPin,
  Boxes,
  ServerCog,
  ShoppingBag,
  Box,
} from "lucide-react"
import { type NavItem } from "@/shared/components/layouts/AppSidebar"

export const staffNavMain: NavItem[] = [
  // {
  //   title: "Trang chủ",
  //   url: "/staff/dashboard",
  //   icon: LayoutDashboard,
  //   isActive: false,
  // },
  {
    title: "Task của tôi",
    url: "/staff/my-tasks",
    icon: ClipboardList,
  },
  {
    title: "Quản lý tủ Locker",
    url: "/staff/locations",
    icon: Package,
    items: [
           
      {
        title: "Địa điểm",
        url: "/staff/locations",
        icon: MapPin,
      },
      {
        title: "Cụm tủ",
        url: "/staff/cabinets",
        icon: Boxes,
      },
      {
        title: "Tủ",
        url: "/staff/lockers",
        icon: Box,
      },
      {
        title: "Setup Tủ Mới (RPi)",
        url: "/staff/setup-cabinet",
        icon: ServerCog,
      },
    ],
  },
  {
    title: "Quản lý Đơn hàng",
    url: "/staff/orders",
    icon: ShoppingBag,
  },
  {
    title: "Hồ sơ của tôi",
    url: "/staff/profile",
    icon: User,
  },
  {
    title: "Cài đặt",
    url: "/staff/settings",
    icon: Settings,
  },
]

export const staffNavSecondary: NavItem[] = [
  {
    title: "Thông báo",
    url: "/staff/notifications",
    icon: Bell,
  },
  
]

