import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Loader2, AlertCircle, Wrench } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import StatusComponent from "@/shared/components/StatusComponent";
import { myTaskService } from "../services/myTask.service";
import type { TaskDetail } from "../types/myTask.types";
import { TechnicalTaskStatus } from "../types/myTask.types";
import { ViewWorkLogsOfTask } from "../components/ViewWorkLogsOfTask";
import { TaskInfoContent } from "../components/TaskInfoContent";
import { CreateWorkLogModal } from "./CreateWorkLogModal";

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

export interface MyTaskDetailModalProps {
  open: boolean;
  // eslint-disable-next-line no-unused-vars -- type-only callback param
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const [confirmProcessOpen, setConfirmProcessOpen] = useState(false);
  const [createWorkLogModalOpen, setCreateWorkLogModalOpen] = useState(false);

  const loadTask = useCallback(async () => {
    if (!taskId) return;
    try {
      setIsLoading(true);
      setError(null);
      const taskRes = await myTaskService.getById(taskId);
      setTask(taskRes.data ?? null);
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
    };
  }, [open, taskId, loadTask]);

  const handleSuccess = () => {
    loadTask();
    onSuccess?.();
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto flex flex-col justify-start">
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
            <DialogHeader className="border-b border-primary/20 pb-4">
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

            {task.status !== TechnicalTaskStatus.OPEN ? (
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
                  <TaskInfoContent task={task} />
                </TabsContent>
                <TabsContent value="worklog" className="space-y-6 mt-4">
                  {taskId && (
                    <ViewWorkLogsOfTask taskId={taskId} onSuccess={handleSuccess} />
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="mt-6 space-y-6">
                <TaskInfoContent task={task} />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t">
              {task.status === TechnicalTaskStatus.OPEN ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setConfirmCloseOpen(true)}
                  >
                    Đóng
                  </Button>
                  <Button onClick={() => setConfirmProcessOpen(true)}>
                    Xử lý
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Đóng
                </Button>
              )}
            </div>

            <AlertDialog open={confirmCloseOpen} onOpenChange={setConfirmCloseOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận đóng</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc muốn đóng cửa sổ này?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onOpenChange(false)}>
                    Đóng
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={confirmProcessOpen} onOpenChange={setConfirmProcessOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận xử lý</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc bắt đầu xử lý task này? Bạn sẽ tạo work log (mô tả công việc và ảnh trước khi sửa) để chuyển task sang trạng thái đang xử lý.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      setConfirmProcessOpen(false);
                      setCreateWorkLogModalOpen(true);
                    }}
                  >
                    Xử lý
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {taskId && (
              <CreateWorkLogModal
                open={createWorkLogModalOpen}
                onOpenChange={setCreateWorkLogModalOpen}
                taskId={taskId}
                onSuccess={() => {
                  handleSuccess();
                  setCreateWorkLogModalOpen(false);
                }}
              />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default MyTaskDetailModal;
