import { axiosInstance } from "@/shared/lib/api/axios-instance";
import type { CourierLocation, DispatchParams } from "../types/dispatch.types";

export const dispatchApi = {
  getNearestCouriers: async (params: DispatchParams): Promise<CourierLocation[]> => {
    // Backend API: GET /dispatch/couriers/nearest
    return axiosInstance.get("/dispatch/couriers/nearest", { params });
  }
};
