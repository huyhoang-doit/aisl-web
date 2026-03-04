import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

/** Kích thước wrapper thống nhất cho mọi màn hình kiosk - chỉnh một chỗ áp dụng toàn bộ. */
const KIOSK_OUTER_CLASS =
  "kiosk-portrait min-h-screen w-full flex flex-col bg-gradient-background";
const KIOSK_INNER_CLASS =
  "flex-1 flex flex-col max-w-[520px] mx-auto w-full px-6 py-6";

interface KioskScreenLayoutProps {
  children: ReactNode;
  /** Class thêm cho wrapper ngoài (outer). */
  outerClassName?: string;
  /** Class thêm cho wrapper trong (content). */
  className?: string;
}

/**
 * Layout wrapper thống nhất cho các màn hình kiosk.
 * Đảm bảo kích thước/khung giống nhau, dễ chỉnh sửa tập trung sau này.
 */
const KioskScreenLayout = ({
  children,
  outerClassName,
  className,
}: KioskScreenLayoutProps) => {
  return (
    <div className={cn(KIOSK_OUTER_CLASS, outerClassName)}>
      <div className={cn(KIOSK_INNER_CLASS, className)}>{children}</div>
    </div>
  );
};

export { KioskScreenLayout, KIOSK_OUTER_CLASS, KIOSK_INNER_CLASS };
