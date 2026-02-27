export interface HardwareMonitorStats {
  cabinetId: string;
  name: string;
  connectionStatus: "ONLINE" | "OFFLINE";
  lastHeartbeatAt: string;
  totalLockers: number;
  onlineLockers: number;
  offlineLockers: number;
  inUseLockers: number;
}

export interface HardwareMonitorQueryParams {
  page?: number;
  limit?: number;
  locationId?: string;
  status?: "ONLINE" | "OFFLINE";
}

export interface PaginatedHardwareMonitor {
  items: HardwareMonitorStats[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
