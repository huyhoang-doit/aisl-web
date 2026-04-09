import { api } from "@/shared/lib/api/client";
import type { 
  SetupCabinetRequest, 
  SetupCabinetResponse, 
  LocationWithCabinetsResponse,
  GetCabinetsParams,
  GetDeviceAttachmentsResponse,
  DiscoveryResponse,
  CabinetBasicInfo,
  GetCabinetLockersResponse
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

  discoverCabinets: async (macAddress: string): Promise<DiscoveryResponse> => {
    return api.get<DiscoveryResponse>(`/cabinets/discovery/${macAddress}`);
  },

  getCabinet: async (id: string): Promise<{ data: CabinetBasicInfo }> => {
    return api.get<{ data: CabinetBasicInfo }>(`/cabinets/${id}`);
  },

  getCabinetLockers: async (id: string, params?: any): Promise<GetCabinetLockersResponse> => {
    return api.get<GetCabinetLockersResponse>(`/cabinets/${id}/lockers`, { params });
  },
};
