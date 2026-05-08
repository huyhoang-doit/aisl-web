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
import { Switch } from "@/shared/components/ui/switch";
import { CabinetSelector } from "@/features/admin/features/cabinet/components/CabinetSelector";
import type { DeviceAttachment } from "../types/deviceAttachment.types";

export interface DeviceAttachmentFormData {
  cabinetId: string;
  cabinetConfigId: string;
  name: string;
  serialNumber: string;
  description: string;
  isActive: boolean;
}

interface CreateOrUpdateDeviceAttachmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceAttachmentData?: DeviceAttachment | null;
  onSubmit: (data: DeviceAttachmentFormData) => void | Promise<void>;
  mode?: "create" | "update";
  defaultCabinetId?: string;
}

export function CreateOrUpdateDeviceAttachmentModal({
  open,
  onOpenChange,
  deviceAttachmentData = null,
  onSubmit,
  mode = "create",
  defaultCabinetId = "",
}: CreateOrUpdateDeviceAttachmentModalProps) {
  const isUpdateMode = mode === "update" && deviceAttachmentData;
  const isFromCabinetFilter = Boolean(defaultCabinetId);

  const form = useForm<DeviceAttachmentFormData>({
    defaultValues: {
      cabinetId: defaultCabinetId,
      cabinetConfigId: "",
      name: "",
      serialNumber: "",
      description: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (isUpdateMode && deviceAttachmentData) {
        form.reset({
          cabinetId: deviceAttachmentData.cabinetId,
          cabinetConfigId: deviceAttachmentData.cabinetConfigId ?? "",
          name: deviceAttachmentData.name,
          serialNumber: deviceAttachmentData.serialNumber,
          description: deviceAttachmentData.description ?? "",
          isActive: deviceAttachmentData.isActive ?? true,
        });
      } else {
        form.reset({
          cabinetId: defaultCabinetId,
          cabinetConfigId: "",
          name: "",
          serialNumber: "",
          description: "",
          isActive: true,
        });
      }
    }
  }, [open, deviceAttachmentData, isUpdateMode, defaultCabinetId, form]);

  const handleSubmitForm = async (formData: DeviceAttachmentFormData) => {
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
            {isUpdateMode ? "Cập nhật thiết bị" : "Thêm thiết bị mới"}
          </DialogTitle>
          <DialogDescription>
            {isUpdateMode
              ? "Cập nhật thông tin thiết bị tủ và setup. Những thay đổi sẽ được lưu vào hệ thống."
              : "Thêm thiết bị tủ mới và setup. Vui lòng điền đầy đủ thông tin."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmitForm)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Thông tin thiết bị
              </h3>

              {!isFromCabinetFilter ? (
                <FormField
                  control={form.control}
                  name="cabinetId"
                  // rules={{
                  //   required: "Vui lòng chọn cabinet",
                  // }}
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>Cabinet *</FormLabel> */}
                      <FormLabel>Cabinet (tùy chọn)</FormLabel>
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
                name="cabinetConfigId"
                // rules={{
                //   required: "Mã cấu hình cabinet là bắt buộc",
                // }}
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Mã cấu hình cabinet (Cabinet Config ID) *</FormLabel> */}
                    <FormLabel>Mã cấu hình cabinet (Cabinet Config ID) (tùy chọn)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập cabinet config ID"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{
                    required: "Tên thiết bị là bắt buộc",
                    minLength: {
                      value: 1,
                      message: "Tên thiết bị không được để trống",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên thiết bị <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên thiết bị" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serialNumber"
                  rules={{
                    required: "Số serial là bắt buộc",
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số serial <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số serial" {...field} />
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
                        placeholder="Mô tả thiết bị (tùy chọn)"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
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
                        Thiết bị có đang hoạt động không
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

export default CreateOrUpdateDeviceAttachmentModal;
