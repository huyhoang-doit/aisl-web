import { Outlet } from "react-router-dom"
import { AppSidebar, type AppSidebarProps } from "./AppSidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar"
import { Separator } from "@/shared/components/ui/separator"
import { Navbar } from "@/shared/components/navbar"

export interface Notification {
  id: string
  title: string
  message: string
  time: string
  read?: boolean
}

export interface AppLayoutProps {
  sidebarProps: AppSidebarProps
  user: {
    name: string
    email: string
    avatar: string
  }
  notifications?: Notification[]
}

export function AppLayout({
  sidebarProps,
  user,
  notifications = [],
}: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar className="relative z-0" {...sidebarProps} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <div className="flex items-center gap-2 justify-between w-full">
            <div>
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
            <Navbar user={user} notifications={notifications} />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

