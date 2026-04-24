import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "@/features/auth/store/auth.store"

export const ProtectedRoute = () => {
    const { isAuthenticated, user } = useAuthStore()
    
    if (!isAuthenticated || !user) {
      return <Navigate to="/login" replace={true} />
    }
    
    return <Outlet />
  }