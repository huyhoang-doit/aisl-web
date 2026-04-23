/* eslint-disable no-unused-vars */
import { useEffect } from "react";
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
import type { Pricing, OrderTypeValue } from "../types/pricing.types";

export interface PricingFormData {
  name: string;
  blockDuration: number;
  feePerBlock: number;
  lateFeePerBlock: number;
  orderType: OrderTypeValue;
  description?: string;
  gracePeriod: number;
  cancellationFeeRate: number;
}

interface CreateOrUpdatePricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pricingData?: Pricing | null;
  onSubmit: (data: PricingFormData) => void | Promise<void>;
  mode?: "create" | "update";
}

export function CreateOrUpdatePricingModal({
  open,
  onOpenChange,
  pricingData = null,
  onSubmit,
  mode = "create",
}: CreateOrUpdatePricingModalProps) {
  const isUpdateMode = mode === "update" && pricingData;

  const form = useForm<PricingFormData>({
    defaultValues: {
      name: "",
      blockDuration: 60,
      feePerBlock: 10000,
      lateFeePerBlock: 5000,
      orderType: "PERSONAL_RENTAL",
      description: "",
      gracePeriod: 10,
      cancellationFeeRate: 0,
    },
  });

  useEffect(() => {
    if (open) {
      if (isUpdateMode && pricingData) {
        const orderVal =
          typeof pricingData.orderType === "string"
            ? pricingData.orderType
            : (pricingData.orderType as Record<string, unknown>)?.value ?? "PERSONAL_RENTAL";
        form.reset({
          name: pricingData.name,
          blockDuration: pricingData.blockDuration ?? 60,
          feePerBlock: pricingData.feePerBlock ?? 10000,
          lateFeePerBlock: pricingData.lateFeePerBlock ?? 5000,
          orderType: orderVal as OrderTypeValue,
          description: pricingData.description || "",
          gracePeriod: pricingData.gracePeriod ?? 10,
          cancellationFeeRate: pricingData.cancellationFeeRate ?? 0,
        });
      } else {
        form.reset({
          name: "",
          blockDuration: 60,
          feePerBlock: 10000,
          lateFeePerBlock: 5000,
          orderType: "PERSONAL_RENTAL",
          description: "",
          gracePeriod: 10,
          cancellationFeeRate: 0,
        });
      }
    }
  }, [open, pricingData, isUpdateMode, form]);

  const handleSubmit = async (formData: PricingFormData) => {
    try {
      if (formData.blockDuration < 0 || formData.feePerBlock < 0 || formData.lateFeePerBlock < 0 || formData.gracePeriod < 0 || formData.cancellationFeeRate < 0) {
        if (formData.blockDuration < 0) form.setError("blockDuration", { type: "manual", message: "Thời gian block không thể âm" });
        if (formData.feePerBlock < 0) form.setError("feePerBlock", { type: "manual", message: "Phí/block không thể âm" });
        if (formData.lateFeePerBlock < 0) form.setError("lateFeePerBlock", { type: "manual", message: "Phí trễ/block không thể âm" });
        if (formData.gracePeriod < 0) form.setError("gracePeriod", { type: "manual", message: "Grace period không thể âm" });
        if (formData.cancellationFeeRate < 0) form.setError("cancellationFeeRate", { type: "manual", message: "Phí hủy không thể âm" });
        return;
      }
      await onSubmit(formData);
      onOpenChange(false);
      if (!isUpdateMode) form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isUpdateMode ? "Cập nhật bảng giá" : "Thêm bảng giá mới"}
          </DialogTitle>
          <DialogDescription>
            {isUpdateMode
              ? "Cập nhật thông tin bảng giá."
              : "Thêm bảng giá mới vào hệ thống (blockDuration: phút, fee VND)."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                rules={{
                  required: "Tên bảng giá là bắt buộc",
                  minLength: { value: 2, message: "Tên phải có ít nhất 2 ký tự" },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên bảng giá <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="VD: Standard Pricing" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="orderType"
                rules={{ required: "Loại đơn hàng là bắt buộc" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại đơn hàng (Order type) <span className="text-red-500">*</span></FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LOGISTICS">Logistics</SelectItem>
                        <SelectItem value="PERSONAL_RENTAL">Thuê cá nhân (Personal rental)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="blockDuration"
                  rules={{
                    required: "Thời gian block là bắt buộc",
                    min: { value: 0, message: "Không thể âm" },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thời gian block (phút) <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="60"
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
                  name="gracePeriod"
                  rules={{
                    required: "Grace period là bắt buộc",
                    min: { value: 0, message: "Không thể âm" },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grace period (phút) <span className="text-red-500">*</span></FormLabel>
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
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="feePerBlock"
                  rules={{
                    required: "Phí mỗi block là bắt buộc",
                    min: { value: 0, message: "Không thể âm" },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phí mỗi block (VND) <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="10000"
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
                  name="lateFeePerBlock"
                  rules={{
                    required: "Phí trễ mỗi block là bắt buộc",
                    min: { value: 0, message: "Không thể âm" },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phí trễ mỗi block (VND) <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="5000"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="cancellationFeeRate"
                rules={{
                  required: "Tỷ lệ phí hủy đơn là bắt buộc",
                  min: { value: 0, message: "Không thể âm" },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tỷ lệ phí hủy đơn (%) <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
                        placeholder="Mô tả bảng giá (không bắt buộc)"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={form.formState.isSubmitting}>
                Hủy
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{isUpdateMode ? "Cập nhật" : "Tạo mới"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateOrUpdatePricingModal;
