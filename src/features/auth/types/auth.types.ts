/**
 * Auth Types
 * TypeScript types cho authentication
 */


export interface User {
  id: string;
  username: string;
  email: string;
  // name: string;
  roles: string[];
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DeviceInfo {
  deviceId: string;
  ipAddress?: string;
  userAgent: string;
  platform: string;
  fcmToken?: string;
}

export interface LoginInput {
  email: string;
  password: string;
  deviceInfo?: DeviceInfo;
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

export interface ChangePasswordInput {
  email: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message?: string;
}
