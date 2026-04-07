export interface ActivityLog {
  _id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  service: string;
  ipAddress: string;
  createdAt: string;
}

export interface DeviceLog {
  _id: string;
  deviceId: string;
  deviceName: string;
  cabinetId: string;
  lockerId: string;
  eventType: string;
  direction: string;
  level: string;
  message: string;
  detail?: string;
  service: string;
  createdAt: string;
}
