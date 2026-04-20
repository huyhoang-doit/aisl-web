/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
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
import { Checkbox } from "@/shared/components/ui/checkbox";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import type { Plan, PlanStatus } from "../types/plan.types";
import { pricingService } from "../../pricing/services/pricing.service";
import type { Pricing } from "../../pricing/types/pricing.types";

export interface PlanFormData {
  name: string;
  maxLockers: number;
  price: number;
  description?: string;
  status: PlanStatus;
  pricingIds: string[];
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
  const [allPricings, setAllPricings] = useState<Pricing[]>([]);
  const [isPricingsLoading, setIsPricingsLoading] = useState(false);

  const form = useForm<PlanFormData>({
    defaultValues: {
      name: "",
      maxLockers: 0,
      price: 0,
      description: "",
      status: "ACTIVE",
      pricingIds: [],
      ...planData,
    },
  });

  useEffect(() => {
    const loadPricings = async () => {
      try {
        setIsPricingsLoading(true);
        const response = await pricingService.getAll({ limit: 100 });
        setAllPricings(response.data.pricings || []);
      } catch (error) {
        console.error("Error loading pricings:", error);
      } finally {
        setIsPricingsLoading(false);
      }
    };

    if (open) {
      loadPricings();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      if (isUpdateMode && planData) {
        form.reset({
          name: planData.name,
          maxLockers: planData.maxLockers,
          price: planData.price,
          description: planData.description || "",
          status: planData.status,
          pricingIds: planData.pricings?.map(p => p.id) || planData.pricingIds || [],
        });
      } else {
        form.reset({
          name: "",
          maxLockers: 0,
          price: 0,
          description: "",
          status: "ACTIVE",
          pricingIds: [],
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
                    <FormLabel>Tên gói đăng ký <span className="text-red-500">*</span></FormLabel>
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
                    <FormLabel>Số locker tối đa <span className="text-red-500">*</span></FormLabel>
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
                    <FormLabel>Giá (VND) <span className="text-red-500">*</span></FormLabel>
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
                        <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center justify-between">
                  Bảng giá áp dụng <span className="text-red-500">*</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    Đã chọn: {form.watch("pricingIds")?.length || 0}
                  </span>
                </label>
                <FormField
                  control={form.control}
                  name="pricingIds"
                  rules={{
                    validate: (value) => 
                      (value && value.length > 0) || "Phải chọn ít nhất một bảng giá"
                  }}
                  render={() => (
                    <FormItem>
                      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                        {isPricingsLoading ? (
                          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                            Đang tải bảng giá...
                          </div>
                        ) : allPricings.length === 0 ? (
                          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                            Không có bảng giá nào khả dụng
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {allPricings.map((pricing) => (
                              <FormField
                                key={pricing.id}
                                control={form.control}
                                name="pricingIds"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={pricing.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(pricing.id)}
                                          onCheckedChange={(checked) => {
                                            const current = field.value || [];
                                            return checked
                                              ? field.onChange([...current, pricing.id])
                                              : field.onChange(
                                                  current.filter((value) => value !== pricing.id)
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer w-full">
                                        <div className="flex flex-col">
                                          <span className="font-medium">{pricing.name}</span>
                                          <span className="text-xs text-muted-foreground">
                                            {typeof pricing.orderType === 'string' ? pricing.orderType : (pricing.orderType as any)?.code || 'N/A'} - {pricing.feePerBlock.toLocaleString()}đ/{pricing.blockDuration} {pricing.blockUnit || 'giờ'}
                                          </span>
                                        </div>
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </ScrollArea>
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

export default CreateOrUpdatePlanModal;
