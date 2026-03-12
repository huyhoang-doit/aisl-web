import { useState } from "react";
import { BottomSheetDetail } from "./BottomSheetDetail";

export function ActiveLockerCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="cursor-pointer bg-[#FFF7ED] border border-[#FDBA74] rounded-[20px] p-[20px] shadow-sm flex flex-col gap-[12px] mb-8 transition-transform active:scale-[0.98]"
      >
        <div className="flex items-center justify-between">
          <span className="text-[18px] font-semibold text-gray-900">Tủ A12</span>
          <span className="bg-[#F59E0B] text-white text-[10px] font-bold px-[10px] py-[4px] rounded-[12px] tracking-wide">
            ĐANG SỬ DỤNG
          </span>
        </div>
        <div className="text-[14px] text-[#6B7280]">
          Tầng 2 – Khu B
        </div>
        <div className="text-[16px] font-medium text-gray-900 mt-1">
          Còn 1 giờ 45 phút
        </div>
        <div className="w-full h-[6px] bg-[#FDE68A] rounded-full mt-1 overflow-hidden">
          <div className="h-full bg-[#F59E0B] w-[45%] rounded-full" />
        </div>
      </div>

      <BottomSheetDetail isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
