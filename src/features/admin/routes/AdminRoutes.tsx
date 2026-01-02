import AdminDashboardPage from "@/features/admin/pages/AdminDashboardPage"
import { AdminLayout } from "@/features/admin/components/AdminLayout"
import { Route, Routes } from "react-router-dom"

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route index element={<AdminDashboardPage />} />
      </Route>
    </Routes>
  )
}

export default AdminRoutes