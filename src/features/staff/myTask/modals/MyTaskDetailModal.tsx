import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Calendar,
  Package,
  FileText,
  Loader2,
  AlertCircle,
  Wrench,
  ClipboardList,
  Plus,
  ImageIcon,
  CheckCircle,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import StatusComponent from "@/shared/components/StatusComponent";
import { myTaskService } from "../services/myTask.service";
import { workLogService } from "../services/workLog.service";
import type { TaskDetail, WorkLogDetail } from "../types/myTask.types";
import { TechnicalTaskStatus } from "../types/myTask.types";

const TASK_TYPE_LABELS: Record<string, string> = {
  REPAIR: "Sửa chữa",
  INSPECTION: "Kiểm tra",
  SETUP: "Lắp đặt",
  MAINTENANCE: "Bảo trì",
};

const PRIORITY_LABELS: Record<string, string> = {
  LOW: "Thấp",
  MEDIUM: "Trung bình",
  HIGH: "Cao",
  URGENT: "Khẩn cấp",
};

const priorityVariant: Record<string, "secondary" | "default" | "destructive"> = {
  LOW: "secondary",
  MEDIUM: "default",
  HIGH: "destructive",
  URGENT: "destructive",
};

const MAX_BEFORE_PHOTOS = 5;

export interface MyTaskDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string | null;
  onSuccess?: () => void;
}

