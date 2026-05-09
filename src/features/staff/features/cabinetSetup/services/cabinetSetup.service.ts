
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
import { api } from "@/shared/lib/api/client";  

export const cabinetSetupService = {
  setupCabinet: async (data: SetupCabinetRequest): Promise<SetupCabinetResponse> => {
    const response = await api.post<any>("/cabinets/setup", data);
    return response.data;
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

  resetSetup: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<any>(`/cabinets/${id}/reset-setup`);
    return response.data;
  },

  checkActiveSetup: async (): Promise<any> => {
    return api.get<any>("/maintenance/tasks/check-active-setup");
  },
};
