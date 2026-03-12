import { axiosInstance } from "@/shared/lib/api/axios-instance";
import type {
  HardwareMonitorQueryParams,
  PaginatedHardwareMonitor,
} from "../types/hardware.types";

export const hardwareApi = {
  getMonitorStatus: async (
    params?: HardwareMonitorQueryParams
  ): Promise<PaginatedHardwareMonitor> => {
    return axiosInstance.get("/cabinets/monitor/status", { params });
  },
};
