import StaffDashboardPage from "@/features/staff/pages/StaffDashboardPage"
import { StaffLayout } from "@/features/staff/components/StaffLayout"
import { Route, Routes } from "react-router-dom"

const StaffRoutes = () => {
  return (
    <Routes>
      <Route element={<StaffLayout />}>
        <Route path="dashboard" element={<StaffDashboardPage />} />
        <Route index element={<StaffDashboardPage />} />
      </Route>
    </Routes>
  )
}

export default StaffRoutes