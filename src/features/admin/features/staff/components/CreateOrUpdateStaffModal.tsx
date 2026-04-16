/* eslint-disable no-unused-vars */
import { useEffect } from "react"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { roles } from "@/shared/configs/role"

export interface StaffData {
  id?: string
  name: string
  email: string
  phone: string
  role: string
  status?: "active" | "inactive" | "locked"
  department?: string
  position?: string
}

interface CreateOrUpdateStaffModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  staffData?: StaffData | null
  onSubmit: (staffData: StaffData) => void | Promise<void>
  mode?: "create" | "update"
}

export function CreateOrUpdateStaffModal({
  open,
  onOpenChange,
  staffData = null,
  onSubmit,
  mode = "create",
}: CreateOrUpdateStaffModalProps) {
  const isUpdateMode = mode === "update" && staffData

  const form = useForm<StaffData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: roles.TECHNICAL_STAFF,
      status: "active",
      department: "",
      position: "",
      ...staffData,
    },
  })

  useEffect(() => {
    if (open) {
      if (isUpdateMode && staffData) {
        form.reset(staffData)
      } else {
        form.reset({
          name: "",
          email: "",
          phone: "",
          role: roles.TECHNICAL_STAFF,
          status: "active",
          department: "",
          position: "",
        })
      }
    }
  }, [open, staffData, isUpdateMode, form])

  const handleSubmit = async (formData: StaffData) => {
    try {
      await onSubmit(formData)
      onOpenChange(false)
      if (!isUpdateMode) {
        form.reset()
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isUpdateMode ? "Cập nhật nhân viên" : "Thêm nhân viên mới"}
          </DialogTitle>
          <DialogDescription>
            {isUpdateMode
              ? "Cập nhật thông tin nhân viên. Những thay đổi sẽ được lưu vào hệ thống."
              : "Thêm nhân viên mới vào hệ thống. Vui lòng điền đầy đủ thông tin."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Thông tin cơ bản */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Thông tin cơ bản
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
                      <FormLabel>Họ và tên <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập họ và tên"
                          {...field}
                          disabled={isUpdateMode ? Boolean(staffData?.id) : false}
                        />
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
                        <Input
                          type="email"
                          placeholder="email@example.com"
                          {...field}
                          disabled={isUpdateMode ? Boolean(staffData?.id) : false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
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
                      <FormLabel>Số điện thoại <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+84 123 456 789"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  rules={{
                    required: "Vai trò là bắt buộc",
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vai trò <span className="text-red-500">*</span></FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn vai trò" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={roles.TECHNICAL_STAFF}>Nhân viên</SelectItem>
                          <SelectItem value={roles.ADMIN}>Quản trị viên</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Vai trò xác định quyền truy cập của nhân viên
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phòng ban</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập phòng ban"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chức vụ</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập chức vụ"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {isUpdateMode && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || "active"}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Hoạt động</SelectItem>
                          <SelectItem value="inactive">Không hoạt động</SelectItem>
                          <SelectItem value="locked">Đã khóa</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Trạng thái tài khoản của nhân viên
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
               disabled={form.formState.isSubmitting}>
                Hủy
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isUpdateMode ? "Cập nhật" : "Tạo mới"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateOrUpdateStaffModal
