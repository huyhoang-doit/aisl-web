import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/features/auth/store/auth.store";

interface CourierAcceptedData {
  dispatchId: string;
  courierId: string;
  courierName: string;
  courierPhone: string;
  orderCode: string;
  orderId: string;
}

/**
 * Hook để kết nối WebSocket theo dõi trạng thái dispatch (tìm tài xế).
 * namespace: dispatch
 */
export const useDispatchSocket = (senderId: string | undefined) => {
  const socketRef = useRef<Socket | null>(null);
  const { token } = useAuthStore();
  const [courierInfo, setCourierInfo] = useState<CourierAcceptedData | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token || !senderId) return;

    // Khởi tạo connection tới namespace dispatch
    const socket = io(`${import.meta.env.VITE_API_URL || ""}/dispatch`, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[WS] Connected to dispatch namespace");
      setIsConnected(true);
      // Join room tracking cá nhân
      socket.emit("join_tracking", { courierId: senderId });
    });

    socket.on("disconnect", () => {
      console.log("[WS] Disconnected from dispatch namespace");
      setIsConnected(false);
    });

    // Lắng nghe sự kiện tài xế chấp nhận đơn
    socket.on("courier_accepted", (data: CourierAcceptedData) => {
      console.log("[WS] Courier accepted order:", data);
      setCourierInfo(data);
    });

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [token, senderId]);

  return { isConnected, courierInfo };
};
