import AdminDashboardPage from "@/pages/admin/AdminDashboardPage"
import { Route, Routes } from "react-router-dom"

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
    </Routes>
  )
}

export default AdminRoutes