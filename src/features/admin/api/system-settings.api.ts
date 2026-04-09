import { api } from "@/shared/lib/api/client";

export interface MqttSettingsResponse {
    host: string;
    port: number;
    username?: string;
    password?: string;
    useTls: boolean;
}

export const systemSettingsApi = {
    getMqttSettings: () => api.get<MqttSettingsResponse>("/settings/mqtt"),
};
