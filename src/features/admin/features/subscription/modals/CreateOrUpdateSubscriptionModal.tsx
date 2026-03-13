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
import type { Subscription, SubscriptionStatusValue } from "../types/subscription.types";
import type { Plan } from "@/features/admin/features/plan/types/plan.types";

export interface SubscriptionFormData {
  userId: string;
  planId: string;
  startDate?: string;
  endDate?: string;
  status: SubscriptionStatusValue;
}

interface CreateOrUpdateSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscriptionData?: Subscription | null;
  plans?: Plan[];
  onSubmit: (data: SubscriptionFormData) => void | Promise<void>;
  mode?: "create" | "update";
}

export function CreateOrUpdateSubscriptionModal({
  open,
  onOpenChange,
  subscriptionData = null,
  plans = [],
  onSubmit,
  mode = "create",
}: CreateOrUpdateSubscriptionModalProps) {
  const isUpdateMode = mode === "update" && subscriptionData;

  const form = useForm<SubscriptionFormData>({
    defaultValues: {
      userId: "",
      planId: "",
      startDate: "",
      endDate: "",
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    if (open) {
      if (isUpdateMode && subscriptionData) {
        const statusVal =
          typeof subscriptionData.status === "string"
            ? subscriptionData.status
            : (subscriptionData.status as Record<string, unknown>)?.value ?? "ACTIVE";
        const endDateStr = subscriptionData.endDate?.trim();
        form.reset({
          userId: subscriptionData.userId,
          planId: subscriptionData.plan?.id ?? subscriptionData.planId ?? "",
          startDate: subscriptionData.startDate
            ? subscriptionData.startDate.split("T")[0]
            : "",
          endDate: endDateStr ? endDateStr.split("T")[0] : "",
          status: statusVal as SubscriptionStatusValue,
        });
      } else {
        form.reset({
          userId: "",
          planId: "",
          startDate: "",
          endDate: "",
          status: "ACTIVE",
        });
      }
    }
  }, [open, subscriptionData, isUpdateMode, form]);

  const handleSubmit = async (formData: SubscriptionFormData) => {
    try {
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
            {isUpdateMode ? "Cập nhật đăng ký dịch vụ" : "Thêm đăng ký dịch vụ mới"}
          </DialogTitle>
          <DialogDescription>
            {isUpdateMode
              ? "Cập nhật thông tin đăng ký dịch vụ của người dùng."
              : "Đăng ký gói dịch vụ cho người dùng trong hệ thống."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="userId"
                rules={{ required: "ID người dùng là bắt buộc" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID người dùng (userId) *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập ID hoặc keycloakUserId"
                        {...field}
                        disabled={isUpdateMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="planId"
                rules={{ required: "Gói đăng ký là bắt buộc" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gói đăng ký *</FormLabel>
                    {plans.length > 0 ? (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                        disabled={isUpdateMode}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn gói đăng ký" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {plans.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name} - {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p.price)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <FormControl>
                        <Input
                          placeholder="Nhập ID gói đăng ký"
                          {...field}
                          disabled={isUpdateMode}
                        />
                      </FormControl>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày bắt đầu</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày kết thúc</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="status"
                rules={{ required: "Trạng thái là bắt buộc" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                        <SelectContent>
                        <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                        <SelectItem value="SUSPENDED">Tạm ngưng</SelectItem>
                        <SelectItem value="EXPIRED">Hết hạn</SelectItem>
                        <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit">{isUpdateMode ? "Cập nhật" : "Tạo mới"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateOrUpdateSubscriptionModal;
