import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landing/LandingPage";
import { UnAuthorizedRoute } from "./routes/UnAuthorizedRoute";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { roles } from "./configs/role";
import { RoleRoutes } from "./routes/RoleRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import StaffRoutes from "./routes/StaffRoutes";
import NotFoundPage from "./pages/404/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      <Route element={<UnAuthorizedRoute />}>
        {/* <Route path="/login" element={<Login />} /> */}
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
      </Route>

      <Route path="/not-found" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
