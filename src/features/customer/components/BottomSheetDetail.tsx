import { useEffect, useState } from "react";

interface BottomSheetDetailProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BottomSheetDetail({ isOpen, onClose }: BottomSheetDetailProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      document.body.style.overflow = "hidden";
    } else {
      setTimeout(() => setShow(false), 200); // Wait for transition
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen && !show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-200 ease-out ${isOpen ? 'opacity-20' : 'opacity-0'}`} 
        onClick={onClose}
      />

      {/* Sheet */}
      <div 
        className={`relative w-full max-w-[460px] bg-white h-[70vh] sm:h-auto sm:min-h-[400px] rounded-t-[24px] sm:rounded-b-[24px] p-[24px] flex flex-col transition-transform duration-200 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full sm:translate-y-4 sm:opacity-0'}`}
      >
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 shrink-0 sm:hidden" />
        
        <div className="flex-1 overflow-y-auto space-y-[16px]">
          <h2 className="text-[20px] font-semibold text-gray-900 mb-6">Chi tiết thuê tủ</h2>
          
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <span className="text-[#6B7280] text-[15px]">Mã tủ</span>
            <span className="font-semibold text-gray-900 text-[16px]">A12</span>
          </div>
          
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <span className="text-[#6B7280] text-[15px]">Vị trí</span>
            <span className="font-medium text-gray-900 text-[15px]">Tầng 2 – Khu B</span>
          </div>

          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <span className="text-[#6B7280] text-[15px]">Thời gian bắt đầu</span>
            <span className="font-medium text-gray-900 text-[15px]">14:00</span>
          </div>

          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <span className="text-[#6B7280] text-[15px]">Thời gian còn lại</span>
            <span className="font-medium text-gray-900 text-[15px]">1 giờ 45 phút</span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-[#6B7280] text-[15px]">Giá thuê</span>
            <span className="font-bold text-[#F59E0B] text-[18px]">25.000đ</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 pt-4 pb-2 shrink-0 bg-white">
          <button className="w-full h-[52px] bg-gradient-to-br from-[#F59E0B] to-[#FDBA74] text-white text-[16px] font-semibold rounded-[16px] active:opacity-80 transition-opacity">
            Mở tủ tạm thời
          </button>
          <button className="w-full h-[52px] bg-white border border-[#F59E0B] text-[#F59E0B] text-[16px] font-semibold rounded-[16px] mt-[12px] active:bg-orange-50 transition-colors">
            Trả tủ
          </button>
        </div>
      </div>
    </div>
  );
}
