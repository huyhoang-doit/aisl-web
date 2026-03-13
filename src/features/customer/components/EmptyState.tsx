export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 mb-8 space-y-4">
      <div className="text-center space-y-1">
        <h2 className="text-[18px] font-semibold text-gray-900">Bạn chưa sử dụng tủ nào</h2>
        <p className="text-[14px] text-[#6B7280]">Thuê tủ để bắt đầu</p>
      </div>
      <button className="w-[200px] h-[48px] bg-gradient-to-br from-[#F59E0B] to-[#FDBA74] text-white text-[15px] font-semibold rounded-[16px] shadow-sm active:opacity-80 transition-opacity">
        Thuê tủ ngay
      </button>
    </div>
  );
}
