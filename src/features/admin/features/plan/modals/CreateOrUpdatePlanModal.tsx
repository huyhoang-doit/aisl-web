/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { X } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import type { Plan } from "../types/plan.types";

export interface PlanFormData {
  name: string;
  code: string;
  description?: string;
  price: number;
  duration: number;
  durationUnit: "day" | "month" | "year";
  features: string[];
  status: "active" | "inactive";
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
  const [featureInput, setFeatureInput] = useState("");

  const form = useForm<PlanFormData>({
    defaultValues: {
      name: "",
      code: "",
      description: "",
      price: 0,
      duration: 1,
      durationUnit: "month",
      features: [],
      status: "active",
      ...planData,
    },
  });

  useEffect(() => {
    if (open) {
      if (isUpdateMode && planData) {
        form.reset({
          name: planData.name,
          code: planData.code,
          description: planData.description || "",
          price: planData.price,
          duration: planData.duration,
          durationUnit: planData.durationUnit,
          features: planData.features || [],
          status: planData.status,
        });
      } else {
        form.reset({
          name: "",
          code: "",
          description: "",
          price: 0,
          duration: 1,
          durationUnit: "month",
          features: [],
          status: "active",
        });
      }
    }
  }, [open, planData, isUpdateMode, form]);

  // Reset feature input when modal opens/closes
  useEffect(() => {
    if (open) {
      // Defer state update to avoid cascading renders
      const timeoutId = setTimeout(() => {
        setFeatureInput("");
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [open]);

  const handleSubmit = async (formData: PlanFormData) => {
    try {
      // Validate price
      if (formData.price < 0) {
        form.setError("price", {
          type: "manual",
          message: "Giá không thể nhỏ hơn 0",
        });
        return;
      }

      // Validate duration
      if (formData.duration <= 0) {
        form.setError("duration", {
          type: "manual",
          message: "Thời hạn phải lớn hơn 0",
        });
        return;
      }

      await onSubmit(formData);
      onOpenChange(false);
      if (!isUpdateMode) {
        form.reset();
        setFeatureInput("");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const features = useWatch({
    control: form.control,
    name: "features",
    defaultValue: [],
  });

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      const currentFeatures = form.getValues("features");
      if (!currentFeatures.includes(featureInput.trim())) {
        form.setValue("features", [...currentFeatures, featureInput.trim()]);
        setFeatureInput("");
      }
    }
  };

  const handleRemoveFeature = (index: number) => {
    const currentFeatures = form.getValues("features");
    form.setValue(
      "features",
      currentFeatures.filter((_, i) => i !== index)
    );
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
              : "Thêm gói đăng ký mới vào hệ thống. Gói đăng ký định nghĩa các tính năng và giá cả cho người dùng."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Thông tin gói đăng ký
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
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
                          placeholder="Nhập tên gói đăng ký"
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
                    required: "Mã gói đăng ký là bắt buộc",
                    minLength: {
                      value: 2,
                      message: "Mã gói đăng ký phải có ít nhất 2 ký tự",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã gói đăng ký *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="VD: PLAN-BASIC"
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
                        placeholder="Nhập mô tả về gói đăng ký (không bắt buộc)"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Mô tả chi tiết về gói đăng ký này
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-3">
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
                  name="duration"
                  rules={{
                    required: "Thời hạn là bắt buộc",
                    min: {
                      value: 1,
                      message: "Thời hạn phải lớn hơn 0",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thời hạn *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="durationUnit"
                  rules={{
                    required: "Đơn vị thời gian là bắt buộc",
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Đơn vị thời gian *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || "month"}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn đơn vị" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="day">Ngày</SelectItem>
                          <SelectItem value="month">Tháng</SelectItem>
                          <SelectItem value="year">Năm</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Tính năng
              </h3>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nhập tính năng và nhấn Enter"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddFeature}
                  >
                    Thêm
                  </Button>
                </div>

                {features && features.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[60px]">
                    {features.map((feature, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1 pr-1"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                <p className="text-sm text-muted-foreground">
                  Thêm các tính năng của gói đăng ký. Nhấn Enter hoặc nút "Thêm" để thêm tính năng.
                </p>
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

export default CreateOrUpdatePlanModal;

