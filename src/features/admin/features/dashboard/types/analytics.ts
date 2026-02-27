export interface OrderStats {
  totalOrders: number;
  deliveryOrders: number;
  rentalOrders: number;
}

export interface RevenueStats {
  totalRevenue: number;
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
}

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

export interface YearParams {
  year: number;
}
