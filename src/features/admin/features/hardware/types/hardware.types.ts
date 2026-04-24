export interface HardwareMonitorStats {
  cabinetId: string;
  name: string;
  locationName: string;
  isOnline: boolean;
  lastHeartbeat: string;
  totalLockers: number;
  onlineLockers: number;
  offlineLockers: number;
  openDoors: number;
}

export interface HardwareMonitorQueryParams {
  page?: number;
  limit?: number;
  locationId?: string;
  status?: "ONLINE" | "OFFLINE";
}

export interface PaginatedHardwareMonitor {
  statuses: HardwareMonitorStats[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}
