/**
 * Hook useFcmToken
 * Hỗ trợ lấy FCM Token từ Firebase và đăng ký thiết bị lên hệ thống Backend.
 * Được tích hợp trong hệ thống quản trị AISL Web Portal.
 */
import { useCallback } from "react";
import { getToken } from "firebase/messaging";
import { messaging } from "@/shared/configs/firebase";
import { getDeviceInfo } from "../utils/device";
import { axiosInstance } from "@/shared/lib/api/axios-instance";

export const useFcmToken = (
  jwt: string | null,
) => {
  const registerFcmToken = useCallback(async () => {
    if (!jwt) return false;
    try {
      console.log("Requesting notification permission...");
      const permission = await Notification.requestPermission();
      console.log("Permission status:", permission);
      
      if (permission !== "granted") {
        console.warn("Notification permission denied.");
        return false;
      }

      console.log("Getting FCM token...");
      const fcmToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      
      if (!fcmToken) {
        console.error("Failed to generate FCM token.");
        return false;
      }
      
      console.log("FCM Token generated:", fcmToken);

      // Use centralized getDeviceInfo() — same source as Login.tsx
      // This ensures deviceId is consistent across login and FCM registration
      const deviceInfo = await getDeviceInfo();
      const payload = {
        ...deviceInfo,
        fcmToken, // Override fcmToken from getDeviceInfo (which may be undefined) with the fresh one
      };

      await axiosInstance.post('/users/device', payload);
      console.log("Device info registered on backend.");
      
      return true;
    } catch (error) {
      console.error("FCM registration error:", error);
      // intentionally ignore FCM registration errors
      return false;
    }
  }, [jwt]);
  return registerFcmToken;
};
