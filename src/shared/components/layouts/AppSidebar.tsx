import * as React from "react"
import { type LucideIcon, Command } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import { NavMain } from "@/shared/components/nav-main"
import { NavSecondary } from "@/shared/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar"

export interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
  items?: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  logo?: {
    title: string
    subtitle: string
    href: string
  }
  navMain: NavItem[]
  navSecondary?: NavItem[]
}

export function AppSidebar({
  logo = {
    title: "Lockerly",
    subtitle: "Dashboard",
    href: "/dashboard",
  },
  navMain,
  navSecondary = [],
  ...props
}: AppSidebarProps) {
  const location = useLocation()

  // Update active state based on current location
  const navMainWithActive = navMain.map((item) => ({
    ...item,
    isActive:
      location.pathname.startsWith(item.url) ||
      item.items?.some((subItem) => location.pathname === subItem.url),
  }))

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader className="relative overflow-hidden border-b border-sidebar-border/50">
        {/* Gradient background */}
        <div 
          className="absolute inset-0 opacity-100 dark:opacity-100"
          style={{
            background: "linear-gradient(135deg, oklch(0.7686 0.1647 70.0804 / 0.08), oklch(0.7686 0.1647 70.0804 / 0.03))",
          }}
        />
        <div className="relative z-10">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="hover:bg-sidebar-accent/50 transition-colors">
                <Link to={logo.href}>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-sidebar-primary to-sidebar-primary/80 text-sidebar-primary-foreground shadow-sm shadow-sidebar-primary/20">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{logo.title}</span>
                    <span className="truncate text-xs text-sidebar-foreground/70">{logo.subtitle}</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainWithActive} />
        {navSecondary.length > 0 && (
          <NavSecondary items={navSecondary} className="mt-auto" />
        )}
      </SidebarContent>
    </Sidebar>
  )
}
