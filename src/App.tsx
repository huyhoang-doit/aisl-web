import { Route, Routes } from "react-router-dom";
import LandingPage from "./features/landing/pages/LandingPage";
import { UnAuthorizedRoute } from "./shared/routes/guards/UnAuthorizedRoute";
import { ProtectedRoute } from "./shared/routes/guards/ProtectedRoute";
import { roles } from "./shared/configs/role";
import { RoleRoutes } from "./shared/routes/guards/RoleRoutes";
import AdminRoutes from "./features/admin/routes/AdminRoutes";
import StaffRoutes from "./features/staff/routes/StaffRoutes";
import NotFoundPage from "./shared/pages/NotFoundPage";
import Login from "./features/auth/pages/Login";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Unauthorized routes - chỉ cho phép khi chưa đăng nhập */}
      <Route element={<UnAuthorizedRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected routes - yêu cầu đăng nhập */}
      <Route element={<ProtectedRoute />}>
        {/* Admin routes - yêu cầu role ADMIN */}
        <Route
          element={
            <RoleRoutes
              requiredRole={roles.ADMIN}
              redirectTo="/not-found"
            />
          }
        >
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Route>
        
        {/* Staff routes - yêu cầu role STAFF */}
        <Route
          element={
            <RoleRoutes
              requiredRole={roles.STAFF}
              redirectTo="/not-found"
            />
          }
        >
          <Route path="/staff/*" element={<StaffRoutes />} />
        </Route>
      </Route>

      {/* 404 routes */}
      <Route path="/not-found" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
