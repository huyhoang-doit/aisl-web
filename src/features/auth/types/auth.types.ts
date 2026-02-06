/**
 * Auth Types
 * TypeScript types cho authentication
 */
import { roles } from '@/shared/configs/role';

export interface User {
  id: string;
  username: string;
  email: string;
  // name: string;
  roles: [typeof roles.TECHNICAL_STAFF, typeof roles.ADMIN];
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  role?: string;
}

export interface RegisterResponse {
  data: User;
  message?: string;
}

export interface LoginResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  };
  message: string;
  statusCode: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
