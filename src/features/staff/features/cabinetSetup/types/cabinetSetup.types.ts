export interface SetupCabinetRequest {
  locationId: string;
  macAddress: string;
  totalRows: number;
  totalColumns: number;
  mqttBrokerHost: string;
  mqttBrokerPort: number;
  mqttUsername?: string;
  mqttPassword?: string;
  heartbeatInterval?: number;
  openDoorTimeout?: number;
  operatorId: string;
}

export interface SetupCabinetResponse {
  cabinetId: string;
  cabinetCode: string;
  mqttTopicPrefix: string;
  message: string;
  success: boolean;
}
