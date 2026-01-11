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
import type { Location } from "../types/location.types";

export interface LocationFormData {
  name: string;
  address: string;
  description?: string;
  status: "active" | "inactive";
}

interface CreateOrUpdateLocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locationData?: Location | null;
  onSubmit: (data: LocationFormData) => void | Promise<void>;
  mode?: "create" | "update";
}

export function CreateOrUpdateLocationModal({
  open,
  onOpenChange,
  locationData = null,
  onSubmit,
  mode = "create",
}: CreateOrUpdateLocationModalProps) {
  const isUpdateMode = mode === "update" && locationData;

  const form = useForm<LocationFormData>({
    defaultValues: {
      name: "",
      address: "",
      description: "",
      status: "active",
      ...locationData,
    },
  });

  useEffect(() => {
    if (open) {
      if (isUpdateMode && locationData) {
        form.reset({
          name: locationData.name,
          address: locationData.address,
          description: locationData.description || "",
          status: locationData.status,
        });
      } else {
        form.reset({
          name: "",
          address: "",
          description: "",
          status: "active",
        });
      }
    }
  }, [open, locationData, isUpdateMode, form]);

  const handleSubmit = async (formData: LocationFormData) => {
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
            {isUpdateMode ? "Cập nhật địa điểm" : "Thêm địa điểm mới"}
          </DialogTitle>
          <DialogDescription>
            {isUpdateMode
              ? "Cập nhật thông tin địa điểm đặt các cụm cabinet. Những thay đổi sẽ được lưu vào hệ thống."
              : "Thêm địa điểm mới vào hệ thống. Địa điểm là nơi đặt các cụm cabinet."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Thông tin địa điểm
              </h3>

              <FormField
                control={form.control}
                name="name"
                rules={{
                  required: "Tên địa điểm là bắt buộc",
                  minLength: {
                    value: 2,
                    message: "Tên địa điểm phải có ít nhất 2 ký tự",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên địa điểm *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tên địa điểm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                rules={{
                  required: "Địa chỉ là bắt buộc",
                  minLength: {
                    value: 5,
                    message: "Địa chỉ phải có ít nhất 5 ký tự",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập địa chỉ chi tiết"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập mô tả về địa điểm (không bắt buộc)"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Mô tả chi tiết về địa điểm này
                    </FormDescription>
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
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Trạng thái hoạt động của địa điểm
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

export default CreateOrUpdateLocationModal;
