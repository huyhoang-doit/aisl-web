import { useNavigate } from "react-router-dom";

export function ActionGrid() {
  const navigate = useNavigate();
  const actions = [
    { label: "Thuê tủ", path: "/app/rent" },
    { label: "Gửi hàng", path: "/app/send" },
    { label: "Nhận hàng", path: "/app/receive" },
    { label: "Tìm locker", path: "/app/find" },
  ];

  return (
    <div className="grid grid-cols-2 gap-[16px]">
      {actions.map((action, idx) => (
        <div 
          key={idx}
          onClick={() => navigate(action.path)}
          className="bg-white border border-[#F3F4F6] rounded-[18px] p-[20px] shadow-sm flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-md hover:border-[#FDBA74] active:scale-[0.98]"
        >
          <span className="text-[16px] font-semibold text-gray-900">{action.label}</span>
        </div>
      ))}
    </div>
  );
}
