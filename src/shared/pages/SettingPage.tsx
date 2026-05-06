import * as React from "react"
import {
  Moon,
  Sun,
  Eye,
  EyeOff,
  Lock,
  Trash2,
  Bell,
  BellOff,
  Server,
  DoorOpen,
  Loader2,
} from "lucide-react"
import { cabinetService } from "@/features/admin/features/cabinet/services/cabinet.service"
import { lockerService } from "@/features/admin/features/locker/services/locker.service"
import type { Cabinet } from "@/features/admin/features/cabinet/types/cabinet.types"
import type { Locker } from "@/features/admin/features/locker/types/locker.types"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Label } from "@/shared/components/ui/label"
import { Switch } from "@/shared/components/ui/switch"
import { Input } from "@/shared/components/ui/input"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { authService } from "@/features/auth"
import { useAuthStore } from "@/features/auth/store/auth.store"
import { useFcmToken } from "@/shared/hooks/useFcmToken"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog"

const FCM_DISMISSED_KEY = "fcm_popup_dismissed";

export default function SettingPage() {
  const { theme, setTheme } = useTheme()
  const { token: jwt } = useAuthStore()
  const registerFcmToken = useFcmToken(jwt)
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [notificationLoading, setNotificationLoading] = React.useState(false)
  const [changingPassword, setChangingPassword] = React.useState(false)

  // Real notification permission state
  const [notificationEnabled, setNotificationEnabled] = React.useState(() => {
    if (typeof Notification === "undefined") return false
    return Notification.permission === "granted"
  })

  // Settings state
  const [settings, setSettings] = React.useState({
    theme: theme || "light",
  })

  // Cabinets & Lockers State
  const [cabinets, setCabinets] = React.useState<Cabinet[]>([])
  const [loadingCabinets, setLoadingCabinets] = React.useState(false)
  const [selectedCabinetId, setSelectedCabinetId] = React.useState<string | null>(null)
  const [lockers, setLockers] = React.useState<Locker[]>([])
  const [loadingLockers, setLoadingLockers] = React.useState(false)
  const [openingLockerId, setOpeningLockerId] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchCabinets = async () => {
      try {
        setLoadingCabinets(true)
        const response = await cabinetService.getAll({ limit: 100 })
        setCabinets(response.data.cabinets || [])
      } catch (error) {
        console.error("Failed to load cabinets:", error)
        toast.error("Không thể tải danh sách cụm tủ")
      } finally {
        setLoadingCabinets(false)
      }
    }
    fetchCabinets()
  }, [])

  const handleSelectCabinet = async (cabinetId: string) => {
    setSelectedCabinetId(cabinetId)
    try {
      setLoadingLockers(true)
      const response = await lockerService.getLockerCabinet(cabinetId, { limit: 100, page: 1 })
      setLockers(response.data.lockers || [])
    } catch (error) {
      console.error("Failed to load lockers:", error)
      toast.error("Không thể tải danh sách ngăn tủ")
    } finally {
      setLoadingLockers(false)
    }
  }

  const handleOpenLocker = async (lockerId: string, lockerLabel: string | number) => {
    try {
      setOpeningLockerId(lockerId)
      await lockerService.open(lockerId)
      toast.success(`Đã gửi lệnh mở ngăn tủ ${lockerLabel} thành công!`)
    } catch (error: any) {
      console.error("Failed to open locker:", error)
      toast.error(error?.response?.data?.message || `Không thể mở ngăn tủ ${lockerLabel}`)
    } finally {
      setOpeningLockerId(null)
    }
  }

  const handleToggleNotification = async (checked: boolean) => {
    if (typeof Notification === "undefined") {
      toast.error("Trình duyệt không hỗ trợ thông báo.")
      return
    }

    if (checked) {
      // User wants to enable notifications
      if (Notification.permission === "denied") {
        toast.error(
          "Thông báo đã bị chặn bởi trình duyệt. Vui lòng mở cài đặt trình duyệt (biểu tượng khóa trên thanh địa chỉ) để cho phép thông báo.",
          { duration: 6000 }
        )
        return
      }

      setNotificationLoading(true)
      try {
        const success = await registerFcmToken()
        if (success) {
          setNotificationEnabled(true)
          // Clear dismissed flag so FcmHandler knows it's been re-enabled
          sessionStorage.removeItem(FCM_DISMISSED_KEY)
          toast.success("Đã bật thông báo thành công!")
        } else {
          toast.error("Không thể bật thông báo. Vui lòng kiểm tra cài đặt trình duyệt.")
        }
      } catch {
        toast.error("Đã xảy ra lỗi khi bật thông báo.")
      } finally {
        setNotificationLoading(false)
      }
    } else {
      // User wants to disable — we can't revoke browser permission via JS,
      // but we can mark it as dismissed so FcmHandler won't auto-register
      sessionStorage.setItem(FCM_DISMISSED_KEY, "true")
      setNotificationEnabled(false)
      toast.info("Đã tắt thông báo. Để chặn hoàn toàn, hãy vào cài đặt trình duyệt.")
    }
  }

  // Password change state
  const [passwordData, setPasswordData] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    setSettings((prev) => ({ ...prev, theme: newTheme }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSavePassword = async () => {
    if (!jwt) {
      toast.error("Vui lòng đăng nhập lại để đổi mật khẩu.")
      return
    }
    if (!passwordData.currentPassword) {
      toast.error("Vui lòng nhập mật khẩu hiện tại")
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp")
      return
    }
    // if (passwordData.newPassword.length < 8) {
    //   toast.error("Mật khẩu phải có ít nhất 8 ký tự")
    //   return
    // }

    const payloadEmail = useAuthStore.getState().user?.email
    if (!payloadEmail) {
      toast.error("Không tìm thấy email tài khoản. Vui lòng đăng nhập lại.")
      return
    }

    setChangingPassword(true)
    try {
      await authService.changePassword({
        email: payloadEmail,
        newPassword: passwordData.newPassword,
      })
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      toast.success("Đổi mật khẩu thành công!")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Đổi mật khẩu thất bại"
      toast.error(message)
    } finally {
      setChangingPassword(false)
    }
  }

  const handleDeleteAccount = () => {
    // TODO: Implement delete account API call
    console.log("Deleting account...")
    alert("Tài khoản đã được xóa!")
  }

  return (
    <div className="container mx-auto py-6 space-y-4 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cài đặt</h1>
      </div>

      <div className="space-y-4">
        {/* Theme Settings */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme" className="text-base font-medium">Giao diện sáng / tối</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant={settings.theme === "light" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange("light")}
                >
                  <Sun className="mr-2 h-4 w-4" />
                  Sáng
                </Button>
                <Button
                  variant={settings.theme === "dark" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange("dark")}
                >
                  <Moon className="mr-2 h-4 w-4" />
                  Tối
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {notificationEnabled ? (
                  <Bell className="h-5 w-5 text-primary" />
                ) : (
                  <BellOff className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <Label htmlFor="notifications" className="text-base font-medium">Bật / Tắt thông báo</Label>
                  <p className="text-sm text-muted-foreground">
                    {notificationEnabled
                      ? "Đang nhận thông báo từ hệ thống"
                      : "Thông báo đang tắt"}
                  </p>
                </div>
              </div>
              <Switch
                id="notifications"
                checked={notificationEnabled}
                disabled={notificationLoading}
                onCheckedChange={handleToggleNotification}
              />
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Label className="text-base font-medium">Đổi mật khẩu</Label>
            <div className="space-y-2">
              <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Nhập mật khẩu hiện tại"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">Mật khẩu mới</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Nhập lại mật khẩu mới"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button onClick={handleSavePassword} className="w-full" disabled={changingPassword}>
              <Lock className="mr-2 h-4 w-4" />
              {changingPassword ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
            </Button>
          </CardContent>
        </Card>

        {/* Administrative Cabinets & Lockers */}
        <Card className="overflow-hidden border border-muted/80 shadow-md">
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 text-green-600 rounded-lg shrink-0">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <Label className="text-base font-bold">Điều khiển Cụm tủ & Ngăn tủ</Label>
                <p className="text-sm text-muted-foreground">Chọn cụm tủ để kiểm tra và mở khoá từng ngăn trực tiếp tại chỗ</p>
              </div>
            </div>

            {loadingCabinets ? (
              <div className="flex items-center gap-2 justify-center py-8 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin text-primary" /> Đang tải danh sách cụm tủ...
              </div>
            ) : (
              <div className="space-y-4">
                {/* Cabinets Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {cabinets.map((cabinet) => {
                    const isSelected = selectedCabinetId === cabinet.id;
                    return (
                      <button
                        key={cabinet.id}
                        type="button"
                        onClick={() => handleSelectCabinet(cabinet.id)}
                        className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                          isSelected 
                            ? "bg-primary/5 border-primary shadow-[0_0_0_1px_rgba(59,130,246,0.5)] text-foreground" 
                            : "bg-muted/10 border-muted hover:border-primary/20 hover:bg-muted/20"
                        }`}
                      >
                        <div className="font-bold text-sm truncate">{cabinet.name}</div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5 truncate">{cabinet.macAddress}</div>
                        <div className="text-[10px] text-muted-foreground font-mono truncate">{cabinet.ipAddress || "No IP"}</div>
                      </button>
                    )
                  })}
                  {cabinets.length === 0 && (
                    <div className="col-span-full text-center py-6 text-sm text-muted-foreground border border-dashed rounded-xl">
                      Không tìm thấy cụm tủ nào.
                    </div>
                  )}
                </div>

                {/* Lockers Grid for selected Cabinet */}
                {selectedCabinetId && (
                  <div className="border-t pt-5 mt-4 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                        <DoorOpen className="w-4 h-4 text-green-600 animate-pulse" />
                        Danh sách ngăn tủ của: {cabinets.find(c => c.id === selectedCabinetId)?.name}
                      </h4>
                      {loadingLockers && (
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      )}
                    </div>

                    {loadingLockers ? (
                      <div className="flex items-center gap-2 justify-center py-8 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" /> Đang tải dữ liệu ngăn tủ...
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {lockers.map((locker) => {
                          const isLockerOpening = openingLockerId === locker.id;
                          const lockerLabel = locker.lockerLabel || (locker as any).slotIndex || `${locker.row}-${locker.column}`;
                          
                          return (
                            <div 
                              key={locker.id}
                              className="p-3 bg-muted/10 rounded-xl border border-muted/60 shadow-sm flex flex-col justify-between items-center gap-3 hover:border-primary/20 transition-all duration-300"
                            >
                              <div className="text-center">
                                <span className="text-xs text-muted-foreground block font-medium">Ngăn tủ</span>
                                <span className="text-lg font-extrabold font-mono text-foreground leading-none">#{lockerLabel}</span>
                                <span className="text-[10px] text-muted-foreground block mt-1 font-mono">Hàng {locker.row} • Cột {locker.column}</span>
                              </div>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenLocker(locker.id, lockerLabel)}
                                disabled={isLockerOpening || !!openingLockerId}
                                className="w-full text-xs font-semibold gap-1.5 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all duration-200"
                              >
                                {isLockerOpening ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin text-green-600" />
                                ) : (
                                  <DoorOpen className="h-3.5 w-3.5 text-green-600" />
                                )}
                                Mở tủ
                              </Button>
                            </div>
                          )
                        })}
                        {lockers.length === 0 && (
                          <div className="col-span-full text-center py-8 text-sm text-muted-foreground border border-dashed rounded-xl bg-muted/5">
                            Cụm tủ này hiện không có ngăn tủ nào được liên kết.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Account */}
        <Card>
          <CardContent className="pt-6">
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-destructive mb-1">
                    Xóa tài khoản
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Hành động này không thể hoàn tác
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Xóa
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Bạn có chắc chắn không?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Hành động này không thể hoàn tác. Tài khoản của bạn sẽ bị xóa vĩnh viễn
                        và tất cả dữ liệu sẽ bị mất.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Xóa tài khoản
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
