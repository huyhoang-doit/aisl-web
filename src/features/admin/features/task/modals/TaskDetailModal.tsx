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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import {
  Calendar,
  Package,
  FileText,
  Loader2,
  AlertCircle,
  Wrench,
  ClipboardList,
} from "lucide-react";
import { useEffect, useState } from "react";
import StatusComponent from "@/shared/components/StatusComponent";
import { taskService } from "../services/task.service";
import { TechnicalTaskStatus, type TaskDetail } from "../types/task.types";
import { ViewWorkLogsOfTask } from "@/features/staff/myTask/components/ViewWorkLogsOfTask";
import type { TechnicalTaskStatusType } from "@/features/staff/myTask/types/myTask.types";
import { toast } from "sonner";

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

export interface TaskDetailModalProps {
  open: boolean;
  // eslint-disable-next-line no-unused-vars -- type-only callback param
  onOpenChange: (open: boolean) => void;
  taskId: string | null;
}

export function TaskDetailModal({ open, onOpenChange, taskId }: TaskDetailModalProps) {
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!open || !taskId) return;
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    taskService
      .getById(taskId)
      .then((res) => {
        if (!cancelled) setTask(res.data ?? null);
      })
      .catch((err) => {
        if (!cancelled) setError((err as Error)?.message ?? "Có lỗi khi tải chi tiết task");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
      setTask(null);
      setError(null);
    };
  }, [open, taskId]);

  const handleUpdateStatus = async (status: string) => {
    if (!taskId) return;
    try {
      setIsUpdatingStatus(true);
      await taskService.updateStatus(taskId, { status });
      const taskRes = await taskService.getById(taskId);
      setTask(taskRes.data ?? null);
      toast.success(status === TechnicalTaskStatus.RESOLVED ? "Đã xác nhận task" : "Đã trả task về trạng thái mở");
    } catch (err) {
      toast.error((err as Error)?.message ?? "Cập nhật trạng thái task thất bại");
    } finally {
      setIsUpdatingStatus(false);
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
                  <DialogDescription>Chi tiết task bảo trì</DialogDescription>
                </div>
                <div className="flex items-center gap-2 shrink-0 mr-5">
                  <StatusComponent status={task.status} />
                  <Badge variant={priorityVariant[task.priority] ?? "default"}>
                    {PRIORITY_LABELS[task.priority] ?? task.priority}
                  </Badge>
                </div>
              </div>
            </DialogHeader>

            {task.status === TechnicalTaskStatus.RESOLVED ||
            task.status === TechnicalTaskStatus.COMPLETED ? (
              <Tabs defaultValue="info" className="w-full mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info" className="active-tab">
                    Thông tin
                  </TabsTrigger>
                  <TabsTrigger value="worklog" className="active-tab">
                    Work log
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="space-y-6 mt-4">
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
                          <div className="text-sm font-medium">Người phụ trách</div>
                          <div className="text-sm text-muted-foreground">{task.assignedToName ?? "-"}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">Người giao việc</div>
                          <div className="text-sm text-muted-foreground">{task.assignedByName ?? "-"}</div>
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
                              <div className="text-sm font-medium">Người báo cáo</div>
                              <div className="text-sm text-muted-foreground">
                                {task.incidentReport.reporterName ?? "-"}
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
                  </div>
                </TabsContent>
                <TabsContent value="worklog" className="space-y-6 mt-4">
                  {taskId && (
                    <ViewWorkLogsOfTask
                      taskId={taskId}
                      taskStatus={task.status as TechnicalTaskStatusType}
                    />
                  )}
                </TabsContent>
              </Tabs>
            ) : (
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
                      <div className="text-sm font-medium">Người phụ trách</div>
                      <div className="text-sm text-muted-foreground">{task.assignedToName ?? "-"}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Người giao việc</div>
                      <div className="text-sm text-muted-foreground">{task.assignedByName ?? "-"}</div>
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
                          <div className="text-sm font-medium">Người báo cáo</div>
                          <div className="text-sm text-muted-foreground">
                            {task.incidentReport.reporterName ?? "-"}
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
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t">
              {task.status === TechnicalTaskStatus.COMPLETED && (
                <>
                  <Button
                    variant="outline"
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdateStatus(TechnicalTaskStatus.OPEN)}
                  >
                    {isUpdatingStatus && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                    Từ chối
                  </Button>
                  <Button
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdateStatus(TechnicalTaskStatus.RESOLVED)}
                  >
                    {isUpdatingStatus && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                    Xác nhận
                  </Button>
                </>
              )}
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

export default TaskDetailModal;
