/** Incident report nested trong task detail */
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

/** Chi tiết task (response GET /maintenance/tasks/:id) */
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
