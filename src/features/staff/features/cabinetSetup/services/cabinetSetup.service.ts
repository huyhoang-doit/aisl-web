import { api } from "@/shared/lib/api/client";
import type { 
  SetupCabinetRequest, 
  SetupCabinetResponse, 
  LocationWithCabinetsResponse,
  GetCabinetsParams,
  GetDeviceAttachmentsResponse
} from "../types/cabinetSetup.types";

export const cabinetSetupService = {
  setupCabinet: async (data: SetupCabinetRequest): Promise<SetupCabinetResponse> => {
    return api.post<SetupCabinetResponse>("/cabinets/setup", data);
  },

  getCabinetsByLocation: async (locationId: string, params?: GetCabinetsParams): Promise<LocationWithCabinetsResponse> => {
    return api.get<LocationWithCabinetsResponse>(`/locations/${locationId}/cabinets`, { params });
  },

  getDeviceAttachments: async (params?: any): Promise<GetDeviceAttachmentsResponse> => {
    return api.get<GetDeviceAttachmentsResponse>(`/device-attachments`, { params });
  },
};
