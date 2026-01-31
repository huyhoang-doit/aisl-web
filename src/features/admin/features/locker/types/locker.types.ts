export type LockerStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';

export interface LockerSize {
  id: string;
  name: string;
  width?: number;
  height?: number;
  depth?: number;
}

export interface Locker {
  id: string;
  cabinetId: string;
  sizeId: string;
  size?: LockerSize;
  row: number;
  column: number;
  code?: string;
  status: LockerStatus;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
