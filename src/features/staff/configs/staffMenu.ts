import {
  LayoutDashboard,
  Package,
  History,
  AlertTriangle,
  Bell,
  BarChart3,
  User,
  UserCog,
  ClipboardList,
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
]

export const staffNavSecondary: NavItem[] = [
  {
    title: "Thông báo",
    url: "/staff/notifications",
    icon: Bell,
  },
]

