import * as React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import {
  Form,
  FormControl,
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

export interface ProfileUpdatePayload {
  fullName: string
  email: string
  phoneNumber: string
  /** File avatar – gửi multipart/form-data field "files" */
  avatarFile?: File
}

interface EditProfileModalProps {
  open: boolean
  /* eslint-disable-next-line no-unused-vars -- callback param names are for type documentation */
  onOpenChange: (isOpen: boolean) => void
  profileData: ProfileData
  /* eslint-disable-next-line no-unused-vars -- callback param names are for type documentation */
  onUpdate: (data: ProfileUpdatePayload) => void | Promise<void>
}

type EditProfileFormValues = {
  fullName: string
  email: string
  phoneNumber: string
}

export function EditProfileModal({
  open,
  onOpenChange,
  profileData,
  onUpdate,
}: EditProfileModalProps) {
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null)
  const avatarPreview = React.useMemo(
    () => (avatarFile ? URL.createObjectURL(avatarFile) : null),
    [avatarFile]
  )

  const form = useForm<EditProfileFormValues>({
    defaultValues: {
      fullName: profileData.name,
      email: profileData.email,
      phoneNumber: profileData.phone,
    },
  })

  React.useEffect(() => {
    if (open) {
      form.reset({
        fullName: profileData.name,
        email: profileData.email,
        phoneNumber: profileData.phone,
      })
      setAvatarFile(null)
    }
  }, [open, profileData, form])

  React.useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    }
  }, [avatarPreview])

  const onSubmit = async (values: EditProfileFormValues) => {
    try {
      await onUpdate({
        fullName: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        avatarFile: avatarFile ?? undefined,
      })
      toast.success("Cập nhật hồ sơ thành công")
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Không thể cập nhật hồ sơ"
      toast.error(msg)
      throw e
    }
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
            {/* Avatar */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Ảnh đại diện
              </h3>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" className="h-full w-full object-cover rounded-full" />
                  ) : (
                    <>
                      <AvatarImage src={profileData.avatar} alt={profileData.name} />
                      <AvatarFallback className="text-lg">
                        {profileData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                  />
                  <p className="text-xs text-muted-foreground">Định dạng: JPG, PNG, WebP</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Thông tin có thể chỉnh sửa
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="fullName"
                  rules={{
                    required: "Họ và tên là bắt buộc",
                    minLength: {
                      value: 2,
                      message: "Họ và tên phải có ít nhất 2 ký tự",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập họ và tên" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                      <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  rules={{
                    required: "Số điện thoại là bắt buộc",
                    pattern: {
                      value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
                      message: "Số điện thoại không hợp lệ",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+84 123 456 789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

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

