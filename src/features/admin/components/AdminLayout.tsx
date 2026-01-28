import { AppLayout } from "@/shared/components/layouts/AppLayout"
import { adminNavMain, adminNavSecondary } from "../configs/adminMenu"

// Mock notifications - replace with actual notifications from context/store
const mockNotifications = [
  {
    id: "1",
    title: "Yêu cầu mới",
    message: "Có một yêu cầu giao hàng mới cần xử lý",
    time: "5 phút trước",
    read: false,
  },
  {
    id: "2",
    title: "Báo cáo doanh thu",
    message: "Báo cáo doanh thu tháng này đã sẵn sàng",
    time: "1 giờ trước",
    read: false,
  },
  {
    id: "3",
    title: "Cập nhật hệ thống",
    message: "Hệ thống đã được cập nhật thành công",
    time: "2 giờ trước",
    read: true,
  },
]

export function AdminLayout() {
  return (
    <AppLayout
      sidebarProps={{
        logo: {
          title: "Lockerly",
          subtitle: "Trang quản trị",
          href: "/admin/dashboard",
        },
        navMain: adminNavMain,
        navSecondary: adminNavSecondary,
      }}
      notifications={mockNotifications}
    />
  )
}

