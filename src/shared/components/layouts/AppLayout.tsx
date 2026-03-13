import { Outlet } from "react-router-dom"
import { AppSidebar, type AppSidebarProps } from "./AppSidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar"
import { Separator } from "@/shared/components/ui/separator"
import { Navbar } from "@/shared/components/navbar"

export interface AppLayoutProps {
  sidebarProps: AppSidebarProps
}

export function AppLayout({
  sidebarProps,
}: AppLayoutProps) {
  return (
    <SidebarProvider className="h-screen overflow-hidden">
      <AppSidebar className="relative z-0" {...sidebarProps} />
      <SidebarInset className="overflow-hidden bg-background">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/60 px-4 relative bg-[var(--navbar)] backdrop-blur-sm z-10">
          <div className="flex items-center gap-2 justify-between w-full">
            <div className="flex items-center">
              <SidebarTrigger className="-ml-1 hover:bg-accent transition-colors" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
            <Navbar />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 overflow-y-auto h-full">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
