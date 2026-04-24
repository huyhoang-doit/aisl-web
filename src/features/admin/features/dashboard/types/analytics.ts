export interface OrderStats {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  deliveryOrders: number;
  rentalOrders: number;
}

export interface RevenueStats {
  totalRevenue: number;
  rentalRevenue: number;
  deliveryRevenue: number;
  revenueByDay: Record<string, number>;
}

export interface UserGrowthStats {
  totalUsers: number;
  newUsersByMonth: Record<string, number>;
}

export interface LockerStats {
  totalLockers: number;
  occupiedLockers: number;
  availableLockers: number;
  offlineLockers: number;
  utilizationRate: number;
  totalLocations: number;
  totalCabinets: number;
  activeLocations: number;
  inactiveLocations: number;
  activeCabinets: number;
  inactiveCabinets: number;
  locationStats: LocationInfrastructureStats[];
}

export interface LocationInfrastructureStats {
  locationId: string;
  locationName: string;
  totalCabinets: number;
  totalLockers: number;
  occupiedLockers: number;
  availableLockers: number;
  offlineLockers: number;
  cabinetStats: CabinetInfrastructureStats[];
  isActive: boolean;
}

export interface LockerInfrastructureStats {
  lockerId: string;
  lockerLabel: string;
  currentStatus: string;
  hwState: string;
}

export interface CabinetInfrastructureStats {
  cabinetId: string;
  cabinetName: string;
  totalLockers: number;
  occupiedLockers: number;
  availableLockers: number;
  offlineLockers: number;
  status: string;
  lockerStats: LockerInfrastructureStats[];
}

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

export interface YearParams {
  year: number;
}
