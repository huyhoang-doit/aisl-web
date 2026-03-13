/** Variant màu của Badge (dùng chung) — thêm variant mới trong ui/badge.tsx nếu cần */
export type StatusVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "warning"   // vàng/amber
  | "success"   // xanh lá
  | "info"      // xanh dương
  | "progress"; // xanh sky

/** Một entry cấu hình: label hiển thị + màu (variant) */
export type StatusEntry = { label: string; variant: StatusVariant };

/**
 * Config trạng thái dùng chung cho toàn dự án.
 * Muốn thêm trạng thái mới: thêm key (string value từ API) và { label, variant } phù hợp.
 */
export const STATUS_CONFIG: Record<string, StatusEntry> = {
  // --- User / Account ---
  ACTIVE: { label: "Hoạt động", variant: "success" },
  INACTIVE: { label: "Không hoạt động", variant: "secondary" },
  BLOCKED: { label: "Đã khóa", variant: "destructive" },
  // --- Subscription (đăng ký dịch vụ) ---
  SUSPENDED: { label: "Tạm ngưng", variant: "warning" },
  EXPIRED: { label: "Hết hạn", variant: "destructive" },
  CANCELLED: { label: "Đã hủy", variant: "outline" },
  // --- Pricing order type ---
  LOGISTICS: { label: "Logistics", variant: "info" },
  PERSONAL_RENTAL: { label: "Thuê cá nhân", variant: "secondary" },
  // --- Incident Report (báo cáo sự cố) ---
  PENDING: { label: "Chờ xử lý", variant: "warning" },
  ASSIGNED: { label: "Đã phân công", variant: "info" },
  IN_PROGRESS: { label: "Đang xử lý", variant: "progress" },
  RESOLVED: { label: "Đã xử lý", variant: "success" },
  CLOSED: { label: "Đã đóng", variant: "destructive" },
  // --- Technical Task (task bảo trì) ---
  OPEN: { label: "Chưa bắt đầu", variant: "warning" },
  COMPLETED: { label: "Hoàn thành", variant: "success" },
};

/** Giá trị trạng thái user (giữ cho tương thích) */
export type StatusValue = "ACTIVE" | "INACTIVE" | "BLOCKED";

export const STATUS_VALUES = Object.keys(STATUS_CONFIG) as string[];

/**
 * Chuẩn hóa status từ API (string hoặc object { value/code }) thành key string (UPPERCASE).
 */
export function normalizeStatus(status?: string | Record<string, unknown>): string {
  if (!status) return "ACTIVE";
  if (typeof status === "string") return status.toUpperCase();
  const value = (status as Record<string, unknown>)?.value ?? (status as Record<string, unknown>)?.code;
  const str = typeof value === "string" ? value.toUpperCase() : "ACTIVE";
  return str;
}

/**
 * Lấy cấu hình hiển thị (label + variant) cho một status.
 * Nếu không có trong config thì trả về fallback (hiển thị đúng value, variant secondary).
 */
export function getStatusEntry(status?: string | Record<string, unknown>): StatusEntry {
  const key = normalizeStatus(status);
  return STATUS_CONFIG[key] ?? { label: key || "—", variant: "secondary" };
}
