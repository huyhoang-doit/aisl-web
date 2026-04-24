"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/shared/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
      icon?: LucideIcon
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sidebar-foreground/80 font-semibold uppercase tracking-wider text-[10px]">
        Hệ thống
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      tooltip={item.title}
                      isActive={item.isActive}
                      className={item.isActive ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm shadow-sidebar-primary/10 border-l-2 border-sidebar-primary cursor-pointer hover:bg-sidebar-accent/50 group/collapsible" : "cursor-pointer hover:bg-sidebar-accent/50 group/collapsible"}
                    >
                      <item.icon className={item.isActive ? "text-sidebar-primary" : ""} />
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link to={subItem.url}>
                              {subItem.icon && <subItem.icon className={item.isActive ? "text-sidebar-primary" : ""} />}
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : (
                <SidebarMenuButton 
                  asChild 
                  tooltip={item.title}
                  isActive={item.isActive}
                  className={item.isActive ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm shadow-sidebar-primary/10 border-l-2 border-sidebar-primary" : ""}
                >
                  <Link to={item.url} className="w-full">
                    <item.icon className={item.isActive ? "text-sidebar-primary" : ""} />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

