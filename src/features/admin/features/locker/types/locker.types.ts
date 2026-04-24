export type LockerStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED' | 'LOCKED_BY_BALANCE' | 'INITIALIZING' | 'FAULT';

export type HwState = 'OPENING' | 'CLOSING'  | 'OFFLINE' |  string;

export interface LockerSizeType {
  id: string;
  name: string;
  width?: number;
  height?: number;
  depth?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Locker {
  id: string;
  cabinetId: string;
  sizeTypeId: string;
  sizeType?: LockerSizeType;
  row: number;
  column: number;
  lockerLabel?: string;
  status: LockerStatus;
  hwState?: HwState;
  isActive: boolean;
  totalUsageTime?: number;
  cabinetName?: string;
  locationName?: string;
  createdAt?: string;
  updatedAt?: string;
}
