import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { workLogService } from "../services/workLog.service";
import type { TechnicalTaskStatusType, WorkLogDetail } from "../types/myTask.types";
import { WorkLogCard } from "./WorkLogCard";
import { CreateWorkLogModal } from "../modals/CreateWorkLogModal";
import { TechnicalTaskStatus } from "@/features/admin/features/task/types/task.types";
import { Button } from "@/shared/components/ui/button";

export interface ViewWorkLogsOfTaskProps {
  taskId: string;
  onSuccess?: () => void;
  taskStatus: TechnicalTaskStatusType;
  // eslint-disable-next-line no-unused-vars -- type-only callback param
  onWorkLogsStateChange?: (_payload: { hasWorkLogs: boolean; allCompleted: boolean }) => void;
}

export function ViewWorkLogsOfTask({
  taskId,
  onSuccess,
  taskStatus,
  onWorkLogsStateChange,
}: ViewWorkLogsOfTaskProps) {
  const [workLogs, setWorkLogs] = useState<WorkLogDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updatingWorkLogId, setUpdatingWorkLogId] = useState<string | null>(null);
  const [completeWorkLogId, setCompleteWorkLogId] = useState<string | null>(null);

  const loadWorkLogs = useCallback(async () => {
    if (!taskId) return;
    try {
      setLoading(true);
      const list = await workLogService.getByTaskId(taskId);
      const normalized = Array.isArray(list) ? list : [];
      setWorkLogs(normalized);
      onWorkLogsStateChange?.({
        hasWorkLogs: normalized.length > 0,
        allCompleted: normalized.length > 0 && normalized.every((log) => !!log.completedAt),
      });
    } catch {
      setWorkLogs([]);
      onWorkLogsStateChange?.({ hasWorkLogs: false, allCompleted: false });
    } finally {
      setLoading(false);
    }
  }, [taskId, onWorkLogsStateChange]);

  useEffect(() => {
    loadWorkLogs();
  }, [loadWorkLogs]);

  const handleSuccess = () => {
    loadWorkLogs();
    onSuccess?.();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Work logs
        </h3>
        {taskStatus === TechnicalTaskStatus.IN_PROGRESS && (
          <Button variant="outline" size="sm" onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Tạo work log
          </Button>
        )}
      </div>

      {workLogs.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">Chưa có work log nào.</p>
      ) : (
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {workLogs.map((log) => (
            <WorkLogCard
              key={log.id}
              log={log}
              onSuccess={handleSuccess}
              updatingWorkLogId={updatingWorkLogId}
              completeWorkLogId={completeWorkLogId}
              setUpdatingWorkLogId={setUpdatingWorkLogId}
              setCompleteWorkLogId={setCompleteWorkLogId}
            />
          ))}
        </div>
      )}

      <CreateWorkLogModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        taskId={taskId}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

export default ViewWorkLogsOfTask;
