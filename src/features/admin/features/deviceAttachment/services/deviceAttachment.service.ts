/**
 * Device Attachment Service
 * API: GET/POST /device-attachments, GET/PUT/DELETE /device-attachments/{id}
 */
import { api } from "@/shared/lib/api/client";
import type { DeviceAttachment } from "../types/deviceAttachment.types";
import type { Pagination } from "@/shared/types/pagination.types";

export interface CreateDeviceAttachmentPayload {
  cabinetId: string;
  cabinetConfigId: string;
  name: string;
  serialNumber: string;
  description?: string;
  isActive: boolean;
}

export interface UpdateDeviceAttachmentPayload {
  cabinetId?: string;
  cabinetConfigId?: string;
  name?: string;
  serialNumber?: string;
  description?: string;
  isActive?: boolean;
}

export interface DeviceAttachmentResponse {
  data: DeviceAttachment;
}

export interface DeviceAttachmentListResponse {
  data: {
    deviceAttachments?: DeviceAttachment[];
    items?: DeviceAttachment[];
    content?: DeviceAttachment[];
    data?: DeviceAttachment[];
    pagination: Pagination;
  };
}

export interface DeviceAttachmentListParams {
  page?: number;
  limit?: number;
  size?: number;
  cabinetId?: string;
  cabinetConfigId?: string;
  isActive?: boolean;
  search?: string;
}

export const deviceAttachmentService = {
  /**
   * Get all device attachments with pagination and filters
   */
  getAll: async (
    params?: DeviceAttachmentListParams
  ): Promise<DeviceAttachmentListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set("page", String(params.page));
    if (params?.limit != null) searchParams.set("limit", String(params.limit));
    if (params?.size != null) searchParams.set("size", String(params.size));
    if (params?.cabinetId)
      searchParams.set("cabinetId", params.cabinetId);
    if (params?.cabinetConfigId)
      searchParams.set("cabinetConfigId", params.cabinetConfigId);
    if (params?.isActive !== undefined)
      searchParams.set("isActive", String(params.isActive));
    if (params?.search) searchParams.set("search", params.search);

    const query = searchParams.toString();
    const url = query
      ? `/device-attachments?${query}`
      : "/device-attachments";
    const res = await api.get<DeviceAttachmentListResponse>(url);
    return res;
  },

  /**
   * Get device attachment details by ID
   */
  getById: async (id: string): Promise<DeviceAttachmentResponse> => {
    return api.get<DeviceAttachmentResponse>(`/device-attachments/${id}`);
  },

  getDetail: async (id: string): Promise<DeviceAttachmentResponse> => {
    return api.get<DeviceAttachmentResponse>(`/device-attachments/${id}`);
  },

  /**
   * Create a new device attachment
   */
  create: async (
    data: CreateDeviceAttachmentPayload
  ): Promise<DeviceAttachmentResponse> => {
    return api.post<DeviceAttachmentResponse>("/device-attachments", data);
  },

  /**
   * Update a device attachment
   */
  update: async (
    id: string,
    data: UpdateDeviceAttachmentPayload
  ): Promise<DeviceAttachmentResponse> => {
    return api.put<DeviceAttachmentResponse>(`/device-attachments/${id}`, data);
  },

  /**
   * Delete a device attachment
   */
  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/device-attachments/${id}`);
  },
};
