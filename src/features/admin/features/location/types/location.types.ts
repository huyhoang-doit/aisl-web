export interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description?: string;
  isActive: boolean;
  plannedCabinetQuantity: number;
  plannedLockerQuantity: number;
  createdAt?: string;
  updatedAt?: string;
}