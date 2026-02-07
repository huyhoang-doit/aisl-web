/** Các giá trị trạng thái dùng chung (user, tài khoản, ...) */
export type StatusValue = "ACTIVE" | "INACTIVE" | "BLOCKED";

/** Variant màu của Badge */
export type StatusVariant = "default" | "secondary" | "destructive" | "outline";

/** Cấu hình hiển thị theo từng trạng thái */
export const STATUS_CONFIG: Record<StatusValue, { label: string; variant: StatusVariant }> = {
  ACTIVE: { label: "Hoạt động", variant: "default" },
  INACTIVE: { label: "Không hoạt động", variant: "secondary" },
  BLOCKED: { label: "Đã khóa", variant: "destructive" },
};

export const STATUS_VALUES = Object.keys(STATUS_CONFIG) as StatusValue[];

export function normalizeStatus(status?: string | Record<string, unknown>): StatusValue {
  if (!status) return "ACTIVE";
  if (typeof status === "string") return status as StatusValue;
  const value = (status as Record<string, unknown>)?.value ?? (status as Record<string, unknown>)?.code;
  const str = typeof value === "string" ? value : "ACTIVE";
  return STATUS_VALUES.includes(str as StatusValue) ? (str as StatusValue) : "ACTIVE";
}
