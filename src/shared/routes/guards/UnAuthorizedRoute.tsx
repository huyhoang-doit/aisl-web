import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { roles } from '@/shared/configs/role'

export const UnAuthorizedRoute = () => {
    const { isAuthenticated, user } = useAuthStore()
    
    // Nếu chưa đăng nhập, cho phép truy cập route (login page)
    if (!isAuthenticated || !user) {
      return <Outlet />
    }
    
    // Nếu đã đăng nhập, redirect về trang tương ứng với role
    if (user.role === roles.ADMIN) {
      return <Navigate to="/admin" replace={true} />
    }
    
    if (user.role === roles.TECHNICAL_STAFF) {
      return <Navigate to="/staff" replace={true} />
    }
    
    return <Navigate to="/" replace={true} />
  }