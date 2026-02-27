export interface CourierLocation {
  courierId: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  lastUpdatedAt: string; // ISO string
  status: "ONLINE" | "BUSY";
  name?: string;
  phone?: string;
}

export interface DispatchParams {
  latitude: number;
  longitude: number;
  maxDistanceKm?: number;
  limit?: number;
}
