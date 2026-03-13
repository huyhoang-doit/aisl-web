/** Loại phương tiện */
export const VehicleType = {
  BIKE: "BIKE",
  MOTORBIKE: "MOTORBIKE",
  CAR: "CAR",
} as const;

export type VehicleTypeValue = (typeof VehicleType)[keyof typeof VehicleType];

/** Trạng thái đơn đăng ký người chuyển phát (3 trạng thái) */
export const CourierStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type CourierStatusValue = (typeof CourierStatus)[keyof typeof CourierStatus];

/** Đơn đăng ký người chuyển phát – response từ API get all / get by id */
export interface CourierApplication {
  id: string;
  userId: string;
  legalName: string;
  licensePlate: string;
  vehicleType: VehicleTypeValue;
  frontVehicleImageUrl: string;
  backVehicleImageUrl: string;
  portraitUrl: string;
  status: CourierStatusValue;
  reviewedById: string;
  reviewNote: string;
  reviewedAt: string;
  rejectionCount: number;
  createdAt: string;
  updatedAt: string;
}

/** Payload approve / reject (PUT) */
export interface CourierReviewPayload {
  reviewNote: string;
}

/** Legacy type alias – giữ tương thích nếu có chỗ còn dùng */
export interface CourierRequest {
  id?: string
  name: string
  email: string
  phone: string
  address?: string
  status: "NONE" | "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED" | "BLACKLISTED"
  requestDate?: string
  reviewedDate?: string
  reviewedBy?: string
  rejectionReason?: string
  documents?: string[]
  createdAt?: string
  updatedAt?: string
}
