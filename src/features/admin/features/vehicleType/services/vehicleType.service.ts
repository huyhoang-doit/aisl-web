/**
 * Vehicle Type Service
 * Service layer cho loại phương tiện (vehicle type) API
 * Payload tạo: { name, isActive }
 * Response: { id, name, isActive, createdAt, updatedAt }
 */
import { api } from "@/shared/lib/api/client";
import type { VehicleType } from "../types/vehicleType.types";
import type { Pagination } from "@/shared/types/pagination.types";

export interface CreateVehicleTypePayload {
  name: string;
  isActive: boolean;
}

export interface UpdateVehicleTypePayload {
  name?: string;
  isActive?: boolean;
}

export interface VehicleTypeResponse {
  data: VehicleType;
}

export interface VehicleTypeListResponse {
  data: VehicleType[] | { vehicleTypes?: VehicleType[]; items?: VehicleType[]; pagination?: Pagination };
}

export interface VehicleTypeListParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export const vehicleTypeService = {
  /**
   * Lấy danh sách loại phương tiện
   */
  getAll: async (params?: VehicleTypeListParams): Promise<{ data: VehicleType[]; pagination?: Pagination }> => {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set("page", String(params.page));
    if (params?.limit != null) searchParams.set("limit", String(params.limit));
    if (params?.search) searchParams.set("search", params.search);
    if (params?.isActive !== undefined) searchParams.set("isActive", String(params.isActive));

    const query = searchParams.toString();
    const url = query ? `/vehicle-types?${query}` : "/vehicle-types";
    const response = await api.get<VehicleTypeListResponse>(url) as unknown as { data?: VehicleType[] | { vehicleTypes?: VehicleType[]; items?: VehicleType[]; pagination?: Pagination } };
    const raw = response.data;
    if (Array.isArray(raw)) {
      return { data: raw };
    }
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      const list = (raw as { vehicleTypes?: VehicleType[] }).vehicleTypes
        ?? (raw as { items?: VehicleType[] }).items
        ?? [];
      const pagination = (raw as { pagination?: Pagination }).pagination;
      return { data: list, pagination };
    }
    return { data: [] };
  },

  /**
   * Lấy chi tiết loại phương tiện theo id
   */
  getById: async (id: string): Promise<VehicleTypeResponse> => {
    return api.get<VehicleTypeResponse>(`/vehicle-types/${id}`);
  },

  getDetail: async (id: string): Promise<VehicleTypeResponse> => {
    return api.get<VehicleTypeResponse>(`/vehicle-types/${id}`);
  },

  /**
   * Tạo loại phương tiện mới
   */
  create: async (data: CreateVehicleTypePayload): Promise<VehicleTypeResponse> => {
    return api.post<VehicleTypeResponse>("/vehicle-types", data);
  },

  /**
   * Cập nhật loại phương tiện
   */
  update: async (id: string, data: UpdateVehicleTypePayload): Promise<VehicleTypeResponse> => {
    return api.put<VehicleTypeResponse>(`/vehicle-types/${id}`, data);
  },

  /**
   * Xóa loại phương tiện
   */
  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/vehicle-types/${id}`);
  },
};
