/**
 * API Client Configuration
 * Wrapper cho axios instance với các method tiện lợi
 */
import axiosInstance from './axios-instance';
import type { AxiosRequestConfig } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
  data?: unknown;
}

/**
 * REST API methods sử dụng axios instance
 */
export const api = {
  /**
   * GET request
   */
  get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.get<T>(url, config);
  },

  /**
   * POST request
   */
  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return axiosInstance.post<T>(url, data, config);
  },

  /**
   * PUT request
   */
  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return axiosInstance.put<T>(url, data, config);
  },

  /**
   * PATCH request
   */
  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return axiosInstance.patch<T>(url, data, config);
  },

  /**
   * DELETE request
   */
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.delete<T>(url, config);
  },
};

/**
 * Export axios instance để sử dụng trực tiếp nếu cần
 */
export { axiosInstance };
