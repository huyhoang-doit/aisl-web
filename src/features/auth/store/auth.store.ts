/**
 * Auth Zustand Store
 * Quản lý authentication state cho toàn bộ ứng dụng
 */
import { create } from 'zustand';
import { authService } from '../services/auth.service';
import type { LoginInput } from '../types/auth.types';
import type { User } from '../types/auth.types';
import { toast } from 'sonner';
import { roles } from '@/shared/configs/role';

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (data: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthState>((set, get) => {
  // Khôi phục state từ localStorage khi khởi tạo
  const initializeAuth = () => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
    
    if (token && userInfo) {
      try {
        const user = JSON.parse(userInfo);
        return {
          user,
          token,
          isAuthenticated: true,
        };
      } catch {
        // Nếu parse lỗi, clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
      }
    }
    
    return initialState;
  };

  const initialStateFromStorage = initializeAuth();

  return {
    ...initialStateFromStorage,
    isLoading: false,
    error: null,

    /**
     * Đăng nhập
     */
    login: async (data: LoginInput) => {
      set({ isLoading: true, error: null });
      try {
        const response = await authService.login(data);
        
        // Lưu token và user info vào localStorage
        localStorage.setItem('token', response.data.accessToken);

        await get().getCurrentUser();
        
        set({
          token: response.data.accessToken,
        });

        toast.success('Đăng nhập thành công');
      } catch (error: any) {
        const errorMessage = error?.message || 'Email hoặc mật khẩu không đúng';
        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage);
        throw error;
      }
    },

    /**
     * Đăng xuất
     */
    logout: async () => {
      try {
        // Gọi API logout (nếu có)
        await authService.logout();
      } catch (error) {
        // Nếu API logout fail, vẫn tiếp tục logout local
        console.error('Logout API error:', error);
      } finally {
        // Xóa token và user info
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });

        toast.success('Đăng xuất thành công');
      }
    },

    /**
     * Lấy thông tin user hiện tại
     */
    getCurrentUser: async () => {
      set({ isLoading: true, error: null });
      try {
        const user = await authService.getCurrentUser();
        
        // Cập nhật localStorage
        localStorage.setItem('userInfo', JSON.stringify(user.data));
        
        set({
          user: user.data,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error: any) {
        const errorMessage = error?.message || 'Không thể lấy thông tin người dùng';
        set({ error: errorMessage, isLoading: false });
        
        // Nếu token không hợp lệ, logout
        if (error?.status === 401) {
          get().logout();
        }
      }
    },

    /**
     * Set user manually
     */
    setUser: (user: User | null) => {
      if (user) {
        localStorage.setItem('userInfo', JSON.stringify(user));
      } else {
        localStorage.removeItem('userInfo');
      }
      set({ user, isAuthenticated: !!user });
    },

    /**
     * Set token manually
     */
    setToken: (token: string | null) => {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
      set({ token, isAuthenticated: !!token && !!get().user });
    },

    /**
     * Clear error
     */
    clearError: () => {
      set({ error: null });
    },

    /**
     * Reset auth state
     */
    reset: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      set(initialState);
    },
  };
});

/**
 * Helper hooks để check role
 */
export const useIsAdmin = () => {
  return useAuthStore((state) => state.user?.role === roles.ADMIN);
};

export const useIsStaff = () => {
  return useAuthStore((state) => state.user?.role === roles.STAFF);
};

export const useUserRole = () => {
  return useAuthStore((state) => state.user?.role);
};
