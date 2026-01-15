import StaffDashboardPage from "@/features/staff/pages/StaffDashboardPage"
import { StaffLayout } from "@/features/staff/components/StaffLayout"
import ProfilePage from "@/shared/pages/ProfilePage"
import SettingPage from "@/shared/pages/SettingPage"
import { Route, Routes } from "react-router-dom"
import NotFoundPage from "@/shared/pages/NotFoundPage"

const StaffRoutes = () => {
  return (
    <Routes>
      <Route element={<StaffLayout />}>
        <Route path="dashboard" element={<StaffDashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingPage />} />
        <Route index element={<StaffDashboardPage />} />

      </Route>
        <Route path="not-found" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default StaffRoutes