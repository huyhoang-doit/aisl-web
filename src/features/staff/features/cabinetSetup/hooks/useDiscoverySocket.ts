import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SlaveInfo {
  slaveId: number;
  availableSlots: number;
}

interface DiscoveryResult {
  macAddress: string;
  slaves: SlaveInfo[];
  timestamp: string;
}

export function useDiscoverySocket(macAddress: string | undefined) {
  const [discoveryResult, setDiscoveryResult] = useState<DiscoveryResult | null>(null);
  const [setupProgress, setSetupProgress] = useState<any | null>(null);
  const [setupResult, setSetupResult] = useState<any | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!macAddress) return;

    const normalizedMac = macAddress.toUpperCase();
    
    // Initialize socket
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    console.log(`[Socket] Connecting to ${baseUrl}/hardware for MAC: ${normalizedMac}`);
    
    const socket = io(`${baseUrl}/hardware`, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log(`[Socket] Connected to hardware namespace. ID: ${socket.id}`);
      setIsConnected(true);
      
      // Join room for this MAC address
      console.log(`[Socket] Emitting join_discovery for: ${normalizedMac}`);
      socket.emit("join_discovery", { macAddress: normalizedMac }, (ack: any) => {
        console.log("[Socket] Join discovery acknowledged:", ack);
      });
    });

    socket.on("connect_error", (error) => {
      console.error("[Socket] Connection error:", error);
      setIsConnected(false);
    });

    socket.on("joined_discovery", (data) => {
      console.log("[Socket] Server confirms joined discovery room:", data);
    });

    socket.on("disconnect", (reason) => {
      console.log(`[Socket] Disconnected. Reason: ${reason}`);
      setIsConnected(false);
    });

    socket.on("discovery_result", (data: DiscoveryResult) => {
      console.log("[Socket] << Received discovery_result event:", data);
      setDiscoveryResult(data);
    });

    // [NEW] Setup flow listeners
    socket.on("setup_progress", (data: any) => {
      console.log("[Socket] << Received setup_progress event:", data);
      setSetupProgress(data);
    });

    socket.on("setup_result", (data: any) => {
      console.log("[Socket] << Received setup_result event:", data);
      setSetupResult(data);
    });

    return () => {
      if (socketRef.current) {
        console.log(`[Socket] Cleaning up. Leaving room: ${normalizedMac}`);
        socketRef.current.emit("leave_discovery", { macAddress: normalizedMac });
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [macAddress]);

  const resetDiscovery = () => {
    console.log("[Socket] Manually resetting socket results");
    setDiscoveryResult(null);
    setSetupProgress(null);
    setSetupResult(null);
  }

  return { 
    discoveryResult, 
    setupProgress, 
    setupResult, 
    isConnected, 
    resetDiscovery 
  };
}
