export interface Plan {
  id: string;
  name: string;
  code: string;
  description?: string;
  price: number;
  duration: number; // Số ngày
  durationUnit: "day" | "month" | "year"; // Đơn vị thời gian
  features: string[]; // Danh sách tính năng
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

