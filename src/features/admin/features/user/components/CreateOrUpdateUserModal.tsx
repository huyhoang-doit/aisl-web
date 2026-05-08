/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Loader2, ImagePlus, X } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { api } from "@/shared/lib/api/client";
import { toast } from "sonner";
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
  FormMessage,
  FormLabel
} from "@/shared/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { User, UserStatusValue, UserStatus, NotificationType } from "../types/user.types";
import { RoleSelector } from "./RoleSelector";
import { vehicleTypeService } from "../../vehicleType/services/vehicleType.service";
import type { VehicleType } from "../../vehicleType/types/vehicleType.types";
interface ImageUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

function ImageUploadInput({ label, value, onChange }: ImageUploadInputProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post<{ data?: { url?: string }, success?: boolean }>("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const url = res?.data?.url || (res as any)?.url || "";
      if (url) {
        onChange(url);
        toast.success(`Đã tải lên ${label} thành công`);
      } else {
        toast.error("Không nhận được URL ảnh sau khi upload");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Tải ảnh lên thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <div className="space-y-2">
      <FormLabel className="text-sm font-medium">{label}</FormLabel>
      <div className="flex flex-col items-center justify-center border border-dashed border-border rounded-lg p-4 bg-muted/20 min-h-[140px] relative transition-colors hover:bg-muted/40 group">
        {value ? (
          <div className="relative w-full aspect-video rounded-md overflow-hidden bg-background border border-border">
            <img src={value} alt={label} className="w-full h-full object-cover" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleRemove}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center cursor-pointer space-y-2 w-full h-full py-4"
            onClick={() => {
              if (!uploading) {
                document.getElementById(`upload-input-${label.replace(/\s+/g, "-")}`)?.click();
              }
            }}
          >
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            ) : (
              <ImagePlus className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
            <span className="text-xs text-muted-foreground text-center">
              {uploading ? "Đang tải lên..." : `Tải lên ${label}`}
            </span>
          </div>
        )}
        <input
          id={`upload-input-${label.replace(/\s+/g, "-")}`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </div>
    </div>
  );
}

export interface UserFormData {
  keycloakUserId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  status: UserStatus;
  notificationType: NotificationType;
  roles: string[];
  isVerified: boolean;
  legalName?: string;
  licensePlate?: string;
  vehicleType?: string;
  frontVehicleImageUrl?: string;
  backVehicleImageUrl?: string;
  portraitUrl?: string;
  staffStatus?: string;
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

  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);

  useEffect(() => {
    if (open) {
      const fetchVehicleTypes = async () => {
        try {
          const res = await vehicleTypeService.getAll({ limit: 100, isActive: true });
          setVehicleTypes(res.data || []);
        } catch (error) {
          console.error("Failed to fetch vehicle types:", error);
        }
      };
      fetchVehicleTypes();
    }
  }, [open]);

  type UserFormValues = {
    keycloakUserId?: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    password?: string;
    roles: string[];
    status?: UserStatusValue;
    isVerified?: boolean;
    legalName?: string;
    licensePlate?: string;
    vehicleType?: string;
    frontVehicleImageUrl?: string;
    backVehicleImageUrl?: string;
    portraitUrl?: string;
    staffStatus?: string;
  };

  const form = useForm<UserFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      roles: [],
      status: "ACTIVE",
      isVerified: true,
      legalName: "",
      licensePlate: "",
      vehicleType: "BIKE",
      frontVehicleImageUrl: "",
      backVehicleImageUrl: "",
      portraitUrl: "",
      staffStatus: "APPROVED",
    },
  });

  const selectedRoles = useWatch({
    control: form.control,
    name: "roles",
    defaultValue: [],
  }) || [];
  const isCourier = selectedRoles.includes("COURIER");

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
          roles: userData.roles?.map(r => r.name) || [],
          status: statusValue as UserStatusValue,
          isVerified: userData.isVerified ?? true,
          legalName: (userData as any).legalName ?? "",
          licensePlate: (userData as any).licensePlate ?? "",
          vehicleType: (userData as any).vehicleType ?? "BIKE",
          frontVehicleImageUrl: (userData as any).frontVehicleImageUrl ?? "",
          backVehicleImageUrl: (userData as any).backVehicleImageUrl ?? "",
          portraitUrl: (userData as any).portraitUrl ?? "",
          staffStatus: (userData as any).staffStatus ?? "APPROVED",
        });
      } else {
        form.reset({
          fullName: "",
          email: "",
          phoneNumber: "",
          password: "",
          roles: [],
          status: "ACTIVE",
          isVerified: true,
          legalName: "",
          licensePlate: "",
          vehicleType: "BIKE",
          frontVehicleImageUrl: "",
          backVehicleImageUrl: "",
          portraitUrl: "",
          staffStatus: "APPROVED",
        });
      }
    }
  }, [open, userData, isUpdateMode, form]);

  const handleSubmitForm = async (values: UserFormValues) => {
    try {
      const statusValue = values.status ?? "ACTIVE";
      const payload: UserFormData = {
        keycloakUserId:
          userData?.id ||
          values.keycloakUserId ||
          userData?.keycloakUserId ||
          "",
        email: values.email,
        phoneNumber: values.phoneNumber,
        fullName: values.fullName,
        password: values.password?.trim() ? values.password : undefined,
        status: statusValue,
        isVerified: values.isVerified ?? true,
        roles: values.roles,
        notificationType: userData?.notificationType ?? {},
        legalName: values.roles.includes("COURIER") ? values.legalName : undefined,
        licensePlate: values.roles.includes("COURIER") ? values.licensePlate : undefined,
        vehicleType: values.roles.includes("COURIER") ? values.vehicleType : undefined,
        frontVehicleImageUrl: values.roles.includes("COURIER") ? values.frontVehicleImageUrl : undefined,
        backVehicleImageUrl: values.roles.includes("COURIER") ? values.backVehicleImageUrl : undefined,
        portraitUrl: values.roles.includes("COURIER") ? values.portraitUrl : undefined,
        staffStatus: values.roles.includes("COURIER") ? values.staffStatus : undefined,
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
                      <FormLabel>Họ và tên <span className="text-red-500">*</span></FormLabel>
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
                      <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
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
                        <FormLabel>Mật khẩu <span className="text-red-500">*</span></FormLabel>
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
                  name="roles"
                  rules={{
                    required: "Vai trò là bắt buộc",
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vai trò <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <RoleSelector
                          value={(field.value as string[]) || []}
                          onValueChange={field.onChange}
                          placeholder="Chọn vai trò"
                          allowClear={false}
                          valueBy="name"
                          multiple={true}
                        />
                      </FormControl>
                      <FormDescription>
                        Vai trò xác định quyền truy cập của người dùng
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {isCourier && (
                <div className="space-y-4 pt-4 border-t border-border">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Thông tin người vận chuyển (Courier)
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="legalName"
                      rules={{
                        required: isCourier ? "Họ và tên pháp lý là bắt buộc" : false,
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Họ và tên pháp lý <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập họ và tên trên giấy tờ" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="licensePlate"
                      rules={{
                        required: isCourier ? "Biển số xe là bắt buộc" : false,
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Biển số xe <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Ví dụ: 29A-123.45" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="vehicleType"
                      rules={{
                        required: isCourier ? "Loại phương tiện là bắt buộc" : false,
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loại phương tiện <span className="text-red-500">*</span></FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue="BIKE"
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn loại phương tiện" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {vehicleTypes.length > 0 ? (
                                vehicleTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.name}>
                                    {type.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <>
                                  <SelectItem value="BIKE">Xe đạp</SelectItem>
                                  <SelectItem value="MOTORBIKE">Xe máy</SelectItem>
                                  <SelectItem value="CAR">Ô tô</SelectItem>
                                  <SelectItem value="TRUCK">Xe tải</SelectItem>
                                </>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="staffStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trạng thái Staff</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue="APPROVED"
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn trạng thái" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="APPROVED">Đã phê duyệt</SelectItem>
                              <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                              <SelectItem value="REJECTED">Từ chối</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="portraitUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <ImageUploadInput
                              label="Ảnh chân dung"
                              value={field.value || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="frontVehicleImageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <ImageUploadInput
                              label="Ảnh trước xe"
                              value={field.value || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="backVehicleImageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <ImageUploadInput
                              label="Ảnh sau xe"
                              value={field.value || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {isUpdateMode && (
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trạng thái <span className="text-red-500">*</span></FormLabel>
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
                        <FormLabel>Đã xác minh <span className="text-red-500">*</span></FormLabel>
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
  );
}

export default CreateOrUpdateUserModal;
