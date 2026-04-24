import { AppLayout } from "@/shared/components/layouts/AppLayout"
import { adminNavMain, adminNavSecondary } from "../configs/adminMenu"
import { FcmHandler } from "@/shared/hooks"

export function AdminLayout() {
  return (
    <>
      <FcmHandler />
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
      />
    </>
  )
}
