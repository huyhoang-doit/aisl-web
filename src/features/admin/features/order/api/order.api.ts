import { axiosInstance } from "@/shared/lib/api/axios-instance";

export const orderAdminApi = {
  forceCancelOrder: async (orderId: string): Promise<any> => {
    return axiosInstance.post(`/orders/${orderId}/force-cancel`);
  },
  forceCompleteOrder: async (orderId: string): Promise<any> => {
    return axiosInstance.post(`/orders/${orderId}/force-complete`);
  },
};
