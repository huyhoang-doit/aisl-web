import { Routes, Route } from "react-router-dom";
import { AdminLayout } from "@/features/admin/components/AdminLayout";
import AdminDashboardPage from "@/features/admin/pages/AdminDashboardPage";
import ProfilePage from "@/shared/pages/ProfilePage";
import NotFoundPage from "@/shared/pages/NotFoundPage";
import ManageUserPage from "../pages/ManageUserPage";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="users" element={<ManageUserPage />} />


      </Route>
        <Route path="not-found" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AdminRoutes;