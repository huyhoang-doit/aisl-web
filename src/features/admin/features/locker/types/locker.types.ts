export interface Locker {
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
  