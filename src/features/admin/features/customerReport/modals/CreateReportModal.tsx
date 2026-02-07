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
import { CabinetSelector } from "@/features/admin/features/cabinet/components/CabinetSelector";
import { lockerService } from "@/features/admin/features/locker/services/locker.service";
import type { Locker } from "@/features/admin/features/locker/types/locker.types";
import { useState, useCallback } from "react";
import { ImagePlus, X } from "lucide-react";
import type { CreateReportPayload } from "../services/maintenanceReport.service";

export interface CreateReportFormData {
  cabinetId: string;
  lockerId: string;
  title: string;
  description: string;
  photos: File[];
}

interface CreateReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateReportPayload) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function CreateReportModal({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: CreateReportModalProps) {
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [lockersLoading, setLockersLoading] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);

  const form = useForm<CreateReportFormData>({
    defaultValues: {
      cabinetId: "",
      lockerId: "",
      title: "",
      description: "",
      photos: [],
    },
  });

  const cabinetId = form.watch("cabinetId");

  const loadLockers = useCallback(async (cabId: string) => {
    if (!cabId) {
      setLockers([]);
      form.setValue("lockerId", "");
      return;
    }
    try {
      setLockersLoading(true);
      const response = await lockerService.getLockerCabinet(cabId, { limit: 50, page: 1 });
      const list = response?.data?.lockers ?? [];
      setLockers(list);
      form.setValue("lockerId", "");
    } catch (error) {
      console.error("Error loading lockers:", error);
      setLockers([]);
    } finally {
      setLockersLoading(false);
    }
  }, [form]);

  useEffect(() => {
    if (open && cabinetId) {
      loadLockers(cabinetId);
    } else if (!cabinetId) {
      setLockers([]);
    }
  }, [open, cabinetId, loadLockers]);

  useEffect(() => {
    if (open) {
      form.reset({
        cabinetId: "",
        lockerId: "",
        title: "",
        description: "",
        photos: [],
      });
      setPhotoFiles([]);
    }
  }, [open, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      setPhotoFiles((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (formData: CreateReportFormData) => {
    if (!formData.cabinetId || !formData.lockerId || !formData.title || !formData.description) {
      form.setError("title", { type: "manual", message: "Vui lòng điền đầy đủ thông tin" });
      return;
    }
    try {
      await onSubmit({
        lockerId: formData.lockerId,
        cabinetId: formData.cabinetId,
        title: formData.title,
        description: formData.description,
        photos: photoFiles.length > 0 ? photoFiles : undefined,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo báo cáo sự cố</DialogTitle>
          <DialogDescription>
            Tạo báo cáo sự cố mới trên web admin (tính năng test)
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cabinetId"
              rules={{ required: "Vui lòng chọn cabinet" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cabinet *</FormLabel>
                  <FormControl>
                    <CabinetSelector
                      value={field.value}
                      onValueChange={field.onChange}
                      allowClear={false}
                      placeholder="Chọn cabinet"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lockerId"
              rules={{ required: "Vui lòng chọn locker" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Locker *</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!cabinetId || lockersLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={lockersLoading ? "Đang tải..." : "Chọn locker"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {lockers.map((locker) => (
                        <SelectItem key={locker.id} value={locker.id}>
                          {locker.lockerLabel ?? `Hàng ${locker.row} - Cột ${locker.column}`}
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
              name="title"
              rules={{ required: "Vui lòng nhập tiêu đề" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề *</FormLabel>
                  <FormControl>
                    <Input placeholder="Tiêu đề báo cáo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              rules={{ required: "Vui lòng nhập mô tả" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Mô tả chi tiết sự cố" rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Ảnh đính kèm
              </label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("photo-upload")?.click()}
                  >
                    <ImagePlus className="h-4 w-4 mr-1" />
                    Thêm ảnh
                  </Button>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
                {photoFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {photoFiles.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-sm"
                      >
                        {file.name}
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang tạo..." : "Tạo báo cáo"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateReportModal;
