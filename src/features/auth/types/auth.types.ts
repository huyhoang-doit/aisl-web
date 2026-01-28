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
  roles: [typeof roles.STAFF, typeof roles.ADMIN];
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginInput {
  email: string;
  password: string;
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
