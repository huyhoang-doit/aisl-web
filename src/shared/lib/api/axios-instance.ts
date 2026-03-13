/**
 * Axios Instance Configuration
 * Centralized axios instance với interceptors và error handling
 */
import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Tạo axios instance với cấu hình mặc định
 */
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

import { getDeviceId } from '@/shared/utils/device';

// ... (existing imports)

// ... (existing code)

/**
 * Request Interceptor
 * Thêm token và device info vào header trước khi gửi request
 */
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem('token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add Device Info headers
    if (config.headers) {
      const deviceId = await getDeviceId();
      config.headers['x-device-id'] = deviceId;
      config.headers['x-user-agent'] = navigator.userAgent;
      config.headers['x-platform'] = navigator.platform;
    }

    // Gửi FormData: không set Content-Type để axios/browser set multipart/form-data với boundary
    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Xử lý response và error handling
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Trả về data trực tiếp từ response
    return response.data;
  },
  (error: AxiosError) => {
    // Xử lý lỗi
    if (error.response) {
      // Server trả về error response
      const status = error.response.status;
      const data = error.response.data as any;

      // Xử lý các trường hợp đặc biệt
      if (status === 401) {
        // Unauthorized - xóa token và redirect đến login
        // localStorage.removeItem('token');
        // localStorage.removeItem('userInfo');
        
        // Chỉ redirect nếu không phải đang ở trang login
        // if (window.location.pathname !== '/login') {
        //   window.location.href = '/login';
        // }
        // toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        return Promise.reject({
          message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
          status: 401,
        });
      }

      // Tạo error object với thông tin chi tiết
      const apiError = {
        message: data?.message || error.message || 'Có lỗi xảy ra',
        status: status,
        errors: data?.errors || undefined,
        data: data,
      };

      return Promise.reject(apiError);
    } else if (error.request) {
      console.log('Status:', error.request.status);
console.log('Response URL:', error.request.responseURL);
console.log('Ready State:', error.request.readyState);
      // Request đã được gửi nhưng không nhận được response
      return Promise.reject({
        message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
        status: 0,
      });
    } else {
      // Lỗi khi setup request
      return Promise.reject({
        message: error.message || 'Có lỗi xảy ra',
        status: undefined,
      });
    }
  }
);

export default axiosInstance;
