import {
  LayoutDashboard,
  Bell,
  User,
  ClipboardList,
  Settings,
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
    title: "Task của tôi",
    url: "/staff/my-tasks",
    icon: ClipboardList,
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