export function MyTaskDetailModal({
  open,
  onOpenChange,
  taskId,
  onSuccess,
}: MyTaskDetailModalProps) {
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [workLogs, setWorkLogs] = useState<WorkLogDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [techNote, setTechNote] = useState("");
  const [showCreateWorkLog, setShowCreateWorkLog] = useState(false);
  const [createWorkDescription, setCreateWorkDescription] = useState("");
  const [createBeforePhotos, setCreateBeforePhotos] = useState<File[]>([]);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [updatingWorkLogId, setUpdatingWorkLogId] = useState<string | null>(null);
  const [completeWorkLogId, setCompleteWorkLogId] = useState<string | null>(null);

  const loadTask = useCallback(async () => {
    if (!taskId) return;
    try {
      setIsLoading(true);
      setError(null);
      const [taskRes, logsRes] = await Promise.all([
        myTaskService.getById(taskId),
        workLogService.getByTaskId(taskId).catch(() => []),
      ]);
      setTask(taskRes.data ?? null);
      setWorkLogs(Array.isArray(logsRes) ? logsRes : []);
      setSelectedStatus(taskRes.data?.status ?? "");
    } catch (err) {
      setError((err as Error)?.message ?? "Có lỗi khi tải chi tiết task");
    } finally {
      setIsLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    if (!open || !taskId) return;
    loadTask();
    return () => {
      setTask(null);
      setWorkLogs([]);
      setShowCreateWorkLog(false);
      setCreateWorkDescription("");
      setCreateBeforePhotos([]);
      setUpdatingWorkLogId(null);
      setCompleteWorkLogId(null);
    };
  }, [open, taskId, loadTask]);

  const handleUpdateStatus = async () => {
    if (!taskId || !selectedStatus || selectedStatus === task?.status) return;
    try {
      setStatusUpdating(true);
      await myTaskService.updateStatus(taskId, {
        status: selectedStatus,
        techNote: techNote.trim() || undefined,
      });
      toast.success("Đã cập nhật trạng thái");
      setTechNote("");
      await loadTask();
      onSuccess?.();
    } catch (err) {
      toast.error((err as Error)?.message ?? "Cập nhật trạng thái thất bại");
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleCreateWorkLog = async () => {
    if (!taskId || !createWorkDescription.trim()) {
      toast.error("Vui lòng nhập mô tả công việc");
      return;
    }
    if (createBeforePhotos.length > MAX_BEFORE_PHOTOS) {
      toast.error(`Tối đa ${MAX_BEFORE_PHOTOS} ảnh`);
      return;
    }
    try {
      setCreateSubmitting(true);
      await workLogService.create(taskId, {
        workDescription: createWorkDescription.trim(),
        beforePhotos: createBeforePhotos.length ? createBeforePhotos : undefined,
      });
      toast.success("Đã tạo work log");
      setShowCreateWorkLog(false);
      setCreateWorkDescription("");
      setCreateBeforePhotos([]);
      await loadTask();
      onSuccess?.();
    } catch (err) {
      toast.error((err as Error)?.message ?? "Tạo work log thất bại");
    } finally {
      setCreateSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-destructive">
            <AlertCircle className="h-10 w-10" />
            <p className="text-sm font-medium">{error}</p>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
          </div>
        )}
        {task && !isLoading && !error && (
          <>
            <DialogHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    {task.code}
                  </DialogTitle>
                  <DialogDescription>Chi tiết task của tôi</DialogDescription>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusComponent status={task.status} />
                  <Badge variant={priorityVariant[task.priority] ?? "default"}>
                    {PRIORITY_LABELS[task.priority] ?? task.priority}
                  </Badge>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Thông tin task
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Mã task</div>
                    <div className="text-sm text-muted-foreground font-mono">{task.code}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Loại task</div>
                    <div className="text-sm text-muted-foreground">
                      {TASK_TYPE_LABELS[task.taskType] ?? task.taskType}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Ngày tạo
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {task.createdAt ? new Date(task.createdAt).toLocaleString("vi-VN") : "-"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Cập nhật
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {task.updatedAt ? new Date(task.updatedAt).toLocaleString("vi-VN") : "-"}
                    </div>
                  </div>
                </div>
              </div>

              {task.incidentReport && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" />
                      Báo cáo sự cố liên quan
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Mã báo cáo</div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {task.incidentReport.code}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Locker
                        </div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {task.incidentReport.lockerLabel ?? "-"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Cabinet</div>
                        <div className="text-sm text-muted-foreground">
                          {task.incidentReport.cabinetName ?? "-"}
                        </div>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <div className="text-sm font-medium">Tiêu đề</div>
                        <div className="text-sm text-muted-foreground">
                          {task.incidentReport.title ?? "-"}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Mô tả
                      </div>
                      <div className="text-sm text-muted-foreground p-3 rounded-md bg-muted/50">
                        {task.incidentReport.description ?? "-"}
                      </div>
                    </div>
                    {(task.incidentReport.photoUrls?.length ?? 0) > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Hình ảnh đính kèm</div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {task.incidentReport.photoUrls!.map((url, index) => (
                            <div
                              key={index}
                              className="relative aspect-square rounded-md overflow-hidden border border-border bg-muted"
                            >
                              <img
                                src={url}
                                alt={`Hình ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              <Separator />
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Cập nhật trạng thái
                </h3>
                <div className="flex flex-wrap items-end gap-3">
                  <div className="space-y-2 min-w-[140px]">
                    <Label>Trạng thái</Label>
                    <Select
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(TechnicalTaskStatus).map((s) => (
                          <SelectItem key={s} value={s}>
                            {s.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 flex-1 min-w-[200px]">
                    <Label>Ghi chú kỹ thuật (tuỳ chọn)</Label>
                    <Input
                      placeholder="Ghi chú..."
                      value={techNote}
                      onChange={(e) => setTechNote(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleUpdateStatus}
                    disabled={statusUpdating || selectedStatus === task.status}
                  >
                    {statusUpdating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Cập nhật"
                    )}
                  </Button>
                </div>
              </div>

              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Work logs
                  </h3>
                  {!showCreateWorkLog && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCreateWorkLog(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Tạo work log
                    </Button>
                  )}
                </div>

                {showCreateWorkLog && (
                  <div className="rounded-lg border p-4 space-y-3 bg-muted/30">
                    <Label>Mô tả công việc *</Label>
                    <Textarea
                      placeholder="Mô tả công việc..."
                      value={createWorkDescription}
                      onChange={(e) => setCreateWorkDescription(e.target.value)}
                      rows={2}
                    />
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Ảnh trước khi sửa (tối đa {MAX_BEFORE_PHOTOS})
                      </Label>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files) setCreateBeforePhotos(Array.from(files).slice(0, MAX_BEFORE_PHOTOS));
                        }}
                      />
                      {createBeforePhotos.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Đã chọn {createBeforePhotos.length} ảnh
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleCreateWorkLog}
                        disabled={createSubmitting}
                      >
                        {createSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Tạo"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setShowCreateWorkLog(false);
                          setCreateWorkDescription("");
                          setCreateBeforePhotos([]);
                        }}
                      >
                        Huỷ
                      </Button>
                    </div>
                  </div>
                )}

                {workLogs.length === 0 && !showCreateWorkLog && (
                  <p className="text-sm text-muted-foreground">Chưa có work log nào.</p>
                )}
                {workLogs.map((log) => (
                  <WorkLogCard
                    key={log.id}
                    log={log}
                    onSuccess={() => {
                      loadTask();
                      onSuccess?.();
                    }}
                    updatingWorkLogId={updatingWorkLogId}
                    completeWorkLogId={completeWorkLogId}
                    setUpdatingWorkLogId={setUpdatingWorkLogId}
                    setCompleteWorkLogId={setCompleteWorkLogId}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Đóng
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function WorkLogCard({
  log,
  onSuccess,
  updatingWorkLogId,
  completeWorkLogId,
  setUpdatingWorkLogId,
  setCompleteWorkLogId,
}: {
  log: WorkLogDetail;
  onSuccess: () => void;
  updatingWorkLogId: string | null;
  completeWorkLogId: string | null;
  setUpdatingWorkLogId: (id: string | null) => void;
  setCompleteWorkLogId: (id: string | null) => void;
}) {
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
          {log.afterPhotoUrls.map((url, i) => (
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
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = e.target.files;
              if (files) setUpdateAfterPhotos(Array.from(files));
            }}
          />
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
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = e.target.files;
              if (files) setCompleteAfterPhotos(Array.from(files));
            }}
          />
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

export default MyTaskDetailModal;
