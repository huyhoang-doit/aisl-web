import { Routes, Route } from "react-router-dom";
import { AdminLayout } from "@/features/admin/components/AdminLayout";
import AdminDashboardPage from "@/features/admin/pages/AdminDashboardPage";
import ProfilePage from "@/shared/pages/ProfilePage";
import NotFoundPage from "@/shared/pages/NotFoundPage";
import SettingPage from "@/shared/pages/SettingPage";
import ManageUserPage from "../pages/ManageUserPage";
import ManageLockerPage from "../pages/ManageLockerPage";
import ManageCabinetPage from "../pages/ManageCabinetPage";
import ManageLocationPage from "../pages/ManageLocationPage";
const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingPage />} />
        <Route path="users" element={<ManageUserPage />} />
        <Route path="locations" element={<ManageLocationPage />} />
        <Route path="lockers" element={<ManageLockerPage />} />
        <Route path="cabinets" element={<ManageCabinetPage />} />


      </Route>
        <Route path="not-found" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AdminRoutes;