import { z } from "zod";

export const basicInfoSchema = z.object({
  locationId: z.string().min(1, "Vui lòng chọn Location"),
  macAddress: z.string().regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, "MAC Address không hợp lệ"),
});

export const cabinetItemSchema = z.object({
  cabinetId: z.string().min(1, "Vui lòng chọn Cabinet"),
  totalRows: z.number().min(1, "Số hàng tối thiểu là 1").max(10, "Số hàng tối đa là 10"),
  totalColumns: z.number().min(1, "Số cột tối thiểu là 1").max(10, "Số cột tối đa là 10"),
});

export const setupCabinetSchema = z.object({
  locationId: z.string().min(1, "Vui lòng chọn Location"),
  macAddress: z.string().min(1, "Vui lòng nhập MAC Address"),
  heartbeatInterval: z.number().min(10, "Tối thiểu 10s").max(300, "Tối đa 300s"),
  openDoorTimeout: z.number().min(1, "Tối thiểu 1s").max(60, "Tối đa 60s"),
  configurations: z.array(cabinetItemSchema).min(1, "Vui lòng chọn ít nhất 1 cabinet"),
  deviceAttachmentIds: z.array(z.string()).optional(),
});

export type BasicInfoFormValues = z.infer<typeof basicInfoSchema>;
export type CabinetItemFormValues = z.infer<typeof cabinetItemSchema>;
export type SetupCabinetFormValues = z.infer<typeof setupCabinetSchema>;
