import { Link } from "react-router-dom";
import { Command, Package, LockOpen, Send } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { KioskScreenLayout } from "../components/KioskScreenLayout";

/**
 * Trang chủ Kiosk - hiển thị sau khi vào màn hình chính (sau bước đăng nhập).
 * Giới thiệu ngắn + các lựa chọn thao tác: Thuê Tủ, Mở tủ, Gửi đồ.
 */
const KioskHomePage = () => {
  const actions = [
    {
      to: "/kiosk/rent",
      label: "Thuê Tủ",
      icon: Package,
      description: "Đăng ký thuê tủ locker",
    },
    {
      to: "/kiosk/open",
      label: "Mở tủ",
      icon: LockOpen,
      description: "Mở tủ bằng mã hoặc thẻ",
    },
    {
      to: "/kiosk/send",
      label: "Gửi đồ",
      icon: Send,
      description: "Gửi đồ vào tủ",
    },
  ] as const;

  return (
    <KioskScreenLayout className="py-8">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25">
            <Command className="size-8" strokeWidth={2} />
          </div>
          <span className="text-3xl font-bold text-foreground tracking-tight">
            Lockerly
          </span>
        </div>

        {/* Giới thiệu đơn giản */}
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Trang chủ Kiosk
          </h1>
          <p className="text-lg text-muted-foreground">
            Chọn thao tác bạn muốn thực hiện
          </p>
        </div>

        {/* Các nút lựa chọn thao tác - kích thước lớn cho kiosk */}
        <div className="flex flex-col gap-4">
          {actions.map(({ to, label, icon: Icon, description }) => (
            <Button
              key={to}
              asChild
              variant="outline"
              className="w-full min-h-[88px] rounded-2xl border-2 border-primary/30 bg-card hover:bg-primary/10 hover:border-primary/50 shadow-md text-left justify-start gap-4 px-6 py-4"
            >
              <Link to={to} className="flex items-center gap-4 no-underline">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <Icon className="size-7" strokeWidth={2} />
                </div>
                <div className="flex flex-col items-start min-w-0">
                  <span className="text-xl font-semibold text-foreground">
                    {label}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {description}
                  </span>
                </div>
              </Link>
            </Button>
          ))}
        </div>

      <div className="py-4 text-center text-sm text-muted-foreground">
        Chạm để chọn thao tác
      </div>
    </KioskScreenLayout>
  );
};

export default KioskHomePage;
