export const StaffApplicationStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type StaffApplicationStatusValue =
  (typeof StaffApplicationStatus)[keyof typeof StaffApplicationStatus];

export interface StaffApplication {
  id: string;
  userId?: string;
  legalName?: string;
  licensePlate?: string;
  vehicleTypeId?: string;
  role?: string;
  status?: StaffApplicationStatusValue | string | Record<string, unknown>;
  reviewNote?: string;
  reviewedById?: string;
  reviewedAt?: string;
  frontVehicleImageUrl?: string;
  backVehicleImageUrl?: string;
  portraitUrl?: string;
  files?: string[] | Array<{ url?: string; path?: string; name?: string }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface StaffReviewPayload {
  reviewNote?: string;
}

export const getStaffApplicationStatus = (
  status?: StaffApplication["status"]
): StaffApplicationStatusValue => {
  if (!status) return StaffApplicationStatus.PENDING;
  if (typeof status === "string") {
    if (
      status === StaffApplicationStatus.PENDING ||
      status === StaffApplicationStatus.APPROVED ||
      status === StaffApplicationStatus.REJECTED
    ) {
      return status;
    }
    return StaffApplicationStatus.PENDING;
  }

  const value =
    (status as Record<string, unknown>)?.value ??
    (status as Record<string, unknown>)?.code;
  if (value === StaffApplicationStatus.APPROVED) {
    return StaffApplicationStatus.APPROVED;
  }
  if (value === StaffApplicationStatus.REJECTED) {
    return StaffApplicationStatus.REJECTED;
  }
  return StaffApplicationStatus.PENDING;
};
