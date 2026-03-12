import { useAuthStore } from "@/features/auth/store/auth.store";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cabinetService } from "@/features/admin/features/cabinet/services/cabinet.service";

import { useQuery } from "@tanstack/react-query";

export function HeaderBlock() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  // call api cabinetId lấy từ local storage thông qua cabinetService
  const cabinetId = localStorage.getItem("kiosk_cabinet_id");

  const { data: cabinetResponse, isLoading } = useQuery({
    queryKey: ["cabinet", cabinetId],
    queryFn: () => cabinetService.getById(cabinetId!),
    enabled: !!cabinetId,
  });

  const isAdmin = user?.roles?.includes("ADMIN");
  const isTechStaff = user?.roles?.includes("TECHNICAL_STAFF");
  
  const getSetupPath = () => {
    if (isAdmin) return "/admin/setup-cabinet";
    if (isTechStaff) return "/staff/setup-cabinet";
    return null;
  };

  const setupPath = getSetupPath();

  return (
    <div className="flex flex-col mb-8 border-b border-[#F3F4F6] pb-6 mt-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-semibold text-gray-900 leading-tight">
          Xin chào, {user?.username}
        </h1>

        {setupPath && (
          <Settings
            className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
            onClick={() => navigate(setupPath)}
            name="Cài đặt tủ"
          />
        )}
      </div>

      <p className="text-[14px] text-[#6B7280] mt-1">
        {isLoading 
          ? "Đang tải hệ thống..." 
          : cabinetId && cabinetResponse?.data
            ? [cabinetResponse.data.name, (cabinetResponse.data as any).address].filter(Boolean).join(" - ")
            : "Chưa cấu hình Tủ (Kiosk)"
        }
      </p>
    </div>
  );
}