import { AppLayout } from "@/shared/components/layouts/AppLayout"
import { staffNavMain, staffNavSecondary } from "../configs/staffMenu"
import { FcmHandler } from "@/shared/hooks"

export function StaffLayout() {
  return (
    <>
      <FcmHandler />
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
      />
    </>
  )
}
