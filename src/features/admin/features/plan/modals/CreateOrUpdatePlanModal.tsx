/* eslint-disable no-unused-vars */
import { useEffect, useState, useMemo } from "react";
import { Loader2, Filter } from "lucide-react";
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
import { Switch } from "@/shared/components/ui/switch";
import { Badge } from "@/shared/components/ui/badge";
import type { Plan, PlanStatus } from "../types/plan.types";
import { pricingService } from "../../pricing/services/pricing.service";
import type { Pricing } from "../../pricing/types/pricing.types";

export interface PlanFormData {
  name: string;
  maxLockers: number;
  price: number;
  fixedLocker: number;
  discountLockerRental: number;
  discountFixedLockerRental: number;
  description?: string;
  status: PlanStatus;
  isFreeDefault: boolean;
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
  const [pricingFilter, setPricingFilter] = useState<"ALL" | "LOGISTICS" | "PERSONAL_RENTAL">("ALL");

  const form = useForm<PlanFormData>({
    defaultValues: {
      name: "",
      maxLockers: 0,
      price: 0,
      fixedLocker: 0,
      discountLockerRental: 0,
      discountFixedLockerRental: 0,
      description: "",
      status: "ACTIVE",
      isFreeDefault: false,
      pricingIds: [],
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
          fixedLocker: planData.fixedLocker || 0,
          discountLockerRental: planData.discountLockerRental || 0,
          discountFixedLockerRental: planData.discountFixedLockerRental || 0,
          description: planData.description || "",
          status: planData.status,
          isFreeDefault: planData.isFreeDefault || false,
          pricingIds: planData.pricings?.map(p => p.id) || planData.pricingIds || [],
        });
      } else {
        form.reset({
          name: "",
          maxLockers: 0,
          price: 0,
          fixedLocker: 0,
          discountLockerRental: 0,
          discountFixedLockerRental: 0,
          description: "",
          status: "ACTIVE",
          isFreeDefault: false,
          pricingIds: [],
        });
      }
    }
  }, [open, planData, isUpdateMode, form]);

  const filteredPricings = useMemo(() => {
    if (pricingFilter === "ALL") return allPricings;
    return allPricings.filter(p => {
        const type = typeof p.orderType === 'string' ? p.orderType : (p.orderType as any)?.value;
        return type === pricingFilter;
    });
  }, [allPricings, pricingFilter]);

  const handleSubmit = async (formData: PlanFormData) => {
    try {
      if (formData.price < 0 || formData.maxLockers < 0 || formData.fixedLocker < 0 || formData.discountLockerRental < 0 || formData.discountFixedLockerRental < 0) {
        if (formData.price < 0) form.setError("price", { type: "manual", message: "Giá không thể nhỏ hơn 0" });
        if (formData.maxLockers < 0) form.setError("maxLockers", { type: "manual", message: "Số locker tối đa không thể nhỏ hơn 0" });
        if (formData.fixedLocker < 0) form.setError("fixedLocker", { type: "manual", message: "Số locker cố định không thể nhỏ hơn 0" });
        if (formData.discountLockerRental < 0) form.setError("discountLockerRental", { type: "manual", message: "Chiết khấu không thể nhỏ hơn 0" });
        if (formData.discountFixedLockerRental < 0) form.setError("discountFixedLockerRental", { type: "manual", message: "Chiết khấu không thể nhỏ hơn 0" });
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="price"
                    rules={{
                    required: "Giá là bắt buộc",
                    min: { value: 0, message: "Giá không thể nhỏ hơn 0" },
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
                    name="maxLockers"
                    rules={{
                    required: "Số locker tối đa là bắt buộc",
                    min: { value: 0, message: "Không thể nhỏ hơn 0" },
                    }}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Locker tối đa <span className="text-red-500">*</span></FormLabel>
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
                    name="fixedLocker"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Fixed Locker (Cố định)</FormLabel>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="discountLockerRental"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Giảm giá Thuê (%)</FormLabel>
                        <FormControl>
                        <Input
                            type="number"
                            min="0"
                            max="100"
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
                    name="discountFixedLockerRental"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Giảm giá Thuê cố định (%)</FormLabel>
                        <FormControl>
                        <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>

              <div className="flex items-center space-x-2 rounded-md border p-3">
                <FormField
                  control={form.control}
                  name="isFreeDefault"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between w-full space-y-0">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Mặc định miễn phí</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Gói này sẽ tự động gán cho người dùng mới
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
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
                        placeholder="Mô tả về gói đăng ký"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold flex items-center gap-2">
                        Bảng giá áp dụng <span className="text-red-500">*</span>
                        <Badge variant="secondary" className="text-[10px]">
                            Đã chọn: {form.watch("pricingIds")?.length || 0}
                        </Badge>
                    </label>
                    <div className="flex items-center gap-2">
                        <Filter className="h-3 w-3 text-muted-foreground" />
                        <Select value={pricingFilter} onValueChange={(val: any) => setPricingFilter(val)}>
                            <SelectTrigger className="h-8 w-[150px] text-xs">
                                <SelectValue placeholder="Lọc theo loại" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Tất cả</SelectItem>
                                <SelectItem value="PERSONAL_RENTAL">Thuê cá nhân</SelectItem>
                                <SelectItem value="LOGISTICS">Logistics</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <FormField
                  control={form.control}
                  name="pricingIds"
                  rules={{
                    validate: (value) => {
                      if (!value || value.length === 0) return "Phải chọn ít nhất một bảng giá";
                      
                      const selectedPricings = allPricings.filter(p => value.includes(p.id));
                      const hasLogistics = selectedPricings.some(p => {
                          const type = typeof p.orderType === 'string' ? p.orderType : (p.orderType as any)?.value;
                          return type === 'LOGISTICS';
                      });
                      const hasPersonalRental = selectedPricings.some(p => {
                          const type = typeof p.orderType === 'string' ? p.orderType : (p.orderType as any)?.value;
                          return type === 'PERSONAL_RENTAL';
                      });

                      if (!hasLogistics || !hasPersonalRental) {
                        return "Gói dịch vụ phải bao gồm ít nhất một bảng giá Logistics và một bảng giá Thuê cá nhân";
                      }
                      return true;
                    }
                  }}
                  render={() => (
                    <FormItem>
                      <ScrollArea className="h-[240px] w-full rounded-md border bg-muted/20">
                        {isPricingsLoading ? (
                          <div className="flex items-center justify-center p-8 text-sm text-muted-foreground">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tải bảng giá...
                          </div>
                        ) : filteredPricings.length === 0 ? (
                          <div className="flex items-center justify-center p-8 text-sm text-muted-foreground italic">
                            Không có bảng giá nào phù hợp với bộ lọc
                          </div>
                        ) : (
                          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                            {filteredPricings.map((pricing) => (
                              <div
                                key={pricing.id}
                                className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                                    form.watch("pricingIds")?.includes(pricing.id)
                                    ? "bg-primary/5 border-primary shadow-sm"
                                    : "bg-background border-border hover:bg-muted/50"
                                }`}
                                onClick={() => {
                                    const current = form.getValues("pricingIds") || [];
                                    const next = current.includes(pricing.id)
                                        ? current.filter(id => id !== pricing.id)
                                        : [...current, pricing.id];
                                    form.setValue("pricingIds", next, { shouldValidate: true });
                                }}
                              >
                                <Checkbox
                                    checked={form.watch("pricingIds")?.includes(pricing.id)}
                                    // onClick is handled by parent div
                                    className="mt-1"
                                />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">{pricing.name}</p>
                                    <div className="flex items-center gap-1.5 pt-1">
                                        <Badge variant="outline" className="text-[9px] h-3.5 px-1 py-0 uppercase">
                                            {typeof pricing.orderType === 'string' ? pricing.orderType : (pricing.orderType as any)?.value}
                                        </Badge>
                                        <p className="text-[11px] text-muted-foreground">
                                            {pricing.feePerBlock.toLocaleString()}đ/{pricing.blockDuration} {pricing.blockUnit || 'phút'}
                                        </p>
                                    </div>
                                </div>
                              </div>
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

            <DialogFooter className="pt-4 border-t">
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
