import * as React from "react"
import {
  Moon,
  Sun,
  Eye,
  EyeOff,
  Lock,
  Trash2,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Label } from "@/shared/components/ui/label"
import { Switch } from "@/shared/components/ui/switch"
import { Input } from "@/shared/components/ui/input"
import { useTheme } from "next-themes"
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

export default function SettingPage() {
  const { theme, setTheme } = useTheme()
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

  // Settings state
  const [settings, setSettings] = React.useState({
    theme: theme || "light",
    notifications: true,
  })

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

  const handleSavePassword = () => {
    if (!passwordData.currentPassword) {
      alert("Vui lòng nhập mật khẩu hiện tại")
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu mới và xác nhận mật khẩu không khớp")
      return
    }
    if (passwordData.newPassword.length < 8) {
      alert("Mật khẩu phải có ít nhất 8 ký tự")
      return
    }
    // TODO: Implement password change API call
    console.log("Changing password...", passwordData)
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    alert("Đổi mật khẩu thành công!")
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
              <Label htmlFor="notifications" className="text-base font-medium">Bật / Tắt thông báo</Label>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, notifications: checked }))
                }
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

            <Button onClick={handleSavePassword} className="w-full">
              <Lock className="mr-2 h-4 w-4" />
              Đổi mật khẩu
            </Button>
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
