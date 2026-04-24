/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import type { Location } from "../types/location.types";
import SelectLocationMap from "../components/SelectLocationMap";

// Zod schema cho validation
const locationSchema = z.object({
  name: z
    .string()
    .min(1, "Tên địa điểm không được để trống")
    .min(2, "Tên địa điểm phải có ít nhất 2 ký tự"),
  address: z
    .string()
    .min(1, "Địa chỉ không được để trống")
    .min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  latitude: z
    .number()
    .min(-90, "Vĩ độ không hợp lệ")
    .max(90, "Vĩ độ không hợp lệ"),
  longitude: z
    .number()
    .min(-180, "Kinh độ không hợp lệ")
    .max(180, "Kinh độ không hợp lệ"),
  description: z.string().optional(),
  isActive: z.boolean(),
  plannedCabinetQuantity: z
    .number()
    .min(0, "Số lượng cabinet phải lớn hơn hoặc bằng 0"),
  plannedLockerQuantity: z
    .number()
    .min(0, "Số lượng locker phải lớn hơn hoặc bằng 0"),
});

// Payload theo yêu cầu backend
export type LocationFormData = z.infer<typeof locationSchema>;

interface CreateOrUpdateLocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locationData?: Location | null;
  onSubmit: (data: LocationFormData) => void | Promise<void>;
  mode?: "create" | "update";
}

export function CreateOrUpdateLocationModal({
  open,
  onOpenChange,
  locationData = null,
  onSubmit,
  mode = "create",
}: CreateOrUpdateLocationModalProps) {
  const isUpdateMode = mode === "update" && locationData;

  const form = useForm({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: "",
      address: "",
      latitude: 0,
      longitude: 0,
      description: "",
      isActive: true,
      plannedCabinetQuantity: 0,
      plannedLockerQuantity: 0,
    } as LocationFormData,
  });

  useEffect(() => {
    if (open) {
      if (isUpdateMode && locationData) {
        form.reset({
          name: locationData.name,
          address: locationData.address,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          description: locationData.description || "",
          isActive: locationData.isActive,
          plannedCabinetQuantity: locationData.plannedCabinetQuantity,
          plannedLockerQuantity: locationData.plannedLockerQuantity,
        });
      } else {
        form.reset({
          name: "",
          address: "",
          latitude: 0,
          longitude: 0,
          description: "",
          isActive: true,
          plannedCabinetQuantity: 0,
          plannedLockerQuantity: 0,
        });
      }
    }
  }, [open, locationData, isUpdateMode, form]);

  const handleSubmit = async (formData: LocationFormData) => {
    try {
      await onSubmit(formData);
      // Removed redundant onOpenChange(false) as parent handles it in onSubmit
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
            {isUpdateMode ? "Cập nhật địa điểm" : "Thêm địa điểm mới"}
          </DialogTitle>
          <DialogDescription>
            {isUpdateMode
              ? "Cập nhật thông tin địa điểm đặt các cụm cabinet. Những thay đổi sẽ được lưu vào hệ thống."
              : "Thêm địa điểm mới vào hệ thống. Địa điểm là nơi đặt các cụm cabinet."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Thông tin địa điểm
              </h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên địa điểm <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên địa điểm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập địa chỉ chi tiết" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

                <FormField
                  control={form.control}
                  name="latitude"
                  render={() => (
                    <FormItem>
                      <FormLabel>Bản đồ chọn vị trí <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <SelectLocationMap
                          latitude={form.watch("latitude")}
                          longitude={form.watch("longitude")}
                          onChange={(lat, lng) => {
                            form.setValue("latitude", lat);
                            form.setValue("longitude", lng);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Nhấp vào bản đồ để chọn vị trí (tọa độ sẽ được cập nhật
                        tự động)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kinh độ (Longitude) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="Nhập kinh độ"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập mô tả về địa điểm (không bắt buộc)"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Mô tả chi tiết về địa điểm này
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="plannedCabinetQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số lượng cụm tủ dự kiến triển khai <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Nhập số lượng cụm tủ"
                          {...field}
                          defaultValue={1}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="plannedLockerQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số lượng tủ con dự kiến triển khai <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Nhập số lượng tủ con"
                          {...field}
                          defaultValue={1}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Trạng thái hoạt động</FormLabel>
                      <FormDescription>
                        Bật/tắt trạng thái hoạt động của địa điểm này
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              /> */}
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

export default CreateOrUpdateLocationModal;
