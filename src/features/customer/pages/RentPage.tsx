import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { lockerService } from "@/features/admin/features/locker/services/locker.service";
import type { LeastUsedLocker } from "@/features/admin/features/locker/services/locker.service";

export default function RentPage() {
  const navigate = useNavigate();
  const [selectedLockerId, setSelectedLockerId] = useState<string | null>(null);

  const cabinetId = localStorage.getItem("kiosk_cabinet_id");

  const { data: leastUsedResponse, isLoading } = useQuery({
    queryKey: ["least-used-lockers", cabinetId],
    queryFn: () => lockerService.getLeastUsed(cabinetId!),
    enabled: !!cabinetId,
  });

  const lockers = leastUsedResponse?.data?.lockers || [];

  const handleSelectLocker = (locker: LeastUsedLocker) => {
    if (locker.status !== "AVAILABLE") return;
    
    // Toggle selection
    if (selectedLockerId === locker.id) {
      setSelectedLockerId(null);
    } else {
      setSelectedLockerId(locker.id);
    }
  };

  const handleContinue = () => {
    if (!selectedLockerId) return;
    // TBD: Navigate to payment or detail page
    // navigate(`/app/rent/${selectedLockerId}`);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)]">
      {/* Header */}
      <header className="mb-6 flex items-center gap-3">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-slate-700" />
        </button>
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
            Chọn tủ trống
          </h1>
        </div>
      </header>

      {/* Grid Danh sách tủ */}
      <section className="flex-grow pb-[100px]">
        {isLoading ? (
          <div className="text-center py-10 text-slate-500">Đang tải danh sách tủ...</div>
        ) : lockers.length === 0 ? (
          <div className="text-center py-10 text-slate-500">Không tìm thấy tủ nào.</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {lockers.map((locker) => {
              const isAvailable = locker.status === "AVAILABLE";
              const isSelected = selectedLockerId === locker.id;

              return (
                <div
                  key={locker.id}
                  onClick={() => handleSelectLocker(locker)}
                  className={`
                    p-5 rounded-2xl border-2 flex flex-col gap-2 transition-all 
                    ${!isAvailable ? "border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed" : 
                      isSelected ? "border-[#FDBA74] bg-orange-50/30 shadow-md cursor-pointer relative" : 
                      "border-slate-100 bg-white shadow-sm cursor-pointer hover:border-orange-500/20"
                    }
                  `}
                >
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      ĐANG CHỌN
                    </div>
                  )}
                  
                  <span className={`text-lg font-semibold ${!isAvailable ? "text-slate-400" : "text-slate-800"}`}>
                    {locker.lockerLabel || `Tủ ${locker.slotIndex}`}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <span 
                      className={`size-2 rounded-full ${
                        isAvailable ? "bg-[#10B981]" : 
                        locker.status === "MAINTENANCE" ? "bg-amber-500" : 
                        "bg-[#EF4444]"
                      }`}
                    ></span>
                    <span className={`text-[13px] font-medium ${
                        isAvailable ? "text-[#10B981]" : 
                        locker.status === "MAINTENANCE" ? "text-amber-500" : 
                        "text-[#EF4444]"
                    }`}>
                      {isAvailable ? "Trống" : locker.status === "MAINTENANCE" ? "Bảo trì" : "Đang dùng"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer / Buttons */}
      <footer className="fixed bottom-[80px] left-1/2 -translate-x-1/2 w-full max-w-[460px] p-6 bg-white border-t border-slate-100">
        <button 
          onClick={handleContinue}
          disabled={!selectedLockerId}
          className={`
            w-full h-[52px] font-semibold rounded-2xl shadow-lg transition-transform active:scale-[0.98]
            ${selectedLockerId 
              ? "bg-gradient-to-r from-[#F59E0B] to-[#FDBA74] text-white shadow-orange-200" 
              : "bg-slate-100 text-slate-400 shadow-none cursor-not-allowed"
            }
          `}
        >
          Tiếp tục
        </button>
      </footer>
    </div>
  );
}