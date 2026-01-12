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
import type { Cabinet } from "../types/cabinet.types";

export interface CabinetFormData {
  name: string;
  code: string;
  description?: string;
  totalLockers: number;
  availableLockers: number;
  status: "active" | "inactive" | "maintenance";
}

interface CreateOrUpdateCabinetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cabinetData?: Cabinet | null;
  onSubmit: (data: CabinetFormData) => void | Promise<void>;
  mode?: "create" | "update";
  locationId: string;
}

export function CreateOrUpdateCabinetModal({
  open,
  onOpenChange,
  cabinetData = null,
  onSubmit,
  mode = "create",
  locationId: _locationId,
}: CreateOrUpdateCabinetModalProps) {
  const isUpdateMode = mode === "update" && cabinetData;

  const form = useForm<CabinetFormData>({
    defaultValues: {
      name: "",
      code: "",
      description: "",
      totalLockers: 0,
      availableLockers: 0,
      status: "active",
      ...cabinetData,
    },
  });

  useEffect(() => {
    if (open) {
      if (isUpdateMode && cabinetData) {
        form.reset({
          name: cabinetData.name,
          code: cabinetData.code,
          description: cabinetData.description || "",
          totalLockers: cabinetData.totalLockers,
          availableLockers: cabinetData.availableLockers,
          status: cabinetData.status,
        });
      } else {
        form.reset({
          name: "",
          code: "",
          description: "",
          totalLockers: 0,
          availableLockers: 0,
          status: "active",
        });
      }
    }
  }, [open, cabinetData, isUpdateMode, form]);

  const handleSubmit = async (formData: CabinetFormData) => {
    try {
      // Validate that availableLockers <= totalLockers
      if (formData.availableLockers > formData.totalLockers) {
        form.setError("availableLockers", {
          type: "manual",
          message: "Số locker trống không thể lớn hơn tổng số locker",
        });
        return;
      }
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
            {isUpdateMode ? "Cập nhật cabinet" : "Thêm cabinet mới"}
          </DialogTitle>
          <DialogDescription>
            {isUpdateMode
              ? "Cập nhật thông tin cabinet (cụm chứa nhiều locker). Những thay đổi sẽ được lưu vào hệ thống."
              : "Thêm cabinet mới vào địa điểm. Cabinet là cụm chứa nhiều locker."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Thông tin cabinet
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{
                    required: "Tên cabinet là bắt buộc",
                    minLength: {
                      value: 2,
                      message: "Tên cabinet phải có ít nhất 2 ký tự",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên cabinet *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập tên cabinet"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="code"
                  rules={{
                    required: "Mã cabinet là bắt buộc",
                    minLength: {
                      value: 2,
                      message: "Mã cabinet phải có ít nhất 2 ký tự",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã cabinet *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="VD: CAB-A1"
                          {...field}
                        />
                      </FormControl>
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
                        placeholder="Nhập mô tả về cabinet (không bắt buộc)"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Mô tả chi tiết về cabinet này
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="totalLockers"
                  rules={{
                    required: "Tổng số locker là bắt buộc",
                    min: {
                      value: 1,
                      message: "Tổng số locker phải lớn hơn 0",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tổng số locker *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="availableLockers"
                  rules={{
                    required: "Số locker trống là bắt buộc",
                    min: {
                      value: 0,
                      message: "Số locker trống không thể nhỏ hơn 0",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Locker trống *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          <SelectItem value="maintenance">Bảo trì</SelectItem>
                        </SelectContent>
                      </Select>
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

export default CreateOrUpdateCabinetModal;