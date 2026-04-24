import { useEffect, useState, useMemo, useCallback } from "react";
import { Loader2, LayoutGrid } from "lucide-react";
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
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (open: boolean) => void;
  planData?: Plan | null;
  // eslint-disable-next-line no-unused-vars
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
  const isUpdateMode = mode === "update" && !!planData;
  const [allPricings, setAllPricings] = useState<Pricing[]>([]);
  const [isPricingsLoading, setIsPricingsLoading] = useState(false);

  const defaultValues = useMemo(() => (isUpdateMode && planData ? {
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
  } : {
    name: "",
    maxLockers: 0,
    price: 0,
    fixedLocker: 0,
    discountLockerRental: 0,
    discountFixedLockerRental: 0,
    description: "",
    status: "ACTIVE" as PlanStatus,
    isFreeDefault: false,
    pricingIds: [],
  }), [isUpdateMode, planData]);

  const form = useForm<PlanFormData>({
    defaultValues
  });

  // Reset form when defaultValues change
  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
  }, [open, defaultValues, form]);

  // Watch isFreeDefault to handle price logic
  const isFreeDefault = form.watch("isFreeDefault");
  
  useEffect(() => {
    if (isFreeDefault) {
      form.setValue("price", 0, { shouldValidate: true });
    }
  }, [isFreeDefault, form]);

  const handlePricingToggle = useCallback((pricingId: string) => {
    const currentIds = form.getValues("pricingIds") || [];
    const next = currentIds.includes(pricingId)
        ? currentIds.filter(id => id !== pricingId)
        : [...currentIds, pricingId];
    form.setValue("pricingIds", next, { shouldValidate: true });
  }, [form]);

  const pricingIdsRules = useMemo(() => ({
    validate: (value: string[]) => {
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
  }), [allPricings]);

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

  const onFormSubmit = async (data: PlanFormData) => {
    try {
      await onSubmit(data);
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
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2 text-left border-b bg-muted/10">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            {isUpdateMode ? (
              <>
                <Edit className="w-6 h-6 text-blue-500" />
                Cập nhật gói dịch vụ
              </>
            ) : (
              <>
                <PlusCircle className="w-6 h-6 text-green-500" />
                Tạo mới gói dịch vụ
              </>
            )}
          </DialogTitle>
          <DialogDescription>
             {isUpdateMode ? "Cập nhật thông tin gói dịch vụ hiện tại." : "Tạo cấu hình mới cho gói dịch vụ của bạn."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} id="plan-form" className="space-y-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tên gói */}
                <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: "Tên gói là bắt buộc" }}
                    render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Tên gói dịch vụ</FormLabel>
                    <FormControl><Input placeholder="Ví dụ: Gói Cơ Bản" {...field} className="h-11" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Giá tiền */}
                <FormField
                    control={form.control}
                    name="price"
                    rules={{ required: "Giá là bắt buộc", min: { value: 0, message: "Giá không thể nhỏ hơn 0" } }}
                    render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Giá niêm yết (VNĐ)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₫</span>
                        <Input 
                            type="number" 
                            placeholder="0" 
                            {...field} 
                            disabled={isFreeDefault} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                            className="pl-8 h-11" 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Max Lockers */}
                <FormField control={form.control} name="maxLockers" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Số tủ tối đa</FormLabel>
                    <FormControl><Input type="number" placeholder="10" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} className="h-11" /></FormControl>
                    <FormDescription>Tổng số tủ một user có thể thuê</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Fixed Locker */}
                <FormField control={form.control} name="fixedLocker" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Số tủ cố định</FormLabel>
                    <FormControl><Input type="number" placeholder="2" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} className="h-11" /></FormControl>
                    <FormDescription>Số tủ thuê dài hạn được phép</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Discount Rental */}
                <FormField control={form.control} name="discountLockerRental" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Giảm giá thuê (%)</FormLabel>
                    <FormControl><Input type="number" placeholder="0" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} className="h-11" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Discount Fixed */}
                <FormField control={form.control} name="discountFixedLockerRental" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Giảm giá thuê cố định (%)</FormLabel>
                    <FormControl><Input type="number" placeholder="0" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} className="h-11" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* Mô tả */}
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Mô tả</FormLabel>
                  <FormControl><Textarea placeholder="Mô tả các quyền lợi của gói..." className="resize-none min-h-[100px]" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Switches */}
              <div className="flex flex-col sm:flex-row gap-6 p-4 bg-muted/40 rounded-xl border border-border">
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0">
                    <FormControl>
                        <Switch 
                            checked={field.value === "ACTIVE"} 
                            onCheckedChange={(checked) => field.onChange(checked ? "ACTIVE" : "INACTIVE")} 
                        />
                    </FormControl>
                    <div className="space-y-0.5">
                        <FormLabel className="text-sm font-bold">Kích hoạt gói</FormLabel>
                        <p className="text-xs text-muted-foreground">Cho phép người dùng đăng ký</p>
                    </div>
                  </FormItem>
                )} />
                <FormField control={form.control} name="isFreeDefault" render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0">
                    <FormControl>
                        <Switch 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                        />
                    </FormControl>
                    <div className="space-y-0.5">
                        <FormLabel className="text-sm font-bold">Gói mặc định miễn phí</FormLabel>
                        <p className="text-xs text-muted-foreground">Gán tự động cho User mới</p>
                    </div>
                  </FormItem>
                )} />
              </div>

              {/* Bảng giá áp dụng */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="text-base font-bold flex items-center gap-2">
                    <LayoutGrid className="w-5 h-5 text-purple-500" />
                    Bảng giá áp dụng
                  </div>
                  <Badge variant="secondary" className="font-mono">
                    Đã chọn {(form.watch("pricingIds") || []).length}
                  </Badge>
                </div>
                <p className="text-[13px] text-muted-foreground">Gói dịch vụ phải bao gồm Logistics và Thuê cá nhân</p>
                
                <FormField 
                    control={form.control} 
                    name="pricingIds" 
                    rules={pricingIdsRules}
                    render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 border rounded-xl p-3 bg-muted/20">
                        {isPricingsLoading ? (
                          <div className="col-span-full py-10 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                            <Loader2 className="w-8 h-8 animate-spin" />
                            <p className="text-sm">Đang tải bảng giá...</p>
                          </div>
                        ) : allPricings.length > 0 ? (
                            allPricings.map((pricing) => (
                            <div 
                                key={pricing.id} 
                                onClick={() => handlePricingToggle(pricing.id)} 
                                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                                    field.value?.includes(pricing.id) 
                                    ? "bg-primary/10 border-primary shadow-sm" 
                                    : "bg-background border-border hover:border-primary/50 hover:bg-muted/30"
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <input 
                                    type="checkbox" 
                                    checked={field.value?.includes(pricing.id)} 
                                    onChange={() => handlePricingToggle(pricing.id)}
                                    className="h-4 w-4 rounded border-primary accent-primary cursor-pointer"
                                />
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold">{pricing.name}</p>
                                    <div className="flex items-center gap-1.5">
                                        <Badge variant="outline" className="text-[9px] h-3.5 px-1 py-0 uppercase bg-background">
                                            {typeof pricing.orderType === 'string' ? pricing.orderType : (pricing.orderType as any)?.value}
                                        </Badge>
                                        <p className="text-[10px] text-muted-foreground font-medium">
                                            {pricing.feePerBlock.toLocaleString()}đ/{pricing.blockDuration} {pricing.blockUnit || 'phút'}
                                        </p>
                                    </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                            <div className="col-span-full py-10 text-center border border-dashed rounded-lg bg-background">
                                <p className="text-sm text-muted-foreground">Không tìm thấy bảng giá nào</p>
                            </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </form>
          </Form>
        </div>

        <DialogFooter className="p-6 pt-4 border-t bg-muted/10">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="h-11 px-6">Hủy</Button>
          <Button 
            type="submit" 
            form="plan-form"
            className="h-11 px-10 min-w-[160px] font-bold"
          >
            {isUpdateMode ? "Cập nhật gói" : "Tạo gói mới"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const PlusCircle = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
)

const Edit = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
)

export default CreateOrUpdatePlanModal;
