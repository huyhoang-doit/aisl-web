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

    return <Outlet />
}