import type { Pagination } from "@/shared/types/pagination.types";

/** Trạng thái task theo backend. Dùng typeof TechnicalTaskStatus[keyof typeof TechnicalTaskStatus] khi cần type. */
export const TechnicalTaskStatus = {
  OPEN: "OPEN",
  ASSIGNED: "ASSIGNED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  RESOLVED: "RESOLVED",
  CANCELLED: "CANCELLED",
  OVERDUE: "OVERDUE",
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
  locationId?: string;
  createdAt: string;
  updatedAt: string;
  incidentReport?: TaskDetailIncidentReport;
}

export interface TaskDetailResponse {
  data: TaskDetail;
}

/** Pagination từ API danh sách task */

/**Response GET /maintenance/tasks (danh sách) */
export interface TaskListResponse {
  data: {
    tasks: TaskDetail[];
    pagination: Pagination;
  };
}

/** Tech work log detail */
export interface TechWorkLog {
  id: string;
  code: string;
  technicalTaskId: string;
  technicianId: string;
  technicianName?: string;
  workDescription: string;
  partsReplaced?: string; // JSON string from backend
  beforePhotoUrls: string[];
  afterPhotoUrls: string[];
  startedAt?: string;
  completedAt?: string;
  techNote?: string;
  createdAt: string;
  updatedAt: string;
}

/** Response standard for work logs list */
export interface WorkLogListResponse {
  data: {
    workLogs: TechWorkLog[];
  };
}
