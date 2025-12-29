import { roles } from '@/shared/configs/role'
import { useRole } from '@/shared/hooks/useRole'
import { Navigate, Outlet } from 'react-router-dom'

interface RoleRoutesProps {
    requiredRole: typeof roles.STAFF | typeof roles.ADMIN
    redirectTo: string
}

export const RoleRoutes = ({ requiredRole, redirectTo }: RoleRoutesProps) => {
    const userInfo = localStorage.getItem('userInfo')
    
    let user = null
    if (userInfo) {
        try {
            user = JSON.parse(userInfo)
        } catch {
            // Nếu parse JSON lỗi, user vẫn là null
        }
    }
    
    const userRole = user?.role as typeof roles.STAFF | typeof roles.ADMIN | undefined
    const { isStaff, isAdmin } = useRole(userRole)
    
    if (!userInfo || !user || !user.role) {
        return <Navigate to={redirectTo} replace={true} />
    }
    
    if (requiredRole === roles.STAFF && !isStaff) {
        return <Navigate to={redirectTo} replace={true} />
    }
    
    if (requiredRole === roles.ADMIN && !isAdmin) {
        return <Navigate to={redirectTo} replace={true} />
    }
    
    return <Outlet />
}