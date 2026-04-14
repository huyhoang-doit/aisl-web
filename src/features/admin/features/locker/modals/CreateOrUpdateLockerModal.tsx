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
import { Switch } from "@/shared/components/ui/switch";
import { CabinetSelector } from "@/features/admin/features/cabinet/components/CabinetSelector";
import { SizeSelector } from "@/features/admin/features/size/components/SizeSelector";
import type { Locker, LockerStatus } from "../types/locker.types";

export interface LockerFormData {
  cabinetId: string;
  sizeId: string;
  row: number;
  column: number;
  status: LockerStatus;
  isActive: boolean;
}

interface CreateOrUpdateLockerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lockerData?: Locker | null;
  onSubmit: (data: LockerFormData) => void | Promise<void>;
  mode?: "create" | "update";
  /** Pre-select cabinet khi tạo mới (từ filter trang) */
  defaultCabinetId?: string;
}

const STATUS_OPTIONS: { value: LockerStatus; label: string }[] = [
  { value: "AVAILABLE", label: "Trống" },
  { value: "OCCUPIED", label: "Đã thuê" },
  { value: "MAINTENANCE", label: "Bảo trì" },
  { value: "RESERVED", label: "Đã đặt" },
];

export function CreateOrUpdateLockerModal({
  open,
  onOpenChange,
  lockerData = null,
  onSubmit,
  mode = "create",
  defaultCabinetId = "",
}: CreateOrUpdateLockerModalProps) {
  const isUpdateMode = mode === "update" && lockerData;
  const isFromCabinetDetail = Boolean(defaultCabinetId);

  const form = useForm<LockerFormData>({
    defaultValues: {
      cabinetId: defaultCabinetId,
      sizeId: "",
      row: 0,
      column: 0,
      status: "AVAILABLE",
      isActive: false,
    },
  });

  useEffect(() => {
    if (open) {
      if (isUpdateMode && lockerData) {
        form.reset({
          cabinetId: lockerData.cabinetId,
          sizeId: lockerData.sizeTypeId,
          row: lockerData.row,
          column: lockerData.column,
          status: lockerData.status,
          isActive: lockerData.isActive,
        });
      } else {
        form.reset({
          cabinetId: defaultCabinetId,
          sizeId: "",
          row: 0,
          column: 0,
          status: "AVAILABLE",
          isActive: false,
        });
      }
    }
  }, [open, lockerData, isUpdateMode, defaultCabinetId, form]);

  const handleSubmitForm = async (formData: LockerFormData) => {
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
            onSubmit={form.handleSubmit(handleSubmitForm)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Thông tin locker
              </h3>

              {!isFromCabinetDetail ? (
                <FormField
                  control={form.control}
                  name="cabinetId"
                  rules={{
                    required: "Vui lòng chọn cabinet",
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cabinet <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <CabinetSelector
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Chọn cabinet"
                          allowClear={false}
                          className="min-w-[200px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="cabinetId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <input type="hidden" {...field} value={defaultCabinetId} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="sizeId"
                rules={{
                  required: "Vui lòng chọn kích thước",
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kích thước <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <SizeSelector
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Chọn kích thước"
                        allowClear={false}
                        className="min-w-[200px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="row"
                  rules={{
                    required: "Số hàng là bắt buộc",
                    min: {
                      value: 0,
                      message: "Số hàng không được âm",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hàng <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value, 10) || "")
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="column"
                  rules={{
                    required: "Số cột là bắt buộc",
                    min: {
                      value: 0,
                      message: "Số cột không được âm",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cột <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value, 10) || "")
                          }
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
                  name="status"
                  rules={{
                    required: "Trạng thái là bắt buộc",
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái <span className="text-red-500">*</span></FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {STATUS_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Trạng thái hoạt động</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Locker có đang hoạt động không
                        </p>
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

export default CreateOrUpdateLockerModal;
