/**
 * Axios Instance Configuration
 * Centralized axios instance với interceptors và error handling
 */
import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { authService } from '@/features/auth/services/auth.service';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const MAX_REFRESH_ATTEMPTS = 3;

interface AuthAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
  skipAuthToken?: boolean;
}

/**
 * Tạo axios instance với cấu hình mặc định
 */
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 0, // infinite timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

import { getDeviceId } from '@/shared/utils/device';

// ... (existing imports)

// ... (existing code)

let isRefreshing = false;
let refreshAttempts = 0;
let pendingRequests: Array<{
  resolve: (token: string) => void;
  reject: (error: { message: string; status: number }) => void;
}> = [];

const isRefreshEndpoint = (url?: string): boolean => {
  return !!url && (url.includes('/auth/refresh') || url.includes('/auth/refresh-token'));
};

const clearAuthSession = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userInfo');
  window.dispatchEvent(new Event('auth:logout'));
};

const resolvePendingRequests = (token: string): void => {
  pendingRequests.forEach(({ resolve }) => resolve(token));
  pendingRequests = [];
};

const rejectPendingRequests = (error: { message: string; status: number }): void => {
  pendingRequests.forEach(({ reject }) => reject(error));
  pendingRequests = [];
};

const refreshAccessToken = async (): Promise<string> => {
  if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
    clearAuthSession();
    throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
  }

  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    clearAuthSession();
    throw new Error('Không tìm thấy refresh token. Vui lòng đăng nhập lại.');
  }

  refreshAttempts += 1;
  const response = await authService.refreshToken(refreshToken);
  const newAccessToken = response?.data?.accessToken ?? response?.accessToken ?? response?.token;
  const newRefreshToken = response?.data?.refreshToken ?? response?.refreshToken;

  if (!newAccessToken) {
    clearAuthSession();
    throw new Error('Không thể làm mới phiên đăng nhập.');
  }

  localStorage.setItem('token', newAccessToken);
  if (newRefreshToken) {
    localStorage.setItem('refreshToken', newRefreshToken);
  }

  refreshAttempts = 0;
  return newAccessToken;
};

/**
 * Request Interceptor
 * Thêm token và device info vào header trước khi gửi request
 */
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const requestConfig = config as AuthAxiosRequestConfig;
    // Lấy token từ localStorage
    const token = localStorage.getItem('token');
    
    if (!requestConfig.skipAuthToken && token && config.headers) {
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

const cleanErrorMessage = (message: string): string => {
  if (!message) return '';
  // Strip gRPC prefix like "2 UNKNOWN: Message" or "13 INTERNAL: Message"
  return message.replace(/^\d+\s+[A-Z_]+:\s*/i, '');
};

const extractMessage = (data: any, defaultMessage: string): string => {
  if (!data) return cleanErrorMessage(defaultMessage);
  if (typeof data === 'string') return cleanErrorMessage(data);
  
  const msg = data.message;
  if (typeof msg === 'string') {
    return cleanErrorMessage(msg);
  }
  if (Array.isArray(msg)) {
    return msg.map((item: any) => cleanErrorMessage(typeof item === 'object' ? JSON.stringify(item) : String(item))).join(', ');
  }
  if (msg && typeof msg === 'object') {
    return cleanErrorMessage(msg.message || msg.error || JSON.stringify(msg));
  }
  
  return cleanErrorMessage(data.error || defaultMessage);
};

/**
 * Response Interceptor
 * Xử lý response và error handling
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Trả về data trực tiếp từ response
    return response.data;
  },
  async (error: AxiosError) => {
    // Xử lý lỗi
    if (error.response) {
      // Server trả về error response
      const status = error.response.status;
      const data = error.response.data as any;
      const originalRequest = error.config as AuthAxiosRequestConfig | undefined;

      // Xử lý các trường hợp đặc biệt
      if (status === 401) {
        if (!originalRequest) {
          clearAuthSession();
          return Promise.reject({
            message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
            status: 401,
          });
        }

        if (
          originalRequest.skipAuthRefresh ||
          originalRequest._retry ||
          isRefreshEndpoint(originalRequest.url)
        ) {
          clearAuthSession();
          return Promise.reject({
            message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
            status: 401,
          });
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            pendingRequests.push({
              resolve: (token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                resolve(axiosInstance(originalRequest));
              },
              reject,
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newAccessToken = await refreshAccessToken();
          resolvePendingRequests(newAccessToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return axiosInstance(originalRequest);
        } catch (refreshError: any) {
          const normalizedError = {
            message: refreshError?.message || 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
            status: 401,
          };
          rejectPendingRequests(normalizedError);
          clearAuthSession();
          return Promise.reject(normalizedError);
        } finally {
          isRefreshing = false;
        }
      }

      // Tạo error object với thông tin chi tiết
      const apiError = {
        message: extractMessage(data, error.message || 'Có lỗi xảy ra'),
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
