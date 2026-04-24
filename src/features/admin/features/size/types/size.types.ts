export interface SizeLockerDetail {
  id: string;
  lockerLabel: string;
  cabinetName: string;
  locationName: string;
}

export interface Size {
  id: string;
  name: string;
  width?: number; // cm
  height?: number; // cm
  depth?: number; // cm
  createdAt?: string;
  updatedAt?: string;
  lockers?: SizeLockerDetail[];
}
