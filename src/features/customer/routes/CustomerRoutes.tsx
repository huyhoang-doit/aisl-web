import { Route, Routes, Navigate } from "react-router-dom";
import { CustomerLayout } from "../layouts/CustomerLayout";
import HomePage from "../pages/HomePage";
import RentPage from "../pages/RentPage";

export default function CustomerRoutes() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/rent" element={<RentPage />} />
        {/* Mock other routes for now */}
        <Route path="/history" element={<div className="p-6">Lịch sử</div>} />
        <Route path="/qr" element={<div className="p-6">QR Code</div>} />
        <Route path="/notifications" element={<div className="p-6">Thông báo</div>} />
        <Route path="/account" element={<div className="p-6">Tài khoản</div>} />
        <Route path="*" element={<Navigate to="/app/home" replace />} />
      </Route>
    </Routes>
  );
}
