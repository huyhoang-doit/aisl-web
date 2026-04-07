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
    return axiosInstance.get<T>(url, config).then((res) => res.data);
  },

  /**
   * POST request
   */
  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return axiosInstance.post<T>(url, data, config).then((res) => res.data);
  },

  /**
   * PUT request
   */
  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return axiosInstance.put<T>(url, data, config).then((res) => res.data);
  },

  /**
   * PATCH request
   */
  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return axiosInstance.patch<T>(url, data, config).then((res) => res.data);
  },

  /**
   * DELETE request
   */
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.delete<T>(url, config).then((res) => res.data);
  },
};

/**
 * Export axios instance để sử dụng trực tiếp nếu cần
 */
export { axiosInstance };
