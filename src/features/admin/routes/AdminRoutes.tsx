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
import ManagePricingPage from "../pages/ManagePricingPage";
import ManageSubscriptionPage from "../pages/ManageSubscriptionPage";
import ManageCustomerReport from "../pages/ManageCustomerReport";
import ManageTransactionPage from "../pages/ManageTransactionPage";
import ManageOrderPage from "../pages/ManageOrderPage";
import ManageHardwarePage from "../pages/ManageHardwarePage";
import LogsActivityPage from "../pages/LogsActivityPage";
import ManageStaffApplication from "../pages/ManageStaffApplication";
import CabinetSetupPage from "@/features/staff/features/cabinetSetup/pages/CabinetSetupPage";
import NotificationsPage from "@/shared/pages/NotificationsPage";
import NotificationDetailPage from "@/shared/pages/NotificationDetailPage";
import DispatchMapPage from "../pages/DispatchMapPage";
import ManageTask from "../pages/ManageTask";
import ManageVehiclesPage from "../pages/ManageVehiclesPage";
import ManageDeviceAttachmentPage from "../pages/ManageDeviceAttachmentPage";
import LogsDevicePage from "../pages/LogsDevicePage";
import ManageSizePage from "../pages/ManageSizePage";
import AiSystemConfigPage from "../pages/AiSystemConfigPage";
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
        <Route path="staff-applications" element={<ManageStaffApplication />} />
        <Route path="courier-requests" element={<ManageCourierRequest />} />
        <Route path="locked-accounts" element={<ManageLockedAccountsPage />} />
        <Route path="manage-reports" element={<ManageCustomerReport />} />
        <Route path="manage-tasks" element={<ManageTask />} />
        <Route path="locations" element={<ManageLocationPage />} />
        <Route path="lockers" element={<ManageLockerPage />} />
        <Route path="sizes" element={<ManageSizePage />} />
        <Route path="cabinets" element={<ManageCabinetPage />} />
        <Route path="transactions" element={<ManageTransactionPage />} />
        <Route path="orders" element={<ManageOrderPage />} />
        <Route path="hardware-monitor" element={<ManageHardwarePage />} />
        <Route path="setup-cabinet" element={<CabinetSetupPage />} />
        <Route path="plans" element={<ManagePlanPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="notifications/:id" element={<NotificationDetailPage />} />
        <Route path="dispatch-map" element={<DispatchMapPage />} />
        <Route path="vehicles" element={<ManageVehiclesPage />} />
        <Route path="pricing" element={<ManagePricingPage />} />
        <Route path="subscriptions" element={<ManageSubscriptionPage />} />
        <Route path="device-attachments" element={<ManageDeviceAttachmentPage />} />
        <Route path="device-logs" element={<LogsDevicePage />} />
        <Route path="activity-logs" element={<LogsActivityPage />} />
        <Route path="ai-config" element={<AiSystemConfigPage />} />

      </Route>
        <Route path="not-found" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AdminRoutes;