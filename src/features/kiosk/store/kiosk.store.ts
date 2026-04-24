import { create } from "zustand";
import { persist } from "zustand/middleware";

interface KioskState {
  // Current Kiosk personality
  locationId: string | null;
  cabinetId: string | null;
  
  // Actions
  setKioskIdentity: (locationId: string, cabinetId: string) => void;
  resetKioskIdentity: () => void;
}

/**
 * Store dành riêng cho Kiosk để lưu cấu hình "Kiosk này ở đâu".
 * Sử dụng persist để lưu vào localStorage, tránh việc reset khi refresh trang.
 */
export const useKioskStore = create<KioskState>()(
  persist(
    (set) => ({
      locationId: null,
      cabinetId: null,
      
      setKioskIdentity: (locationId, cabinetId) => set({ locationId, cabinetId }),
      resetKioskIdentity: () => set({ locationId: null, cabinetId: null }),
    }),
    {
      name: "kiosk-storage",
    }
  )
);
