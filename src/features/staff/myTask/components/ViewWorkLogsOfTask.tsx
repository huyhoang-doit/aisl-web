import { useCallback, useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { workLogService } from "../services/workLog.service";
import type { WorkLogDetail } from "../types/myTask.types";
import { WorkLogCard } from "./WorkLogCard";
import { CreateWorkLogModal } from "../modals/CreateWorkLogModal";

export interface ViewWorkLogsOfTaskProps {
  taskId: string;
  onSuccess?: () => void;
}

export function ViewWorkLogsOfTask({ taskId, onSuccess }: ViewWorkLogsOfTaskProps) {
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
      setWorkLogs(Array.isArray(list) ? list : []);
    } catch {
      setWorkLogs([]);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

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
        {/* <Button variant="outline" size="sm" onClick={() => setCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Tạo work log
        </Button> */}
      </div>

      {workLogs.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">Chưa có work log nào.</p>
      ) : (
        <div className="space-y-3">
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
