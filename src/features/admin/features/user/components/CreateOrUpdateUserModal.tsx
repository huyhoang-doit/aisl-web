/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { roles } from "@/shared/configs/role";
import type { User, UserStatusValue, UserStatus, NotificationType } from "../types/user.types";
import { getPrimaryRole } from "../types/user.types";

export interface UserFormData {
  keycloakUserId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  status: UserStatus;
  notificationType: NotificationType;
  role: string;
  isVerified: boolean;
}

interface CreateOrUpdateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData?: User | null;
  onSubmit: (data: UserFormData) => void | Promise<void>;
  mode?: "create" | "update";
}

export function CreateOrUpdateUserModal({
  open,
  onOpenChange,
  userData = null,
  onSubmit,
  mode = "create",
}: CreateOrUpdateUserModalProps) {
  const isUpdateMode = mode === "update" && userData;

  type UserFormValues = {
    keycloakUserId?: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    password?: string;
    role: string;
    status?: UserStatusValue;
    isVerified?: boolean;
  };

  const form = useForm<UserFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      role: roles.TECHNICAL_STAFF,
      status: "ACTIVE",
      isVerified: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (isUpdateMode && userData) {
        const statusValue =
          typeof userData.status === "string"
            ? userData.status
            : (userData.status as Record<string, unknown>)?.value ?? "ACTIVE";
        form.reset({
          keycloakUserId: userData.keycloakUserId ?? userData.id,
          fullName: userData.fullName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          role: getPrimaryRole(userData) || userData.role,
          status: statusValue as UserStatusValue,
          isVerified: userData.isVerified ?? true,
        });
      } else {
        form.reset({
          fullName: "",
          email: "",
          phoneNumber: "",
          password: "",
          role: roles.TECHNICAL_STAFF,
          status: "ACTIVE",
          isVerified: true,
        });
      }
    }
  }, [open, userData, isUpdateMode, form]);

  const handleSubmitForm = async (values: UserFormValues) => {
    try {
      const statusValue = values.status ?? "ACTIVE";
      const payload: UserFormData = {
        keycloakUserId:
          values.keycloakUserId ??
          userData?.keycloakUserId ??
          "",
        email: values.email,
        phoneNumber: values.phoneNumber,
        fullName: values.fullName,
        password: values.password?.trim() ? values.password : undefined,
        status: statusValue,
        isVerified: values.isVerified ?? true,
        role: values.role,
        notificationType: userData?.notificationType ?? {},
      };

      await onSubmit(payload);
      onOpenChange(false);
      if (!isUpdateMode) {
        form.reset();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isUpdateMode ? "Cập nhật người dùng" : "Thêm người dùng mới"}
          </DialogTitle>
          <DialogDescription>
            {isUpdateMode
              ? "Cập nhật thông tin người dùng. Những thay đổi sẽ được lưu vào hệ thống."
              : "Thêm người dùng mới vào hệ thống. Vui lòng điền đầy đủ thông tin."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmitForm)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Thông tin cơ bản
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
                      <FormLabel>Họ và tên *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập họ và tên"
                          {...field}
                          disabled={isUpdateMode ? Boolean(userData?.keycloakUserId) : false}
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
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="email@example.com"
                          {...field}
                          disabled={isUpdateMode ? Boolean(userData?.keycloakUserId) : false}
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
                  name="phoneNumber"
                  rules={{
                    required: "Số điện thoại là bắt buộc",
                    pattern: {
                      value:
                        /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
                      message: "Số điện thoại không hợp lệ",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại *</FormLabel>
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

                {!isUpdateMode ? (
                  <FormField
                    control={form.control}
                    name="password"
                    rules={{
                      required: "Mật khẩu là bắt buộc",
                      minLength: {
                        value: 6,
                        message: "Mật khẩu phải có ít nhất 6 ký tự",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu *</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Nhập mật khẩu"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu mới (để trống nếu không đổi)</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Nhập mật khẩu mới"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="role"
                  rules={{
                    required: "Vai trò là bắt buộc",
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vai trò *</FormLabel>
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
                          <SelectItem value={roles.ADMIN}>
                            Quản trị viên
                          </SelectItem>
                          <SelectItem value={roles.COURIER}>Người vận chuyển</SelectItem>
                          <SelectItem value={roles.CUSTOMER}>Khách hàng</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Vai trò xác định quyền truy cập của người dùng
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {isUpdateMode && (
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trạng thái</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value || "ACTIVE"}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                            <SelectItem value="INACTIVE">
                              Không hoạt động
                            </SelectItem>
                            <SelectItem value="BLOCKED">Đã khóa</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Trạng thái tài khoản của người dùng
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isVerified"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Đã xác minh</FormLabel>
                        <Select
                          onValueChange={(v) => field.onChange(v === "true")}
                          value={String(field.value ?? true)}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="true">Có</SelectItem>
                            <SelectItem value="false">Không</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit">
                {isUpdateMode ? "Cập nhật" : "Tạo mới"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateOrUpdateUserModal;
