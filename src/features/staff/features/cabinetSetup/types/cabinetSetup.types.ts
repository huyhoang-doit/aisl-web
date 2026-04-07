export interface SetupCabinetRequest {
  locationId: string;
  cabinetId: string;
  macAddress: string;
  totalRows: number;
  totalColumns: number;
  heartbeatInterval?: number;
  openDoorTimeout?: number;
  operatorId: string;
  deviceAttachmentIds?: string[];
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
  macAddress: string;
  totalRows: number;
  totalColumns: number;
  connectionStatus: "ONLINE" | "OFFLINE";
  locationName: string;
  address: string;
  deviceAttachments: DeviceAttachment[];
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
