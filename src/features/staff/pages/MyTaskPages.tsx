import { useState } from "react";
import { DataTable, type Column } from "@/shared/components/DataTable";
import { Badge } from "@/shared/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Eye } from "lucide-react";
import { useMyTask } from "@/features/staff/myTask/hooks/useMyTask";
import type { TaskDetail } from "@/features/staff/myTask/types/myTask.types";
import {
  TechnicalTaskStatus,
  TechnicalTaskPriority,
} from "@/features/staff/myTask/types/myTask.types";
import { MyTaskDetailModal } from "@/features/staff/myTask/modals/MyTaskDetailModal";

type TaskStatus = (typeof TechnicalTaskStatus)[keyof typeof TechnicalTaskStatus];

const TASK_TYPE_LABELS: Record<string, string> = {
  REPAIR: "Sửa chữa",
  INSPECTION: "Kiểm tra",
  SETUP: "Lắp đặt",
  MAINTENANCE: "Bảo trì",
};

const PRIORITY_LABELS: Record<string, string> = {
  [TechnicalTaskPriority.LOW]: "Thấp",
  [TechnicalTaskPriority.MEDIUM]: "Trung bình",
  [TechnicalTaskPriority.HIGH]: "Cao",
  [TechnicalTaskPriority.URGENT]: "Khẩn cấp",
};

const TASK_STATUS_TABS: TaskStatus[] = [
  TechnicalTaskStatus.OPEN,
  TechnicalTaskStatus.IN_PROGRESS,
  TechnicalTaskStatus.COMPLETED,
  TechnicalTaskStatus.VERIFIED,
];

const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  [TechnicalTaskStatus.OPEN]: "Mở",
  [TechnicalTaskStatus.IN_PROGRESS]: "Đang xử lý",
  [TechnicalTaskStatus.COMPLETED]: "Hoàn thành",
  [TechnicalTaskStatus.VERIFIED]: "Đã xác minh",
};

const TASK_TAB_COLOR_CLASS: Record<TaskStatus, string> = {
  [TechnicalTaskStatus.OPEN]:
    "data-[state=active]:bg-slate-100 data-[state=active]:text-slate-800 data-[state=active]:border-slate-300 border border-transparent border-border",
  [TechnicalTaskStatus.IN_PROGRESS]:
    "data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800 data-[state=active]:border-amber-300 border border-transparent border-border",
  [TechnicalTaskStatus.COMPLETED]:
    "data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800 data-[state=active]:border-emerald-300 border border-transparent border-border",
  [TechnicalTaskStatus.VERIFIED]:
    "data-[state=active]:bg-teal-100 data-[state=active]:text-teal-800 data-[state=active]:border-teal-300 border border-transparent border-border",
};

const TASK_STATUS_BADGE_CLASS: Record<string, string> = {
  [TechnicalTaskStatus.OPEN]: "bg-slate-100 text-slate-800 border-slate-300",
  [TechnicalTaskStatus.IN_PROGRESS]: "bg-amber-100 text-amber-800 border-amber-300",
  [TechnicalTaskStatus.COMPLETED]: "bg-emerald-100 text-emerald-800 border-emerald-300",
  [TechnicalTaskStatus.VERIFIED]: "bg-teal-100 text-teal-800 border-teal-300",
};

const TASK_EMPTY_MESSAGES: Record<TaskStatus, string> = {
  [TechnicalTaskStatus.OPEN]: "Chưa có task nào ở trạng thái mở",
  [TechnicalTaskStatus.IN_PROGRESS]: "Chưa có task nào đang xử lý",
  [TechnicalTaskStatus.COMPLETED]: "Chưa có task nào hoàn thành",
  [TechnicalTaskStatus.VERIFIED]: "Chưa có task nào đã xác minh",
};

