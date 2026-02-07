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
import type { Plan, PlanStatus } from "../types/plan.types";

export interface PlanFormData {
  name: string;
  maxLockers: number;
  price: number;
  description?: string;
  status: PlanStatus;
}

interface CreateOrUpdatePlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planData?: Plan | null;
  onSubmit: (data: PlanFormData) => void | Promise<void>;
  mode?: "create" | "update";
}

export function CreateOrUpdatePlanModal({
  open,
  onOpenChange,
  planData = null,
  onSubmit,
  mode = "create",
}: CreateOrUpdatePlanModalProps) {
  const isUpdateMode = mode === "update" && planData;

  const form = useForm<PlanFormData>({
    defaultValues: {
      name: "",
      maxLockers: 0,
      price: 0,
      description: "",
      status: "ACTIVE",
      ...planData,
    },
  });

  useEffect(() => {
    if (open) {
      if (isUpdateMode && planData) {
        form.reset({
          name: planData.name,
          maxLockers: planData.maxLockers,
          price: planData.price,
          description: planData.description || "",
          status: planData.status,
        });
      } else {
        form.reset({
          name: "",
          maxLockers: 0,
          price: 0,
          description: "",
          status: "ACTIVE",
        });
      }
    }
  }, [open, planData, isUpdateMode, form]);

  const handleSubmit = async (formData: PlanFormData) => {
    try {
      if (formData.price < 0) {
        form.setError("price", {
          type: "manual",
          message: "Giá không thể nhỏ hơn 0",
        });
        return;
      }

      if (formData.maxLockers < 0) {
        form.setError("maxLockers", {
          type: "manual",
          message: "Số locker tối đa không thể nhỏ hơn 0",
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
            {isUpdateMode ? "Cập nhật gói đăng ký" : "Thêm gói đăng ký mới"}
          </DialogTitle>
          <DialogDescription>
            {isUpdateMode
              ? "Cập nhật thông tin gói đăng ký. Những thay đổi sẽ được lưu vào hệ thống."
              : "Thêm gói đăng ký mới vào hệ thống. Gói đăng ký định nghĩa các thông tin và giá cả cho người dùng."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                rules={{
                  required: "Tên gói đăng ký là bắt buộc",
                  minLength: {
                    value: 2,
                    message: "Tên gói đăng ký phải có ít nhất 2 ký tự",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên gói đăng ký *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: Basic Plan"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxLockers"
                rules={{
                  required: "Số locker tối đa là bắt buộc",
                  min: {
                    value: 0,
                    message: "Số locker tối đa không thể nhỏ hơn 0",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số locker tối đa *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="10"
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
                name="price"
                rules={{
                  required: "Giá là bắt buộc",
                  min: {
                    value: 0,
                    message: "Giá không thể nhỏ hơn 0",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá (VND) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="100000"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả về gói đăng ký (không bắt buộc)"
                        className="min-h-[100px]"
                        {...field}
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
                        <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                      </SelectContent>
                    </Select>
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

export default CreateOrUpdatePlanModal;
