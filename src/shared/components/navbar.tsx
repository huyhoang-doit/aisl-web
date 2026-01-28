import {
  Bell,
  ChevronsUpDown,
  User,
  Settings,
  LogOut,
  Mail,
} from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Button } from "@/shared/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover"
import { Badge } from "@/shared/components/ui/badge"
import { ToggleTheme } from "@/features/landing/components/toggle-theme"
import { useAuthStore } from "@/features/auth"
import { toast } from "sonner"

interface NavbarProps {
  notifications?: Array<{
    id: string
    title: string
    message: string
    time: string
    read?: boolean
  }>
}

export function Navbar({ notifications = [] }: NavbarProps) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const unreadCount = notifications.filter((n) => !n.read).length
  
  // Determine role from path to build correct profile link
  const role = location.pathname.startsWith("/admin") ? "admin" : "staff"
  const profilePath = `/${role}/profile`

  const handleLogout = async () => {
    await logout()
   
    navigate("/login")
  }

  // Don't render if user is not available
  if (!user) {
    return null
  }

  return (
    <div className="flex h-16 items-center justify-between gap-4">
      <div className="flex-1" />
      
      <div className="flex items-center gap-2">
        <div className="hidden lg:flex">
            <ToggleTheme />
        </div>
        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative hover:bg-accent transition-colors">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute right-0 top-0 h-4 w-4 rounded-full p-0 text-[10px] flex items-center justify-center shadow-sm shadow-primary/20"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
              <span className="sr-only">Thông báo</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h4 className="text-sm font-semibold">Thông báo</h4>
              {unreadCount > 0 && (
                <Badge variant="secondary">{unreadCount} mới</Badge>
              )}
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center text-sm text-muted-foreground">
                  <Bell className="mb-2 h-8 w-8 opacity-50" />
                  <p>Không có thông báo</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-accent transition-colors ${
                        !notification.read ? "bg-accent/50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {notifications.length > 0 && (
              <div className="border-t p-2">
                <Button variant="ghost" className="w-full text-sm" asChild>
                  <Link to="/notifications">Xem tất cả</Link>
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2 py-1.5 h-auto hover:bg-accent transition-colors"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback>
                  {user.username
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start text-left">
                <span className="text-sm font-medium leading-none">
                  {user.username}
                </span>
                <span className="text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-1 h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback>
                    {user.username
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-medium">{user.username}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to={profilePath}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Hồ sơ</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/${role}/settings`}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Cài đặt</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

