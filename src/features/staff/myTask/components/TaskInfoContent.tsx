import { Separator } from "@/shared/components/ui/separator";
import { Calendar, Package, FileText, ClipboardList } from "lucide-react";
import type { TaskDetail } from "../types/myTask.types";

const TASK_TYPE_LABELS: Record<string, string> = {
  REPAIR: "Sửa chữa",
  INSPECTION: "Kiểm tra",
  SETUP: "Lắp đặt",
  MAINTENANCE: "Bảo trì",
};

export interface TaskInfoContentProps {
  task: TaskDetail;
}

export function TaskInfoContent({ task }: TaskInfoContentProps) {
  return (
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
            <div className="text-xs text-muted-foreground font-mono">{task.assignedToId ?? "-"}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium">Người giao việc</div>
            <div className="text-sm text-muted-foreground">{task.assignedByName ?? "-"}</div>
            <div className="text-xs text-muted-foreground font-mono">{task.assignedById ?? "-"}</div>
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
                <div className="text-xs text-muted-foreground font-mono">
                  {task.incidentReport.reportedById ?? "-"}
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
  );
}

export default TaskInfoContent;
