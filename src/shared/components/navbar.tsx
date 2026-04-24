import {
  Bell,
  ChevronsUpDown,
  User,
  Settings,
  LogOut,
  Mail,
  Check,
  Loader2,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs"
import { Button } from "@/shared/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover"
import { Badge } from "@/shared/components/ui/badge"
import { ToggleTheme } from "@/features/landing/components/toggle-theme"
import { useAuthStore } from "@/features/auth"
import { useNotification } from "@/shared/hooks/useNotification"

export function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  } = useNotification()

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
                  className="absolute right-0 top-0 h-4 w-4 rounded-full p-0 text-[10px] flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white shadow-sm"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
              <span className="sr-only">Thông báo</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <h4 className="font-semibold text-sm">Thông báo</h4>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-primary"
                    onClick={markAllAsRead}
                  >
                    <Check className="mr-1 h-3 w-3" />
                    Đọc hết
                  </Button>
                )}
              </div>
              <div className="px-4 py-2">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="all">
                    Tất cả
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="relative">
                    Chưa đọc
                    {unreadCount > 0 && (
                      <Badge className="ml-1.5 h-4 min-w-[1rem] px-1 text-[10px] flex items-center justify-center rounded-full bg-yellow-500 hover:bg-yellow-600 text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                <TabsContent value="all" className="m-0">
                  <NotificationList
                    notifications={notifications}
                    isLoading={isLoading}
                    onMarkAsRead={markAsRead}
                  />
                </TabsContent>
                <TabsContent value="unread" className="m-0">
                  <NotificationList
                    notifications={notifications.filter((n) => !n.read)}
                    isLoading={isLoading}
                    onMarkAsRead={markAsRead}
                    emptyMessage="Không có thông báo chưa đọc"
                  />
                </TabsContent>
              </div>

              {notifications.length > 0 && (
                <div className="border-t p-2">
                  <Button variant="ghost" className="w-full text-sm" asChild>
                    <Link to={`/${role}/notifications`}>Xem tất cả</Link>
                  </Button>
                </div>
              )}
            </Tabs>
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

function NotificationList({
  notifications,
  isLoading,
  onMarkAsRead,
  emptyMessage = "Không có thông báo",
}: {
  notifications: import("@/shared/types/notification.types").Notification[];
  isLoading: boolean;
  onMarkAsRead: (id: string) => void;
  emptyMessage?: string;
}) {
  if (isLoading && notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-sm text-muted-foreground">
        <Loader2 className="mb-2 h-8 w-8 animate-spin opacity-50" />
        <p>Đang tải thông báo...</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-sm text-muted-foreground">
        <Bell className="mb-2 h-8 w-8 opacity-50" />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-accent cursor-pointer ${
            !notification.read ? "bg-primary/5" : ""
          }`}
          onClick={() => {
            if (!notification.read) {
              onMarkAsRead(notification.id);
            }
          }}
        >
          {/* Avatar / Icon */}
          <Avatar className="mt-0.5 h-9 w-9 border">
            <AvatarImage src={notification.data?.avatar} />
            <AvatarFallback className={`${!notification.read ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
              {notification.type === 'ORDER' ? (
                <Mail className="h-4 w-4" />
              ) : notification.type === 'SYSTEM' ? (
                <Settings className="h-4 w-4" />
              ) : (
                <Bell className="h-4 w-4" />
              )}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm leading-none">
                <span className="font-semibold text-foreground">{notification.title}</span>{" "}
                <span className="text-muted-foreground font-normal">{notification.body}</span>
              </p>
              {!notification.read && (
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary ring-2 ring-background" />
              )}
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              {formatTimeAgo(notification.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatTimeAgo(timestamp: string | number): string {
  if (!timestamp) return "Vừa xong";
  const date = new Date(timestamp).getTime();

  const seconds = Math.floor((Date.now() - date) / 1000)
  if (seconds < 60) return "Vừa xong"
  if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`
  return `${Math.floor(seconds / 86400)} ngày trước`
}
