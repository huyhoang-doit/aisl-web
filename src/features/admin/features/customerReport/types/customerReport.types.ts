/** Một nhân viên được phân công + task tương ứng (từ API detail report) */
export interface AssignedStaffItem {
  staffId: string;
  staffName: string;
  taskId: string;
  taskCode: string;
  taskType: string;
  taskStatus: string;
  priority: string;
  assignedAt: string;
}

export interface AssignmentSummary {
  totalTasks: number;
  openTasks: number;
  inProgressTasks: number;
  completedTasks: number;
}

/** API response structure từ GET /maintenance/reports */
export interface CustomerReportApi {
  id: string;
  code: string;
  cabinetId: string;
  cabinetName: string;
  lockerId: string;
  lockerLabel: string;
  title: string;
  description: string;
  status: string;
  reportedById?: string;
  createdAt?: string;
  updatedAt?: string;
  photoUrls?: string[];
}

export interface CustomerReport extends CustomerReportApi {
  /** Mã báo cáo (có thể từ API khác hoặc id rút gọn) */
  reportCode?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  lockerCode?: string;
  cabinetCode?: string;
  issueType?: "broken" | "stuck" | "cannot_open" | "other";
  issueDescription?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  assignedTo?: string;
  assignedToName?: string;
  assignedAt?: string;
  reportedAt?: string;
  completedAt?: string;
  images?: string[];
  /** Danh sách nhân viên đã được phân công (từ API detail khi đã assign) */
  assignedStaff?: AssignedStaffItem[];
  assignmentSummary?: AssignmentSummary;
}

export interface TechnicalStaffReport {
  id: string;
  reportId: string;
  reportCode: string;
  customerReport: CustomerReport;
  technicalStaffId: string;
  technicalStaffName: string;
  status: "pending_review" | "approved" | "rejected" | "in_progress" | "completed";
  maintenanceDescription?: string;
  maintenanceImages?: string[];
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewedByName?: string;
  reviewNote?: string;
  createdAt?: string;
  updatedAt?: string;
}
