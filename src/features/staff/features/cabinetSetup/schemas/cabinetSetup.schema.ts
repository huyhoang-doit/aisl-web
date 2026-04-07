import { z } from "zod";

export const basicInfoSchema = z.object({
  locationId: z.string().min(1, "Vui lòng chọn Location"),
  cabinetId: z.string().min(1, "Vui lòng chọn Cabinet"),
  macAddress: z.string().regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, "MAC Address không hợp lệ (VD: DC:A6:32:00:00:00)"),
});

export const layoutSchema = z.object({
  totalRows: z.number().min(1, "Số hàng bét nhất là 1").max(10, "Số hàng tối đa là 10"),
  totalColumns: z.number().min(1, "Số cột thấp nhất là 1").max(10, "Số cột tối đa là 10"),
  heartbeatInterval: z.number().min(10, "Heartbeat interval tối thiểu 10s").max(300, "Heartbeat interval tối đa 300s"),
  openDoorTimeout: z.number().min(1, "Open door timeout tối thiểu 1s").max(60, "Open door timeout tối đa 60s"),
});

export const setupCabinetSchema = z.object({
  ...basicInfoSchema.shape,
  ...layoutSchema.shape,
  deviceAttachmentIds: z.array(z.string()).optional(),
});

export type BasicInfoFormValues = z.infer<typeof basicInfoSchema>;
export type LayoutFormValues = z.infer<typeof layoutSchema>;
export type SetupCabinetFormValues = z.infer<typeof setupCabinetSchema>;