const MyTaskPages = () => {
  const [taskStatusTab, setTaskStatusTab] = useState<TaskStatus>(TechnicalTaskStatus.OPEN);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const {
    tasks: taskList,
    total: taskTotal,
    isLoading: isTaskLoading,
    page: taskPage,
    pageSize: taskPageSize,
    setPage: setTaskPage,
    setPageSize: setTaskPageSize,
    refetch,
  } = useMyTask({
    defaultPageSize: 10,
    status: taskStatusTab,
  });

  const taskColumns: Column<TaskDetail>[] = [
    {
      key: "code",
      header: "Mã task",
      sortable: true,
      accessor: (row) => <div className="font-medium font-mono">{row.code ?? "-"}</div>,
    },
    {
      key: "incidentReport",
      header: "Báo cáo sự cố",
      sortable: true,
      accessor: (row) => (
        <div>
          <div className="font-medium">{row.incidentReport?.code ?? "-"}</div>
          <div className="text-sm text-muted-foreground">{row.incidentReport?.title ?? ""}</div>
        </div>
      ),
    },
    {
      key: "lockerCabinet",
      header: "Locker / Cabinet",
      sortable: true,
      accessor: (row) => (
        <div>
          <div className="font-medium">{row.incidentReport?.lockerLabel ?? "-"}</div>
          <div className="text-sm text-muted-foreground">{row.incidentReport?.cabinetName ?? ""}</div>
        </div>
      ),
    },
    {
      key: "taskType",
      header: "Loại task",
      sortable: true,
      accessor: (row) => (
        <Badge variant="secondary">{TASK_TYPE_LABELS[row.taskType] ?? row.taskType}</Badge>
      ),
    },
    {
      key: "priority",
      header: "Độ ưu tiên",
      sortable: true,
      accessor: (row) => {
        const variant: "secondary" | "default" | "destructive" =
          row.priority === "HIGH" || row.priority === "URGENT"
            ? "destructive"
            : row.priority === "MEDIUM"
              ? "default"
              : "secondary";
        return (
          <Badge variant={variant}>{PRIORITY_LABELS[row.priority] ?? row.priority}</Badge>
        );
      },
    },
    {
      key: "status",
      header: "Trạng thái",
      sortable: true,
      accessor: (row) => {
        const label = TASK_STATUS_LABELS[row.status as TaskStatus] ?? row.status ?? "-";
        const badgeClass = TASK_STATUS_BADGE_CLASS[row.status] ?? "bg-muted text-muted-foreground";
        return (
          <Badge variant="outline" className={badgeClass}>
            {label}
          </Badge>
        );
      },
    },
    {
      key: "createdAt",
      header: "Ngày tạo",
      sortable: true,
      accessor: (row) => (
        <div className="text-sm text-muted-foreground">
          {row.createdAt ? new Date(row.createdAt).toLocaleString("vi-VN") : "-"}
        </div>
      ),
    },
  ];

  const handleViewDetail = (task: TaskDetail) => {
    setSelectedTaskId(task.id);
    setIsDetailModalOpen(true);
  };

  const handleDetailModalClose = (open: boolean) => {
    setIsDetailModalOpen(open);
    if (!open) setSelectedTaskId(null);
  };

  const customActions = [
    {
      label: "Xem chi tiết",
      icon: <Eye className="h-4 w-4" />,
      onClick: handleViewDetail,
      variant: "ghost" as const,
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Task của tôi</h1>
        <p className="text-muted-foreground mt-2">
          Danh sách task được phân công cho bạn. Xem chi tiết để cập nhật trạng thái và work log.
        </p>
      </div>

      <Tabs
        value={taskStatusTab}
        onValueChange={(value) => {
          setTaskStatusTab(value as TaskStatus);
          setTaskPage(1);
        }}
        className="w-full"
      >
        <TabsList className="flex justify-start flex-wrap h-auto gap-1 p-1 bg-muted/50">
          {TASK_STATUS_TABS.map((status) => (
            <TabsTrigger key={status} value={status} className={TASK_TAB_COLOR_CLASS[status]}>
              {TASK_STATUS_LABELS[status]}
            </TabsTrigger>
          ))}
        </TabsList>

        {TASK_STATUS_TABS.map((tabValue) => (
          <TabsContent key={tabValue} value={tabValue} className="space-y-4 mt-4">
            <DataTable
              data={taskList}
              columns={taskColumns}
              keyExtractor={(row) => row.id}
              customActions={customActions}
              emptyMessage={TASK_EMPTY_MESSAGES[tabValue]}
              isLoading={isTaskLoading}
              onSort={() => setTaskPage(1)}
              pagination={{
                page: taskPage,
                pageSize: taskPageSize,
                total: taskTotal,
                onPageChange: setTaskPage,
                onPageSizeChange: setTaskPageSize,
                pageSizeOptions: [5, 10, 20, 50],
              }}
            />
          </TabsContent>
        ))}
      </Tabs>

      <MyTaskDetailModal
        open={isDetailModalOpen}
        onOpenChange={handleDetailModalClose}
        taskId={selectedTaskId}
        onSuccess={refetch}
      />
    </div>
  );
};

export default MyTaskPages;
