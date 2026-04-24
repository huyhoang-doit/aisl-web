import { Link } from "react-router-dom";
import { ArrowLeft, Keyboard, QrCode } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { KioskScreenLayout } from "../components/KioskScreenLayout";

/**
 * Trang Mở Tủ tại Kiosk.
 * Lựa chọn mở bằng mã OTP hoặc QR code.
 */
const KioskOpenPage = () => (
  <KioskScreenLayout>
    <Button asChild variant="ghost" className="self-start min-h-[56px] text-lg mb-8 hover:bg-transparent -ml-4">
      <Link to="/kiosk/home" className="flex items-center gap-2">
        <ArrowLeft className="size-6" /> Quay lại
      </Link>
    </Button>

    <div className="flex-1 flex flex-col gap-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">Mở tủ Locker</h1>
        <p className="text-lg text-muted-foreground">Chọn phương thức để mở tủ của bạn</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Button 
          asChild 
          className="min-h-[140px] rounded-3xl flex flex-col gap-3 py-6 shadow-xl shadow-primary/10 border-2 border-primary/20 bg-card hover:bg-primary/5 text-foreground"
          variant="outline"
        >
          <Link to="/kiosk/input-otp">
            <Keyboard className="size-12 text-primary" />
            <div className="text-center">
              <p className="text-2xl font-bold">Nhập mã truy cập</p>
              <p className="text-sm text-muted-foreground mt-1">Dành cho mã số gửi qua SMS/Email</p>
            </div>
          </Link>
        </Button>

        <Button 
          disabled
          className="min-h-[140px] rounded-3xl flex flex-col gap-3 py-6 opacity-60 grayscale border-2 border-dashed"
          variant="outline"
        >
          <div className="flex flex-col items-center">
            <QrCode className="size-12 text-muted-foreground" />
            <div className="text-center">
              <p className="text-2xl font-bold">Quét mã QR</p>
              <p className="text-sm text-muted-foreground mt-1">Tính năng đang phát triển</p>
            </div>
          </div>
        </Button>
      </div>
    </div>

    <div className="py-8 text-center text-sm text-muted-foreground">
      Gặp sự cố? Liên hệ hotline: 1900 xxxx
    </div>
  </KioskScreenLayout>
);

export default KioskOpenPage;
