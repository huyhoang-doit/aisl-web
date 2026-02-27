import { Routes, Route } from "react-router-dom";
import { AdminLayout } from "@/features/admin/components/AdminLayout";
import AdminDashboardPage from "@/features/admin/pages/AdminDashboardPage";
import ProfilePage from "@/shared/pages/ProfilePage";
import NotFoundPage from "@/shared/pages/NotFoundPage";
import SettingPage from "@/shared/pages/SettingPage";
import ManageUserPage from "../pages/ManageUserPage";
import ManageStaffPage from "../pages/ManageStaffPage";
import ManageCourierRequest from "../pages/ManageCourierRequest";
import ManageLockedAccountsPage from "../pages/ManageLockedAccountsPage";
import ManageLockerPage from "../pages/ManageLockerPage";
import ManageCabinetPage from "../pages/ManageCabinetPage";
import ManageLocationPage from "../pages/ManageLocationPage";
import ManagePlanPage from "../pages/ManagePlanPage";
import ManageCustomerReport from "../pages/ManageCustomerReport";
import ManageTransactionPage from "../pages/ManageTransactionPage";
import ManageOrderPage from "../pages/ManageOrderPage";
import ManageHardwarePage from "../pages/ManageHardwarePage";
import ManageTechnicalStaffReport from "../pages/ManageTechnicalStaffReport";
import AdminNotificationListPage from "@/features/notification/pages/AdminNotificationListPage";
import AdminNotificationDetailPage from "@/features/notification/pages/AdminNotificationDetailPage";
import DispatchMapPage from "../pages/DispatchMapPage";
const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingPage />} />
        <Route path="users" element={<ManageUserPage />} />
        <Route path="staff" element={<ManageStaffPage />} />
        <Route path="courier-requests" element={<ManageCourierRequest />} />
        <Route path="locked-accounts" element={<ManageLockedAccountsPage />} />
        <Route path="manage-reports" element={<ManageCustomerReport />} />
        <Route path="manage-reports-staff" element={<ManageTechnicalStaffReport />} />
        <Route path="locations" element={<ManageLocationPage />} />
        <Route path="lockers" element={<ManageLockerPage />} />
        <Route path="cabinets" element={<ManageCabinetPage />} />
        <Route path="transactions" element={<ManageTransactionPage />} />
        <Route path="orders" element={<ManageOrderPage />} />
        <Route path="hardware-monitor" element={<ManageHardwarePage />} />
        <Route path="plans" element={<ManagePlanPage />} />
        <Route path="notifications" element={<AdminNotificationListPage />} />
        <Route path="notifications/:id" element={<AdminNotificationDetailPage />} />
        <Route path="dispatch-map" element={<DispatchMapPage />} />

      </Route>
        <Route path="not-found" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AdminRoutes;