import { axiosInstance } from "@/shared/lib/api/axios-instance";

export const orderAdminApi = {
  getOrders: async (params: {
    page?: number;
    limit?: number;
    status?: string;
    userId?: string;
    orderCode?: string;
    orderType?: string;
  }): Promise<any> => {
    return axiosInstance.get("/orders", { params });
  },
  getOrderDetails: async (id: string): Promise<any> => {
    return axiosInstance.get(`/orders/${id}`);
  },
  forceCancelOrder: async (orderId: string): Promise<any> => {
    return axiosInstance.post(`/orders/${orderId}/force-cancel`);
  },
  forceCompleteOrder: async (orderId: string): Promise<any> => {
    return axiosInstance.post(`/orders/${orderId}/force-complete`);
  },
};
