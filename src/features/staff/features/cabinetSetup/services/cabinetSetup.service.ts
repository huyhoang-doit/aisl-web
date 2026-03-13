import { api } from "@/shared/lib/api/client";
import type { 
  SetupCabinetRequest, 
  SetupCabinetResponse, 
  LocationWithCabinetsResponse,
  GetCabinetsParams
} from "../types/cabinetSetup.types";

export const cabinetSetupService = {
  setupCabinet: async (data: SetupCabinetRequest): Promise<SetupCabinetResponse> => {
    return api.post<SetupCabinetResponse>("/cabinets/setup", data);
  },

  getCabinetsByLocation: async (locationId: string, params?: GetCabinetsParams): Promise<LocationWithCabinetsResponse> => {
    return api.get<LocationWithCabinetsResponse>(`/locations/${locationId}/cabinets`, { params });
  },
};
