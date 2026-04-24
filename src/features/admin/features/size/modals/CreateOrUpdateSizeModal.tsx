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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import type { Size } from "../types/size.types";

// Zod schema cho validation
const sizeSchema = z.object({
  name: z
    .string()
    .min(1, "Tên kích thước không được để trống"),
  width: z.number().min(0, "Chiều rộng không thể nhỏ hơn 0"),
  height: z.number().min(0, "Chiều cao không thể nhỏ hơn 0"),
  depth: z.number().min(0, "Chiều sâu không thể nhỏ hơn 0"),
});

// Payload theo yêu cầu backend
export type SizeFormData = z.infer<typeof sizeSchema>;

interface CreateOrUpdateSizeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sizeData?: Size | null;
  onSubmit: (data: SizeFormData) => void | Promise<void>;
  mode?: "create" | "update";
}

export default function CreateOrUpdateSizeModal({
  open,
  onOpenChange,
  sizeData = null,
  onSubmit,
  mode = "create",
}: CreateOrUpdateSizeModalProps) {
  const isUpdateMode = mode === "update" && sizeData;

  const form = useForm<SizeFormData>({
    resolver: zodResolver(sizeSchema),
    defaultValues: {
      name: "",
      width: 0,
      height: 0,
      depth: 0,
    },
  });

  useEffect(() => {
    if (open) {
      if (isUpdateMode && sizeData) {
        form.reset({
          name: sizeData.name,
          width: sizeData.width || 0,
          height: sizeData.height || 0,
          depth: sizeData.depth || 0,
        });
      } else {
        form.reset({
          name: "",
          width: 0,
          height: 0,
          depth: 0,
        });
      }
    }
  }, [open, sizeData, isUpdateMode, form]);

  const handleSubmit = async (formData: SizeFormData) => {
    try {
      // Chỉ gửi payload đúng format backend yêu cầu
      const payload: SizeFormData = {
        name: formData.name,
        width: formData.width || 0,
        height: formData.height || 0,
        depth: formData.depth || 0,
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isUpdateMode ? "Cập nhật kích thước" : "Thêm kích thước mới"}
          </DialogTitle>
          <DialogDescription>
            {isUpdateMode
              ? "Cập nhật thông tin kích thước. Những thay đổi sẽ được lưu vào hệ thống."
              : "Thêm kích thước mới vào hệ thống."}
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên kích thước <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: Nhỏ, Vừa, Lớn"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="width"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chiều rộng (cm) <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? parseFloat(e.target.value)  : ""
                            )
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
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chiều cao (cm) <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? parseFloat(e.target.value) : ""
                            )
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
                  name="depth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chiều sâu (cm) <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? parseFloat(e.target.value) : ""
                            )
                          }
                          value={field.value || ""}
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
