export interface CabinetSetupItem {
  cabinetId: string;
  slaveId?: number;
  totalRows: number;
  totalColumns: number;
}

export interface SetupCabinetRequest {
  locationId: string;
  macAddress: string;
  heartbeatInterval: number;
  openDoorTimeout: number;
  operatorId: string;
  deviceAttachmentIds?: string[];
  configurations: CabinetSetupItem[];
}

export const CABINET_STATUS = {
  PENDING_SETUP: "PENDING_SETUP",
  SETTING_UP: "SETTING_UP",
  ACTIVE: "ACTIVE",
  PARTIAL_ERROR: "PARTIAL_ERROR",
  OFFLINE: "OFFLINE",
  MAINTENANCE: "MAINTENANCE"
} as const;

export type CabinetStatus = typeof CABINET_STATUS[keyof typeof CABINET_STATUS];

export interface SlaveDetail {
  slaveId: number;
  availableSlots: number;
}

export interface DiscoveryResponse {
  statusCode: number;
  message: string;
  data: {
    macAddress: string;
    slaves: SlaveDetail[];
    timestamp: string;
  };
}

export interface DeviceAttachment {
  id: string;
  cabinetConfigId: string | null;
  name: string;
  serialNumber: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetDeviceAttachmentsResponse {
  statusCode: number;
  message: string;
  data: {
    deviceAttachments: DeviceAttachment[];
    pagination: {
      total: number;
      page: number;
      limit: number;
    };
  };
}

export interface SetupCabinetResponse {
  cabinetId: string;
  cabinetCode: string;
  mqttTopicPrefix: string;
  message: string;
  success: boolean;
  mqttBrokerHost: string;
  mqttBrokerPort: number;
}

export interface CabinetBasicInfo {
  id: string;
  name: string;
  code: string;
  macAddress: string;
  totalRows: number;
  totalColumns: number;
  status: CabinetStatus;
  connectionStatus: "ONLINE" | "OFFLINE";
  locationName: string;
  address: string;
  deviceAttachments: DeviceAttachment[];
}

export interface LockerBasicInfo {
  id: string;
  cabinetId: string;
  slotIndex: number;
  row: number;
  column: number;
  status: string;
  hwState: string;
  isActive: boolean;
}

export interface CabinetDetailResponse {
  statusCode: number;
  message: string;
  data: CabinetBasicInfo & { lockers: LockerBasicInfo[] };
}

export interface GetCabinetLockersResponse {
  statusCode: number;
  message: string;
  data: {
    cabinet: CabinetBasicInfo;
    lockers: LockerBasicInfo[];
    pagination: {
      total: number;
      page: number;
      limit: number;
    }
  }
}

export interface LocationWithCabinetsResponse {
  statusCode: number;
  message: string;
  data: {
    location: {
      id: string;
      name: string;
      address: string;
      latitude: number;
      longitude: number;
      plannedCabinetQuantity: number;
      plannedLockerQuantity: number;
      isActive: boolean;
    };
    cabinets: CabinetBasicInfo[];
    pagination: {
      total: number;
      page: number;
      limit: number;
    };
  };
}

export interface GetCabinetsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  orderBy?: string;
  orderDirection?: "ASC" | "DESC";
}
