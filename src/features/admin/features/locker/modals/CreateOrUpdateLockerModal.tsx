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
import { Textarea } from "@/shared/components/ui/textarea";
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
import type { Locker } from "../types/locker.types.ts";

export interface LockerFormData {
  code: string;
  size: "small" | "medium" | "large";
  status: "available" | "occupied" | "maintenance" | "reserved";
  price?: number;
  description?: string;
}

interface CreateOrUpdateLockerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lockerData?: Locker | null;
  onSubmit: (data: LockerFormData) => void | Promise<void>;
  mode?: "create" | "update";
  cabinetId: string;
}

export function CreateOrUpdateLockerModal({
  open,
  onOpenChange,
  lockerData = null,
  onSubmit,
  mode = "create",
  cabinetId: _cabinetId,
}: CreateOrUpdateLockerModalProps) {
  const isUpdateMode = mode === "update" && lockerData;

  const form = useForm<LockerFormData>({
    defaultValues: {
      code: "",
      size: "medium",
      status: "available",
      price: 0,
      description: "",
      ...lockerData,
    },
  });

  useEffect(() => {
    if (open) {
      if (isUpdateMode && lockerData) {
        form.reset({
          code: lockerData.code,
          size: lockerData.size,
          status: lockerData.status,
          price: lockerData.price || 0,
          description: lockerData.description || "",
        });
      } else {
        form.reset({
          code: "",
          size: "medium",
          status: "available",
          price: 0,
          description: "",
        });
      }
    }
  }, [open, lockerData, isUpdateMode, form]);

  const handleSubmit = async (formData: LockerFormData) => {
    try {
      await onSubmit(formData);
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
            {isUpdateMode ? "Cập nhật locker" : "Thêm locker mới"}
          </DialogTitle>
          <DialogDescription>
            {isUpdateMode
              ? "Cập nhật thông tin locker. Những thay đổi sẽ được lưu vào hệ thống."
              : "Thêm locker mới vào cabinet. Locker là tủ lưu trữ cá nhân."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Thông tin locker
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="code"
                  rules={{
                    required: "Mã locker là bắt buộc",
                    minLength: {
                      value: 2,
                      message: "Mã locker phải có ít nhất 2 ký tự",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã locker *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="VD: L001"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="size"
                  rules={{
                    required: "Kích thước là bắt buộc",
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kích thước *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || "medium"}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn kích thước" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="small">Nhỏ</SelectItem>
                          <SelectItem value="medium">Vừa</SelectItem>
                          <SelectItem value="large">Lớn</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="status"
                  rules={{
                    required: "Trạng thái là bắt buộc",
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || "available"}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="available">Trống</SelectItem>
                          <SelectItem value="occupied">Đã thuê</SelectItem>
                          <SelectItem value="maintenance">Bảo trì</SelectItem>
                          <SelectItem value="reserved">Đã đặt</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá thuê (VNĐ)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Giá thuê theo tháng (không bắt buộc)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập mô tả về locker (không bắt buộc)"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Mô tả chi tiết về locker này
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

export default CreateOrUpdateLockerModal;