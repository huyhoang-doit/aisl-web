import * as React from "react"
import { useLocation } from "react-router-dom"
import { User, Mail, Phone, MapPin, Calendar, Edit, Building2 } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import { Separator } from "@/shared/components/ui/separator"
import { EditProfileModal } from "@/shared/components/EditProfileModal"

// Mock data - replace with actual data from context/store
const mockProfileData = {
  id: "1",
  name: "Nguyễn Văn A",
  email: "nguyenvana@lockerly.com",
  phone: "+84 123 456 789",
  avatar: "/src/assets/logo.png",
  address: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
  dateOfBirth: "1990-01-15",
  role: "Admin",
  department: "Quản trị hệ thống",
  joinDate: "2023-01-10",
  bio: "Chuyên viên quản trị hệ thống với hơn 5 năm kinh nghiệm trong việc quản lý và vận hành các hệ thống công nghệ thông tin.",
}

export default function ProfilePage() {
  const location = useLocation()
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [profileData, setProfileData] = React.useState(mockProfileData)

  // Determine role from path
  const role = location.pathname.startsWith("/admin") ? "admin" : "staff"
  const rolePrefix = role === "admin" ? "/admin" : "/staff"

  const handleProfileUpdate = (updatedData: typeof mockProfileData) => {
    setProfileData(updatedData)
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
        <Button onClick={() => setIsEditModalOpen(true)}>
          <Edit className="mr-2 h-4 w-4" />
          Chỉnh sửa
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profileData.avatar} alt={profileData.name} />
                <AvatarFallback className="text-2xl">
                  {profileData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">{profileData.name}</CardTitle>
            <CardDescription className="mt-2">
              <Badge variant="secondary" className="text-sm">
                {profileData.role}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>{profileData.department}</span>
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Tham gia:</span>
                <span>{new Date(profileData.joinDate).toLocaleDateString("vi-VN")}</span>
              </div>
            </div>
          </CardContent>
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
                    <p className="text-sm text-muted-foreground">{profileData.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Ngày sinh</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(profileData.dateOfBirth).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
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
                    <p className="text-sm text-muted-foreground">{profileData.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Số điện thoại</p>
                    <p className="text-sm text-muted-foreground">{profileData.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 md:col-span-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Địa chỉ</p>
                    <p className="text-sm text-muted-foreground">{profileData.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Bio */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Giới thiệu
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {profileData.bio}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        profileData={profileData}
        onUpdate={handleProfileUpdate}
      />
    </div>
  )
}

