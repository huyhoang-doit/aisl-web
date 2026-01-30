export interface Cabinet {
  id: string;
  locationId: string;
  name: string;
  macAddress: string;
  ipAddress: string;
  firmwareVersion: string;
  totalRows: number;
  totalColumns: number;
  createdAt?: string;
  updatedAt?: string;
}
