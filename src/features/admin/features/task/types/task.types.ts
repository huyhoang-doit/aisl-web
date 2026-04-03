import type { Pagination } from "@/shared/types/pagination.types";

/** Trạng thái task (backend): OPEN → IN_PROGRESS → COMPLETED → VERIFIED. Dùng typeof TechnicalTaskStatus[keyof typeof TechnicalTaskStatus] khi cần type. */
export const TechnicalTaskStatus = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  VERIFIED: "VERIFIED",
} as const;

/** Độ ưu tiên task (backend). */
export const TechnicalTaskPriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
} as const;

/** Loại task (backend). */
export const TechnicalTaskType = {
  REPAIR: "REPAIR",
  SETUP: "SETUP",
  MAINTENANCE: "MAINTENANCE",
  INSPECTION: "INSPECTION",
} as const;

/** Incident report nested trong task detail */
export interface TaskDetailIncidentReport {
  id: string;
  code: string;
  reportedById: string;
  reporterName?: string;
  lockerId: string;
  lockerLabel: string;
  cabinetId: string;
  cabinetName: string;
  title: string;
  description: string;
  photoUrls?: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

/** Chi tiết task (response GET /maintenance/tasks/:id) */
export interface TaskDetail {
  id: string;
  code: string;
  incidentReportId: string;
  assignedToId: string;
  assignedToName?: string;
  assignedById: string;
  assignedByName?: string;
  taskType: "REPAIR" | "INSPECTION" | "CLEANING" | string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | string;
  status: string;
  createdAt: string;
  updatedAt: string;
  incidentReport?: TaskDetailIncidentReport;
}

export interface TaskDetailResponse {
  data: TaskDetail;
}

/** Pagination từ API danh sách task */

/** Response GET /maintenance/tasks (danh sách) */
export interface TaskListResponse {
  data: {
    tasks: TaskDetail[];
    pagination: Pagination;
  };
}
