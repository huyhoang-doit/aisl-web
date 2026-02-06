import { roles } from '@/shared/configs/role'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/auth.store'

interface RoleRoutesProps {
    requiredRole: typeof roles.TECHNICAL_STAFF | typeof roles.ADMIN
    redirectTo: string
}

export const RoleRoutes = ({ requiredRole, redirectTo }: RoleRoutesProps) => {
    const { isAuthenticated, user } = useAuthStore()
    
    if (!isAuthenticated || !user || !user.roles.includes(requiredRole)) {
        return <Navigate to={redirectTo} replace={true} />
    }
    
    if (requiredRole === roles.TECHNICAL_STAFF && !user.roles.includes(roles.TECHNICAL_STAFF)) {
        return <Navigate to={redirectTo} replace={true} />
    }
    
    if (requiredRole === roles.ADMIN && !user.roles.includes(roles.ADMIN)) {
        return <Navigate to={redirectTo} replace={true} />
    }
    
    return <Outlet />
}