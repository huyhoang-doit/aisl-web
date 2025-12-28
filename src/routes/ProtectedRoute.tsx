import { Navigate, Outlet } from "react-router-dom"

export const ProtectedRoute = () => {
    const userInfo = localStorage.getItem('userInfo')
    if (!userInfo) return <Navigate to="/login" replace={true} />
    
    let user
    try {
      user = JSON.parse(userInfo)
    } catch {
      // Nếu parse JSON lỗi, redirect về login
      return <Navigate to="/login" replace={true} />
    }
    
    // Kiểm tra user có dữ liệu hợp lệ (có ít nhất một property)
    if (!user || Object.keys(user).length === 0 || !user.role) {
      return <Navigate to="/login" replace={true} />
    }
    
    return <Outlet />
  }