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
import type { Cabinet } from "../types/cabinet.types";
import { LocationSelector } from "../components/LocationSelector";

export interface CabinetFormData {
  locationId: string;
  name: string;
  macAddress: string;
  ipAddress: string;
  firmwareVersion: string;
  totalRows: number;
  totalColumns: number;
}

interface CreateOrUpdateCabinetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cabinetData?: Cabinet | null;
  onSubmit: (data: CabinetFormData) => void | Promise<void>;
  mode?: "create" | "update";
  /** Khi mở từ Location Detail: mặc định chọn location này, ẩn selector địa điểm */
  defaultLocationId?: string;
}

export function CreateOrUpdateCabinetModal({
  open,
  onOpenChange,
  cabinetData = null,
  onSubmit,
  mode = "create",
  defaultLocationId,
}: CreateOrUpdateCabinetModalProps) {
  const isUpdateMode = mode === "update" && cabinetData;
  const isFromLocationDetail = Boolean(defaultLocationId);

  const form = useForm<CabinetFormData>({
    defaultValues: {
      locationId: defaultLocationId ?? "",
      name: "",
      macAddress: "",
      ipAddress: "",
      firmwareVersion: "",
      totalRows: 0,
      totalColumns: 0,
      ...cabinetData,
    },
  });

  useEffect(() => {
    if (open) {
      if (isUpdateMode && cabinetData) {
        form.reset({
          locationId: cabinetData.locationId,
          name: cabinetData.name,
          macAddress: cabinetData.macAddress,
          ipAddress: cabinetData.ipAddress,
          firmwareVersion: cabinetData.firmwareVersion,
          totalRows: cabinetData.totalRows,
          totalColumns: cabinetData.totalColumns,
        });
      } else {
        form.reset({
          locationId: isFromLocationDetail ? defaultLocationId! : "",
          name: "",
          macAddress: "",
          ipAddress: "",
          firmwareVersion: "",
          totalRows: 0,
          totalColumns: 0,
        });
      }
    }
  }, [open, cabinetData, isUpdateMode, isFromLocationDetail, defaultLocationId, form]);

  const handleSubmitForm = async (formData: CabinetFormData) => {
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
            {isUpdateMode ? "Cập nhật cụm tủ" : "Thêm cụm tủ mới"}
          </DialogTitle>
          <DialogDescription>
            {isUpdateMode
              ? "Cập nhật thông tin cụm tủ. Những thay đổi sẽ được lưu vào hệ thống."
              : "Thêm cụm tủ mới vào địa điểm. Cụm tủ là cụm chứa nhiều tủ."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmitForm)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Thông tin cụm tủ
              </h3>

              {!isFromLocationDetail ? (
                <FormField
                  control={form.control}
                  name="locationId"
                  // rules={{
                  //   required: "Vui lòng chọn địa điểm",
                  // }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa điểm</FormLabel>
                      <FormControl>
                        <LocationSelector
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Chọn địa điểm đặt cụm tủ"
                          filterActiveOnly={true}
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
                  name="locationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <input type="hidden" {...field} value={defaultLocationId ?? ""} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{
                    required: "Tên cụm tủ là bắt buộc",
                    minLength: {
                      value: 2,
                      message: "Tên cụm tủ phải có ít nhất 2 ký tự",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên cụm tủ <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập tên cụm tủ"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="macAddress"
                  rules={{
                    // required: "MAC Address là bắt buộc",
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ MAC</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="VD: AA:BB:CC:DD:EE:FF"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ipAddress"
                  rules={{
                    // required: "IP Address là bắt buộc",
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ IP</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="VD: 192.168.1.100"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="firmwareVersion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phiên bản firmware</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="VD: 1.0.0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalRows"
                  rules={{
                    required: "Số hàng là bắt buộc",
                    min: {
                      value: 0,
                      message: "Số hàng không được âm",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tổng số hàng <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10) || "")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalColumns"
                  rules={{
                    required: "Số cột là bắt buộc",
                    min: {
                      value: 0,
                      message: "Số cột không được âm",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tổng số cột <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10) || "")}
                        />
                      </FormControl>
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

export default CreateOrUpdateCabinetModal;
