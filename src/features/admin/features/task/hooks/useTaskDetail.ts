/**
 * Hook lấy chi tiết task theo ID (dùng cho TaskDetailModal)
 */
import { useEffect, useState, useCallback } from "react";
import type { TaskDetail } from "../types/task.types";
import { taskService } from "../services/task.service";

export interface UseTaskDetailOptions {
  taskId: string | null;
  open: boolean;
}

export interface UseTaskDetailReturn {
  task: TaskDetail | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTaskDetail({ taskId, open }: UseTaskDetailOptions): UseTaskDetailReturn {
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTask = useCallback(async () => {
    if (!taskId) {
      setTask(null);
      setError(null);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    try {
      const res = await taskService.getById(taskId);
      if (!cancelled) {
        setTask(res.data ?? null);
        if (!res.data) setError("Không thể tải chi tiết task");
      }
    } catch (err) {
      if (!cancelled) {
        setTask(null);
        setError((err as Error)?.message ?? "Có lỗi khi tải chi tiết task");
      }
    } finally {
      if (!cancelled) setIsLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    if (!open || !taskId) {
      setTask(null);
      setError(null);
      return;
    }
    fetchTask();
  }, [open, taskId, fetchTask]);

  const refetch = useCallback(() => {
    if (taskId) fetchTask();
  }, [taskId, fetchTask]);

  return { task, isLoading, error, refetch };
}
