import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Command, LogIn } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { KioskScreenLayout } from "../components/KioskScreenLayout";
import { useKioskStore } from "../store/kiosk.store";

/**
 * Màn hình chào tại Kiosk - hiển thị khi người dùng đến.
 * Thiết kế cho màn hình dọc (portrait), nút bấm to dễ thao tác (tương tự iPad mini).
 */
const KioskWelcomePage = () => {
  const [searchParams] = useSearchParams();
  const { setKioskIdentity } = useKioskStore();

  useEffect(() => {
    const locId = searchParams.get("locationId");
    const cabId = searchParams.get("cabinetId");
    if (locId && cabId) {
      setKioskIdentity(locId, cabId);
    }
  }, [searchParams, setKioskIdentity]);

  return (
    <KioskScreenLayout className="items-center justify-center py-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25">
            <Command className="size-10" strokeWidth={2} />
          </div>
          <span className="text-4xl font-bold text-foreground tracking-tight">
            Lockerly
          </span>
        </div>

        {/* Lời chào */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-3">
          Chào mừng bạn đến
        </h1>
        <p className="text-xl sm:text-2xl text-muted-foreground text-center mb-14">
          Hệ thống tủ locker thông minh
        </p>

        {/* Nút Đăng nhập - kích thước lớn cho thao tác tại kiosk */}
        <Button
          asChild
          size="lg"
          className="w-full min-h-[80px] text-2xl font-semibold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
        >
          <Link to="/kiosk/login" className="flex items-center justify-center gap-3">
            <LogIn className="size-8" strokeWidth={2} />
            Đăng nhập
          </Link>
        </Button>

      {/* Footer nhẹ */}
      <div className="py-4 text-center text-sm text-muted-foreground">
        Chạm để bắt đầu
      </div>
    </KioskScreenLayout>
  );
};

export default KioskWelcomePage;
