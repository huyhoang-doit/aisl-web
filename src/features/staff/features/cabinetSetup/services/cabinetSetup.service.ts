import { api } from "@/shared/lib/api/client";
import type { SetupCabinetRequest, SetupCabinetResponse } from "../types/cabinetSetup.types";

export const cabinetSetupService = {
  setupCabinet: async (data: SetupCabinetRequest): Promise<SetupCabinetResponse> => {
    return api.post<SetupCabinetResponse>("/cabinets/setup", data);
  },
};
