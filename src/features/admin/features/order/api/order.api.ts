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
    const res = await axiosInstance.get("/orders", { params });
    return res.data;
  },
  getOrderDetails: async (id: string): Promise<any> => {
    const res = await axiosInstance.get(`/orders/${id}`);
    return res.data;
  },
  forceCancelOrder: async (orderId: string): Promise<any> => {
    const res = await axiosInstance.post(`/orders/${orderId}/force-cancel`);
    return res.data;
  },
  forceCompleteOrder: async (orderId: string): Promise<any> => {
    const res = await axiosInstance.post(`/orders/${orderId}/force-complete`);
    return res.data;
  },
};
