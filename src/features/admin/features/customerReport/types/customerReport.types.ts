export interface CustomerReport {
  id: string;
  reportCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  lockerCode: string;
  lockerId: string;
  cabinetCode?: string;
  cabinetId?: string;
  issueType: "broken" | "stuck" | "cannot_open" | "other";
  issueDescription: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "assigned" | "in_progress" | "completed" | "rejected";
  assignedTo?: string; // Technical staff ID
  assignedToName?: string; // Technical staff name
  assignedAt?: string;
  reportedAt: string;
  completedAt?: string;
  images?: string[]; // URLs of attached images
  createdAt?: string;
  updatedAt?: string;
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
