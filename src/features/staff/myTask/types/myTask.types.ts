import type { Pagination } from "@/shared/types/pagination.types";

/** Trạng thái task theo backend */
export const TechnicalTaskStatus = {
  OPEN: "OPEN",
  ASSIGNED: "ASSIGNED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  RESOLVED: "RESOLVED",
  CANCELLED: "CANCELLED",
  OVERDUE: "OVERDUE",
} as const;

export type TechnicalTaskStatusType = (typeof TechnicalTaskStatus)[keyof typeof TechnicalTaskStatus];

export const TechnicalTaskPriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
} as const;

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
  status: TechnicalTaskStatusType;
  createdAt: string;
  updatedAt: string;
  incidentReport?: TaskDetailIncidentReport;
}

export interface TaskDetailResponse {
  data: TaskDetail;
}

export interface TaskListResponse {
  data: {
    tasks: TaskDetail[];
    pagination: Pagination;
  };
}

/** Work log (GET /maintenance/work-logs/:id, GET by taskId trả data.workLogs) */
export interface WorkLogDetail {
  id: string;
  code?: string;
  technicalTaskId: string;
  technicianId?: string;
  workDescription?: string;
  beforePhotoUrls?: string[];
  afterPhotoUrls?: string[];
  partsReplaced?: string;
  techNote?: string;
  startedAt: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkLogDetailResponse {
  data: WorkLogDetail;
}
