/** API response structure từ GET /maintenance/reports */
export interface CustomerReportApi {
  id: string;
  cabinetId: string;
  lockerId: string;
  title: string;
  description: string;
  status: string;
  reportedById?: string;
  createdAt?: string;
  updatedAt?: string;
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
