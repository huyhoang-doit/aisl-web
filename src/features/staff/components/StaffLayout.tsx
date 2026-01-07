import { AppLayout } from "@/shared/components/layouts/AppLayout"
import { staffNavMain, staffNavSecondary } from "../configs/staffMenu"

// Mock user data - replace with actual user data from context/store
const mockUser = {
  name: "Staff User",
  email: "staff@lockerly.com",
  avatar: "/src/assets/logo.png",
}

// Mock notifications - replace with actual notifications from context/store
const mockNotifications = [
  {
    id: "1",
    title: "Giao dịch mới",
    message: "Có một giao dịch mới cần xử lý",
    time: "10 phút trước",
    read: false,
  },
  {
    id: "2",
    title: "Lỗi hệ thống",
    message: "Phát hiện lỗi tại khu vực A",
    time: "30 phút trước",
    read: false,
  },
]

export function StaffLayout() {
  return (
    <AppLayout
      sidebarProps={{
        logo: {
          title: "Lockerly",
          subtitle: "Cổng nhân viên",
          href: "/staff/dashboard",
        },
        navMain: staffNavMain,
        navSecondary: staffNavSecondary,
      }}
      user={mockUser}
      notifications={mockNotifications}
    />
  )
}

