/* eslint-disable no-unused-vars */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { ImageIcon, Loader2, ImagePlus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { workLogService } from "../services/workLog.service";

const MAX_BEFORE_PHOTOS = 5;

export interface CreateWorkLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
  onSuccess?: () => void;
}

export function CreateWorkLogModal({
  open,
  onOpenChange,
  taskId,
  onSuccess,
}: CreateWorkLogModalProps) {
  const [workDescription, setWorkDescription] = useState("");
  const [beforePhotos, setBeforePhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      setBeforePhotos((prev) => {
        const newFiles = [...prev, ...Array.from(files)];
        return newFiles.slice(0, MAX_BEFORE_PHOTOS);
      });
    }
  };

  const removePhoto = (index: number) => {
    setBeforePhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!workDescription.trim()) {
      toast.error("Vui lòng nhập mô tả công việc");
      return;
    }
    if (beforePhotos.length > MAX_BEFORE_PHOTOS) {
      toast.error(`Tối đa ${MAX_BEFORE_PHOTOS} ảnh`);
      return;
    }
    try {
      setSubmitting(true);
      await workLogService.create(taskId, {
        technicalTaskId: taskId,
        workDescription: workDescription.trim(),
        beforePhotos: beforePhotos.length ? beforePhotos : undefined,
      });
      toast.success("Đã tạo work log");
      setWorkDescription("");
      setBeforePhotos([]);
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      toast.error((err as Error)?.message ?? "Tạo work log thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setWorkDescription("");
      setBeforePhotos([]);
    }
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Tạo work log</DialogTitle>
          <DialogDescription>
            Bắt đầu công việc: mô tả và ảnh trước khi sửa (tuỳ chọn). Task sẽ chuyển sang trạng thái đang xử lý.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Mô tả công việc <span className="text-red-500">*</span></Label>
            <Textarea
              placeholder="Mô tả công việc..."
              value={workDescription}
              onChange={(e) => setWorkDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Ảnh trước khi sửa (tối đa {MAX_BEFORE_PHOTOS})
            </Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("before-photo-upload")?.click()}
                >
                  <ImagePlus className="h-4 w-4 mr-1" />
                  Thêm ảnh
                </Button>
                <input
                  id="before-photo-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              {beforePhotos.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {beforePhotos.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-sm"
                    >
                      <span className="truncate max-w-[150px]">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="text-muted-foreground hover:text-foreground shrink-0"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Huỷ
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Tạo work log"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateWorkLogModal;
