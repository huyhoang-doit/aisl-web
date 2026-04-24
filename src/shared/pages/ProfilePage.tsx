import * as React from "react"
import { User, Mail, Phone, Edit, Lock } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import { Separator } from "@/shared/components/ui/separator"
import { EditProfileModal, type ProfileData } from "@/shared/components/EditProfileModal"
import { useAuthStore } from "@/features/auth"
import { userService } from "@/features/admin/features/user/services/user.service"
import type { User as UserDetail } from "@/features/admin/features/user/types/user.types"
import { roles } from "@/shared/configs/role"
import { useNavigate } from "react-router-dom"

const ROLE_LABELS: Record<string, string> = {
  [roles.ADMIN]: "Quản trị viên",
  [roles.TECHNICAL_STAFF]: "Nhân viên",
  [roles.COURIER]: "Người vận chuyển",
  [roles.CUSTOMER]: "Khách hàng",
}

export default function ProfilePage() {
  const { user: authUser, getCurrentUser } = useAuthStore()
  const navigate = useNavigate()
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [userDetail, setUserDetail] = React.useState<UserDetail | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    if (!authUser) {
      setUserDetail(null)
      setIsLoading(false)
      return
    }
    const loadProfile = async () => {
      setIsLoading(true)
      const res = await userService.getById(authUser.id).catch(() => null)
      setUserDetail(res?.data?.user ?? null)
      setIsLoading(false)
    }
    loadProfile()
  }, [authUser])

  const handleProfileUpdate = React.useCallback(
    async (payload: {
      fullName: string
      email: string
      phoneNumber: string
      avatarFile?: File
    }) => {
      if (!authUser?.id) return
      await userService.update(authUser.id, {
        fullName: payload.fullName,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        file: payload.avatarFile,
      })
      await getCurrentUser()
      setUserDetail((prev) =>
        prev
          ? {
              ...prev,
              fullName: payload.fullName,
              email: payload.email,
              phoneNumber: payload.phoneNumber,
            }
          : null
      )
      setIsEditModalOpen(false)
    },
    [authUser, getCurrentUser]
  )

  if (isLoading || !authUser) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <p className="text-muted-foreground">
          {isLoading ? "Đang tải..." : "Vui lòng đăng nhập để xem hồ sơ."}
        </p>
      </div>
    )
  }

  const name = userDetail?.fullName ?? authUser.username ?? ""
  const email = userDetail?.email ?? authUser.email ?? ""
  const phone = userDetail?.phoneNumber ?? ""
  const roleKey = userDetail?.roles?.[0]?.name ?? authUser.roles?.[0] ?? ""
  const roleLabel = ROLE_LABELS[roleKey] ?? roleKey
  const joinDate = userDetail?.createdAt
    ? new Date(userDetail.createdAt).toLocaleDateString("vi-VN")
    : ""

  const editProfileData: ProfileData = {
    id: authUser.id,
    name,
    email,
    phone,
    avatar: authUser.avatar ?? "",
    address: "",
    dateOfBirth: "",
    role: roleLabel,
    department: "",
    joinDate,
    bio: "",
  }

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hồ sơ cá nhân</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý thông tin cá nhân và cài đặt tài khoản
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("../settings")}>
            <Lock className="mr-2 h-4 w-4" />
            Đổi mật khẩu
          </Button>
          <Button onClick={() => setIsEditModalOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={authUser.avatar} alt={name} />
                <AvatarFallback className="text-2xl">
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">{name}</CardTitle>
            <CardDescription className="mt-2">
              <Badge variant="secondary" className="text-sm">
                {roleLabel}
              </Badge>
            </CardDescription>
          </CardHeader>
          {/* <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>—</span>
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Tham gia:</span>
                <span>{joinDate || "—"}</span>
              </div>
            </div>
          </CardContent> */}
        </Card>

        {/* Details Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Thông tin chi tiết</CardTitle>
            <CardDescription>Thông tin cá nhân và liên hệ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Thông tin cá nhân
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Họ và tên</p>
                    <p className="text-sm text-muted-foreground">{name}</p>
                  </div>
                </div>
                {/* <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Ngày sinh</p>
                    <p className="text-sm text-muted-foreground">
                      —
                    </p>
                  </div>
                </div> */}
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Thông tin liên hệ
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Số điện thoại</p>
                    <p className="text-sm text-muted-foreground">{phone || "—"}</p>
                  </div>
                </div>
                {/* <div className="flex items-start gap-3 md:col-span-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Địa chỉ</p>
                    <p className="text-sm text-muted-foreground">—</p>
                  </div>
                </div> */}
              </div>
            </div>

            <Separator />

            {/* Bio */}
            {/* <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Giới thiệu
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                —
              </p>
            </div> */}
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        profileData={editProfileData}
        onUpdate={handleProfileUpdate}
      />
    </div>
  )
}

