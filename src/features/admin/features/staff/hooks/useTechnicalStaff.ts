/**
 * Hook lấy danh sách nhân viên kỹ thuật
 */
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { Staff } from "../types/staff.types";
import { staffService } from "../services/staff.service";

export interface UseTechnicalStaffReturn {
  staffList: Staff[];
  isLoading: boolean;
  refetch: () => void;
}

export function useTechnicalStaff(): UseTechnicalStaffReturn {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadStaff = useCallback(async () => {
    try {
      setIsLoading(true);
      const list = await staffService.getTechnicalStaff({ limit: 100 });
      setStaffList(list);
    } catch (error) {
      console.error("Error loading technical staff:", error);
      toast.error("Có lỗi xảy ra khi tải danh sách nhân viên kỹ thuật");
      setStaffList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStaff();
  }, [loadStaff, refreshKey]);

  const refetch = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return {
    staffList,
    isLoading,
    refetch,
  };
}
