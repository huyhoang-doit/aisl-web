import { Outlet, useLocation, useNavigate } from "react-router-dom";

export function CustomerLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const NAV_ITEMS = [
    { label: "Trang chủ", path: "/app/home" },
    { label: "Lịch sử", path: "/app/history" },
    { label: "QR", path: "/app/qr" },
    { label: "Thông báo", path: "/app/notifications" },
    { label: "Tài khoản", path: "/app/account" },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center">
      <div className="w-full max-w-[460px] bg-white min-h-screen relative flex flex-col shadow-2xl">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pb-[64px]">
          <Outlet />
        </div>

        {/* Sticky Bottom Nav */}
        <div className="absolute bottom-0 left-0 right-0 h-[64px] bg-white border-t border-[#F3F4F6] flex items-center justify-between px-2">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex-1 flex justify-center items-center h-full text-[13px] sm:text-sm font-medium transition-colors ${
                  isActive ? "text-[#F59E0B]" : "text-[#9CA3AF]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
