import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { CheckCircle, Loader2, ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { workLogService } from "../services/workLog.service";
import type { WorkLogDetail } from "../types/myTask.types";

export interface WorkLogCardProps {
  log: WorkLogDetail;
  onSuccess: () => void;
  updatingWorkLogId: string | null;
  completeWorkLogId: string | null;
  setUpdatingWorkLogId: (id: string | null) => void;
  setCompleteWorkLogId: (id: string | null) => void;
}

export function WorkLogCard({
  log,
  onSuccess,
  updatingWorkLogId,
  completeWorkLogId,
  setUpdatingWorkLogId,
  setCompleteWorkLogId,
}: WorkLogCardProps) {
  const [updateDesc, setUpdateDesc] = useState(log.workDescription ?? "");
  const [updateParts, setUpdateParts] = useState(log.partsReplaced ?? "");
  const [updateNote, setUpdateNote] = useState(log.techNote ?? "");
  const [updateAfterPhotos, setUpdateAfterPhotos] = useState<File[]>([]);
  const [completeNote, setCompleteNote] = useState("");
  const [completeAfterPhotos, setCompleteAfterPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const isUpdating = updatingWorkLogId === log.id;
  const isCompleting = completeWorkLogId === log.id;
  const isCompleted = !!log.completedAt;

  const handleUpdateFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      setUpdateAfterPhotos((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const removeUpdatePhoto = (index: number) => {
    setUpdateAfterPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCompleteFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      setCompleteAfterPhotos((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const removeCompletePhoto = (index: number) => {
    setCompleteAfterPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    try {
      setSubmitting(true);
      await workLogService.update(log.id, {
        workDescription: updateDesc.trim() || undefined,
        partsReplaced: updateParts.trim() || undefined,
        techNote: updateNote.trim() || undefined,
        afterPhotos: updateAfterPhotos.length ? updateAfterPhotos : undefined,
      });
      toast.success("Đã cập nhật work log");
      setUpdatingWorkLogId(null);
      setUpdateAfterPhotos([]);
      onSuccess();
    } catch (err) {
      toast.error((err as Error)?.message ?? "Cập nhật thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async () => {
    try {
      setSubmitting(true);
      await workLogService.complete(log.id, {
        techNote: completeNote.trim() || undefined,
        afterPhotos: completeAfterPhotos.length ? completeAfterPhotos : undefined,
      });
      toast.success("Đã hoàn thành work log");
      setCompleteWorkLogId(null);
      setCompleteNote("");
      setCompleteAfterPhotos([]);
      onSuccess();
    } catch (err) {
      toast.error((err as Error)?.message ?? "Hoàn thành thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border p-4 space-y-2 bg-card">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{log.workDescription || "—"}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Bắt đầu: {log.startedAt ? new Date(log.startedAt).toLocaleString("vi-VN") : "-"}
            {log.completedAt && (
              <> · Hoàn thành: {new Date(log.completedAt).toLocaleString("vi-VN")}</>
            )}
          </p>
        </div>
        {!isCompleted && (
          <div className="flex gap-1 shrink-0">
            {!isUpdating && !isCompleting && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setUpdatingWorkLogId(log.id);
                    setCompleteWorkLogId(null);
                  }}
                >
                  Cập nhật
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => {
                    setCompleteWorkLogId(log.id);
                    setUpdatingWorkLogId(null);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Hoàn thành
                </Button>
              </>
            )}
          </div>
        )}
      </div>
      {(log.beforePhotoUrls?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground">Ảnh trước:</span>
          {log.beforePhotoUrls!.map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-12 h-12 rounded border overflow-hidden"
            >
              <img src={url} alt={`Before ${i + 1}`} className="w-full h-full object-cover" />
            </a>
          ))}
        </div>
      )}
      {(log.afterPhotoUrls?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground">Ảnh sau:</span>
          {(log.afterPhotoUrls ?? []).map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-12 h-12 rounded border overflow-hidden"
            >
              <img src={url} alt={`After ${i + 1}`} className="w-full h-full object-cover" />
            </a>
          ))}
        </div>
      )}
      {isUpdating && (
        <div className="pt-3 space-y-2 border-t">
          <Label>Mô tả</Label>
          <Textarea
            value={updateDesc}
            onChange={(e) => setUpdateDesc(e.target.value)}
            rows={2}
          />
          <Label>Linh kiện thay thế (JSON)</Label>
          <Input
            value={updateParts}
            onChange={(e) => setUpdateParts(e.target.value)}
            placeholder='["part1", "part2"]'
          />
          <Label>Ghi chú kỹ thuật</Label>
          <Input
            value={updateNote}
            onChange={(e) => setUpdateNote(e.target.value)}
          />
          <Label>Ảnh sau khi sửa</Label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById(`update-photo-upload-${log.id}`)?.click()}
              >
                <ImagePlus className="h-4 w-4 mr-1" />
                Thêm ảnh
              </Button>
              <input
                id={`update-photo-upload-${log.id}`}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleUpdateFileChange}
              />
            </div>
            {updateAfterPhotos.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {updateAfterPhotos.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-sm"
                  >
                    <span className="truncate max-w-[150px]">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeUpdatePhoto(i)}
                      className="text-muted-foreground hover:text-foreground shrink-0"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleUpdate} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Lưu"}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setUpdatingWorkLogId(null)}>
              Huỷ
            </Button>
          </div>
        </div>
      )}
      {isCompleting && (
        <div className="pt-3 space-y-2 border-t">
          <Label>Ghi chú hoàn thành</Label>
          <Input
            value={completeNote}
            onChange={(e) => setCompleteNote(e.target.value)}
          />
          <Label>Ảnh kết quả cuối</Label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById(`complete-photo-upload-${log.id}`)?.click()}
              >
                <ImagePlus className="h-4 w-4 mr-1" />
                Thêm ảnh
              </Button>
              <input
                id={`complete-photo-upload-${log.id}`}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleCompleteFileChange}
              />
            </div>
            {completeAfterPhotos.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {completeAfterPhotos.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-sm"
                  >
                    <span className="truncate max-w-[150px]">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeCompletePhoto(i)}
                      className="text-muted-foreground hover:text-foreground shrink-0"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleComplete} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Hoàn thành"}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setCompleteWorkLogId(null)}>
              Huỷ
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkLogCard;
