import { api } from "@/shared/lib/api/client";

export interface MqttSettingsResponse {
    host: string;
    port: number;
    username?: string;
    password?: string;
    useTls: boolean;
}

export interface AiSystemConfigResponse {
    success?: boolean;
    settings?: Record<string, any>;
    [key: string]: any;
}

export interface AiSystemConfigPatchPayload {
    settings: Record<string, any>;
}

export const systemSettingsApi = {
    getMqttSettings: () => api.get<MqttSettingsResponse>("/settings/mqtt"),
    getAiSystemConfig: () => api.get<AiSystemConfigResponse>("/auth/ai/system-config"),
    updateAiSystemConfig: (data: AiSystemConfigPatchPayload) => api.patch<any>("/auth/ai/system-config", data),
};

