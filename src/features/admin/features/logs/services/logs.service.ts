import { api } from "@/shared/lib/api/client";
import type {
  ActivityLog,
  DeviceLog,
} from "../types/logs.types";
import type { Pagination } from "@/shared/types/pagination.types";

export interface ActivityLogsParams {
  userId?: string;
  action?: string;
  resource?: string;
  resourceId?: string;
  service?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: "ASC" | "DESC";
}

export interface ActivityLogsResponse {
  statusCode?: number;
  message?: string;
  data: {
    items: ActivityLog[];
    pagination: Pagination;
  };
}

export interface DeviceLogsParams {
  cabinetId?: string;
  lockerId?: string;
  eventType?: string;
  direction?: "INBOUND" | "OUTBOUND";
  service?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: "ASC" | "DESC";
}

export interface DeviceLogsResponse {
  statusCode?: number;
  message?: string;
  data: {
    items: DeviceLog[];
    pagination: Pagination;
  };
}

export const logsService = {
  getActivityLogs: async (params?: ActivityLogsParams): Promise<ActivityLogsResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.userId) searchParams.set("userId", params.userId);
    if (params?.action) searchParams.set("action", params.action);
    if (params?.resource) searchParams.set("resource", params.resource);
    if (params?.resourceId) searchParams.set("resourceId", params.resourceId);
    if (params?.service) searchParams.set("service", params.service);
    if (params?.fromDate) searchParams.set("fromDate", params.fromDate);
    if (params?.toDate) searchParams.set("toDate", params.toDate);
    if (params?.page != null) searchParams.set("page", String(params.page));
    if (params?.limit != null) searchParams.set("limit", String(params.limit));
    if (params?.orderBy) searchParams.set("orderBy", params.orderBy);
    if (params?.orderDirection) {
      searchParams.set("orderDirection", params.orderDirection);
    }

    const query = searchParams.toString();
    const url = query ? `/logs/activity?${query}` : "/logs/activity";
    return api.get<ActivityLogsResponse>(url);
  },

  getDeviceLogs: async (params?: DeviceLogsParams): Promise<DeviceLogsResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.cabinetId) searchParams.set("cabinetId", params.cabinetId);
    if (params?.lockerId) searchParams.set("lockerId", params.lockerId);
    if (params?.eventType) searchParams.set("eventType", params.eventType);
    if (params?.direction) searchParams.set("direction", params.direction);
    if (params?.service) searchParams.set("service", params.service);
    if (params?.fromDate) searchParams.set("fromDate", params.fromDate);
    if (params?.toDate) searchParams.set("toDate", params.toDate);
    if (params?.page != null) searchParams.set("page", String(params.page));
    if (params?.limit != null) searchParams.set("limit", String(params.limit));
    if (params?.orderBy) searchParams.set("orderBy", params.orderBy);
    if (params?.orderDirection) {
      searchParams.set("orderDirection", params.orderDirection);
    }

    const query = searchParams.toString();
    const url = query ? `/logs/device?${query}` : "/logs/device";
    return api.get<DeviceLogsResponse>(url);
  },
};
