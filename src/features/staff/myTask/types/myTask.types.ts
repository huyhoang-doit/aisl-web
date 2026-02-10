import type { Pagination } from "@/shared/types/pagination.types";

/** Trạng thái task (backend): OPEN → IN_PROGRESS → COMPLETED → VERIFIED */
export const TechnicalTaskStatus = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  VERIFIED: "VERIFIED",
} as const;

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
  assignedById: string;
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

export interface TaskListResponse {
  data: {
    tasks: TaskDetail[];
    pagination: Pagination;
  };
}

/** Work log (GET /maintenance/work-logs/:id, response từ create/update/complete) */
export interface WorkLogDetail {
  id: string;
  technicalTaskId: string;
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
