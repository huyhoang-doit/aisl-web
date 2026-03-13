import FingerprintJS from '@fingerprintjs/fingerprintjs';
import type { DeviceInfo } from '@/features/auth/types/auth.types';
import { getToken } from "firebase/messaging";
import { messaging } from "@/shared/configs/firebase";

const DEVICE_ID_KEY = 'device_id';

/**
 * Get or generate a unique Device ID using FingerprintJS
 * Caches the result in localStorage
 */
export const getDeviceId = async (): Promise<string> => {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);

  if (!deviceId) {
    try {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      deviceId = result.visitorId;
      localStorage.setItem(DEVICE_ID_KEY, deviceId);
    } catch (error) {
      console.error('Failed to generate device ID:', error);
      // Fallback to random UUID if FingerprintJS fails
      deviceId = crypto.randomUUID();
      localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
  }

  return deviceId;
};

/**
 * Get current FCM token if available
 */
export const getFcmToken = async (): Promise<string | undefined> => {
  try {
    // Check if notification permission is granted before trying to get token
    if (Notification.permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      return token;
    }
  } catch (error) {
    console.error('Error retrieving FCM token:', error);
  }
  return undefined;
};

/**
 * Collect all device information
 */
export const getDeviceInfo = async (): Promise<DeviceInfo> => {
  const deviceId = await getDeviceId();
  const fcmToken = await getFcmToken();

  return {
    deviceId,
    userAgent: navigator.userAgent,
    platform: navigator.platform, // Note: navigator.platform is deprecated but still widely supported. Consider navigator.userAgentData for modern approach if needed.
    fcmToken,
    // ipAddress is usually best obtained by the server from the request socket/headers
  };
};
