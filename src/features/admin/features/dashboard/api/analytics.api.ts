import { axiosInstance } from "@/shared/lib/api/axios-instance";
import type {
  DateRangeParams,
  LockerStats,
  OrderStats,
  RevenueStats,
  UserGrowthStats,
} from "../types/analytics";

export const analyticsApi = {
  getOrderStats: async (params?: DateRangeParams): Promise<OrderStats> => {
    return axiosInstance.get("/analytics/orders", { params });
  },

  getRevenueStats: async (params: DateRangeParams): Promise<{ statistics: RevenueStats }> => {
    const res = await axiosInstance.get("/analytics/revenue", { params });
    return res.data;
  },

  getUserGrowth: async (): Promise<{ statistics: UserGrowthStats }> => {
    const res = await axiosInstance.get("/analytics/users");
    return res.data;
  },

  getLockerStats: async (): Promise<{ statistics: LockerStats }> => {
    const res = await axiosInstance.get("/analytics/lockers");
    return res.data;
  },
};
