export interface LockerArea {
  id: string;
  cabinetId: string;
  code: string;
  size: "small" | "medium" | "large";
  status: "available" | "occupied" | "maintenance" | "reserved";
  price?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Transaction {
  id: string;
  lockerId: string;
  userId: string;
  userName: string;
  type: "rent" | "extend" | "cancel" | "refund";
  amount: number;
  status: "pending" | "completed" | "failed" | "cancelled";
  createdAt: string;
  description?: string;
}

export interface Review {
  id: string;
  lockerId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: string;
}
