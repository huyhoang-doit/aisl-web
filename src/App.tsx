import { Route, Routes } from "react-router-dom";
import LandingPage from "./features/landing/pages/LandingPage";
import { UnAuthorizedRoute } from "./shared/routes/guards/UnAuthorizedRoute";
import { ProtectedRoute } from "./shared/routes/guards/ProtectedRoute";
import { roles } from "./shared/configs/role";
import { RoleRoutes } from "./shared/routes/guards/RoleRoutes";
import AdminRoutes from "./features/admin/routes/AdminRoutes";
import StaffRoutes from "./features/staff/routes/StaffRoutes";
import NotFoundPage from "./shared/pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin" element={<AdminRoutes />} />
      <Route path="/staff" element={<StaffRoutes />} />
      
      {/* <Route element={<UnAuthorizedRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
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
      </Route> */}

      <Route path="/not-found" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
