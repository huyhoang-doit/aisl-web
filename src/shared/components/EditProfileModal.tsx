import * as React from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form"

export interface ProfileData {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  address: string
  dateOfBirth: string
  role: string
  department: string
  joinDate: string
  bio: string
}

interface EditProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profileData: ProfileData
  onUpdate: (data: ProfileData) => void
}

export function EditProfileModal({
  open,
  onOpenChange,
  profileData,
  onUpdate,
}: EditProfileModalProps) {
  const form = useForm<ProfileData>({
    defaultValues: profileData,
  })

  React.useEffect(() => {
    if (open) {
      form.reset(profileData)
    }
  }, [open, profileData, form])

  const onSubmit = (data: ProfileData) => {
    onUpdate(data)
    onOpenChange(false)
    // Here you would typically make an API call to update the profile
    console.log("Profile updated:", data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin cá nhân của bạn. Những thay đổi sẽ được lưu vào hồ sơ.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Thông tin cá nhân
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{
                    required: "Họ và tên là bắt buộc",
                    minLength: {
                      value: 2,
                      message: "Họ và tên phải có ít nhất 2 ký tự",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập họ và tên" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  rules={{
                    required: "Ngày sinh là bắt buộc",
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày sinh</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Thông tin liên hệ
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    required: "Email là bắt buộc",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email không hợp lệ",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  rules={{
                    required: "Số điện thoại là bắt buộc",
                    pattern: {
                      value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
                      message: "Số điện thoại không hợp lệ",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+84 123 456 789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                rules={{
                  required: "Địa chỉ là bắt buộc",
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập địa chỉ đầy đủ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Bio */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Giới thiệu
              </h3>
              
              <FormField
                control={form.control}
                name="bio"
                rules={{
                  maxLength: {
                    value: 500,
                    message: "Giới thiệu không được vượt quá 500 ký tự",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới thiệu về bản thân</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Viết một vài dòng giới thiệu về bản thân..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value?.length || 0}/500 ký tự
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Read-only fields */}
            {/* <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Thông tin hệ thống
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormItem>
                  <FormLabel>Vai trò</FormLabel>
                  <FormControl>
                    <Input value={profileData.role} disabled className="bg-muted" />
                  </FormControl>
                  <FormDescription>
                    Vai trò không thể thay đổi
                  </FormDescription>
                </FormItem>

                <FormItem>
                  <FormLabel>Phòng ban</FormLabel>
                  <FormControl>
                    <Input value={profileData.department} disabled className="bg-muted" />
                  </FormControl>
                  <FormDescription>
                    Phòng ban không thể thay đổi
                  </FormDescription>
                </FormItem>
              </div>
            </div> */}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit">Lưu thay đổi</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

