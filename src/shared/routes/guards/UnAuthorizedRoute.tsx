import { Navigate, Outlet } from 'react-router-dom'

export const UnAuthorizedRoute = () => {
    const userInfo = localStorage.getItem('userInfo')
    if (!userInfo) return <Outlet />
    
    let user
    try {
      user = JSON.parse(userInfo)
    } catch {
      // Nếu parse JSON lỗi, cho phép truy cập route
      return <Outlet />
    }
    
    // Nếu user đã đăng nhập (có dữ liệu hợp lệ), redirect về trang chủ
    if (user && Object.keys(user).length > 0 && user.role) {
      // Redirect dựa trên role
      if (user.role === 'admin') return <Navigate to="/admin" replace={true} />
      if (user.role === 'staff') return <Navigate to="/staff" replace={true} />
      return <Navigate to="/" replace={true} />
    }
    
    return <Outlet />
  }