/**
 * Hook lấy danh sách roles từ API /roles
 */
import { useState, useEffect, useCallback } from "react";
import { userService, type Role } from "../services/user.service";

export interface UseRolesReturn {
  roles: Role[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useRoles(): UseRolesReturn {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRoles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userService.getRoles();
      setRoles(response.data?.roles ?? []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load roles"));
      setRoles([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return { roles, isLoading, error, refetch: fetchRoles };
}
