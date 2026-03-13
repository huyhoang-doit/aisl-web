interface LoginSheetProps {
  isOpen: boolean;
  onLoginSuccess: () => void;
}

export function LoginSheet({ isOpen, onLoginSuccess }: LoginSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-[460px] bg-white h-[80vh] sm:h-auto sm:min-h-[500px] rounded-t-[24px] sm:rounded-b-[24px] p-[32px] flex flex-col pt-[40px] animate-in slide-in-from-bottom-8 duration-300">
        <div className="flex flex-col flex-1 space-y-6">
          <div>
            <h1 className="text-[24px] font-bold text-gray-900 mb-2">Đăng nhập</h1>
            <p className="text-[15px] text-[#6B7280]">Vui lòng nhập số điện thoại để tiếp tục sử dụng Kiosk.</p>
          </div>
          
          <div className="space-y-4 pt-4">
            <div className="flex flex-col space-y-2">
              <label className="text-[14px] font-medium text-gray-700">Số điện thoại</label>
              <input 
                type="tel" 
                placeholder="Ví dụ: 0912345678" 
                className="h-[52px] px-4 rounded-[12px] border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FDBA74]/50 focus:border-[#FDBA74] transition-all"
              />
            </div>
            {/* Password input might go here if needed, keeping simple for demo flow */}
          </div>
        </div>

        <div className="mt-8 shrink-0 pb-4">
          <button 
            onClick={onLoginSuccess}
            className="w-full h-[52px] bg-gradient-to-br from-[#F59E0B] to-[#FDBA74] text-white text-[16px] font-semibold rounded-[16px] active:opacity-80 transition-opacity"
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
}
