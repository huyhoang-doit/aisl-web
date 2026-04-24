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
import type { VehicleType } from "../types/vehicleType.types";

export interface VehicleTypeFormData {
  name: string;
  isActive: boolean;
}

interface CreateOrUpdateVehicleTypeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleTypeData?: VehicleType | null;
  onSubmit: (data: VehicleTypeFormData) => void | Promise<void>;
  mode?: "create" | "update";
}

export function CreateOrUpdateVehicleTypeModal({
  open,
  onOpenChange,
  vehicleTypeData = null,
  onSubmit,
  mode = "create",
}: CreateOrUpdateVehicleTypeModalProps) {
  const isUpdateMode = mode === "update" && vehicleTypeData;

  type FormValues = {
    name: string;
    isActive: boolean;
  };

  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (isUpdateMode && vehicleTypeData) {
        form.reset({
          name: vehicleTypeData.name,
          isActive: vehicleTypeData.isActive ?? true,
        });
      } else {
        form.reset({
          name: "",
          isActive: true,
        });
      }
    }
  }, [open, vehicleTypeData, isUpdateMode, form]);

  const handleSubmitForm = async (values: FormValues) => {
    try {
      const payload: VehicleTypeFormData = {
        name: values.name.trim(),
        isActive: values.isActive,
      };
      await onSubmit(payload);
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isUpdateMode ? "Cập nhật loại phương tiện" : "Thêm loại phương tiện"}
          </DialogTitle>
          <DialogDescription>
            {isUpdateMode
              ? "Cập nhật thông tin loại phương tiện."
              : "Thêm loại phương tiện mới (ví dụ: BIKE, MOTORBIKE, CAR)."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmitForm)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              rules={{
                required: "Tên loại phương tiện là bắt buộc",
                minLength: {
                  value: 1,
                  message: "Tên không được để trống",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên loại phương tiện <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: BIKE, MOTORBIKE, CAR"
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
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(v === "true")}
                    value={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Hoạt động</SelectItem>
                      <SelectItem value="false">Không hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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

export default CreateOrUpdateVehicleTypeModal;
