import StaffDashboardPage from "@/features/staff/pages/StaffDashboardPage"
import ManageLockerAreaPage from "@/features/staff/pages/ManageLockerAreaPage"
import ManageCustomerReport from "@/features/admin/pages/ManageCustomerReport"
import ManageTask from "@/features/admin/pages/ManageTask"
import MyTaskPages from "@/features/staff/pages/MyTaskPages"
import { StaffLayout } from "@/features/staff/components/StaffLayout"
import ProfilePage from "@/shared/pages/ProfilePage"
import CabinetSetupPage from "@/features/staff/features/cabinetSetup/pages/CabinetSetupPage";
import SettingPage from "@/shared/pages/SettingPage"
import { Route, Routes } from "react-router-dom"
import NotFoundPage from "@/shared/pages/NotFoundPage"

const StaffRoutes = () => {
  return (
    <Routes>
      <Route element={<StaffLayout />}>
        <Route path="dashboard" element={<StaffDashboardPage />} />
        <Route path="list-lockers" element={<ManageLockerAreaPage />} />
        <Route path="setup-cabinet" element={<CabinetSetupPage />} />
        <Route path="manage-reports" element={<ManageCustomerReport />} />
        <Route path="manage-tasks" element={<ManageTask />} />
        <Route path="my-tasks" element={<MyTaskPages />} />
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