/**
 * Auth Service
 * Service layer cho authentication API calls
 */
import { api } from '@/shared/lib/api/client';
import type { LoginInput, LoginResponse, RegisterInput, RegisterResponse, User } from '../types/auth.types';

export const authService = {
  /**
   * Đăng nhập
   */
  login: async (data: LoginInput): Promise<LoginResponse> => {
    // Backend expects { email, password, deviceInfo }
    return api.post<LoginResponse>('/auth/login', data);
  },

  /**
   * Đăng ký tài khoản (admin tạo user mới)
   */
  register: async (data: RegisterInput): Promise<RegisterResponse> => {
    return api.post<RegisterResponse>('/auth/register', data);
  },

   /**
   * Tạo tài khoản (admin tạo user mới)
   */
   createAccout: async (data: RegisterInput): Promise<RegisterResponse> => {
    return api.post<RegisterResponse>('/auth/create-account', data);
  },


  /**
   * Đăng xuất
   */
  logout: async (): Promise<void> => {
    return api.post<void>('/api/auth/logout');
  },

  /**
   * Lấy thông tin user hiện tại
   */
  getCurrentUser: async (): Promise<{ data: User }> => {
    return api.get<{ data: User }>('/users/me');
  },

  /**
   * Refresh token
   */
  refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
    return api.post<{ token: string }>('/api/auth/refresh', { refreshToken });
  },
};
