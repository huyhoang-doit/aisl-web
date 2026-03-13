import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Command, ArrowLeft, Delete } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { KioskScreenLayout } from "../components/KioskScreenLayout";
import { cn } from "@/shared/lib/utils";

const OTP_LENGTH = 6;
const KEYPAD_ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["backspace", "0", "confirm"],
] as const;

/**
 * Màn hình nhập OTP tại Kiosk.
 * Gồm ô hiển thị mã OTP (6 số) + bàn phím số ảo lớn để thao tác chạm.
 */
const KioskInputOTPPage = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string>("");

  const appendDigit = useCallback((digit: string) => {
    setOtp((prev) => (prev.length < OTP_LENGTH ? prev + digit : prev));
  }, []);

  const removeDigit = useCallback(() => {
    setOtp((prev) => prev.slice(0, -1));
  }, []);

  const handleKeypadPress = useCallback(
    (key: string) => {
      if (key === "backspace") {
        removeDigit();
        return;
      }
      if (key === "confirm") {
        if (otp.length === OTP_LENGTH) {
          // TODO: gửi OTP lên server / xác thực
          navigate(-1);
        }
        return;
      }
      if (/^\d$/.test(key)) {
        appendDigit(key);
      }
    },
    [otp.length, appendDigit, removeDigit, navigate]
  );

  const canConfirm = otp.length === OTP_LENGTH;

  return (
    <KioskScreenLayout>
        {/* Nút quay lại */}
        <Button
          asChild
          variant="ghost"
          className="self-start min-h-[52px] text-lg rounded-xl text-muted-foreground hover:text-foreground mb-2"
        >
          <Link to="/kiosk/home" className="flex items-center gap-2">
            <ArrowLeft className="size-6" />
            Quay lại
          </Link>
        </Button>

        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25">
            <Command className="size-7" strokeWidth={2} />
          </div>
          <span className="text-2xl font-bold text-foreground tracking-tight">
            Lockerly
          </span>
        </div>

        {/* Tiêu đề */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Nhập mã OTP
          </h1>
          <p className="text-base text-muted-foreground">
            Mã gồm 6 chữ số đã gửi đến số điện thoại / email của bạn
          </p>
        </div>

        {/* Ô hiển thị OTP - 6 ô */}
        <div className="flex justify-center gap-2 sm:gap-3 mb-8">
          {Array.from({ length: OTP_LENGTH }, (_, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center justify-center w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 text-2xl sm:text-3xl font-bold tabular-nums transition-colors",
                otp[i] !== undefined
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-muted/50 text-muted-foreground"
              )}
            >
              {otp[i] ?? ""}
            </div>
          ))}
        </div>

        {/* Bàn phím số ảo - nút to cho cảm ứng */}
        <div className="flex flex-col gap-2 flex-1">
          {KEYPAD_ROWS.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="grid gap-2"
              style={{
                gridTemplateColumns:
                  row[0] === "backspace"
                    ? "1fr 1fr 1fr"
                    : "repeat(3, 1fr)",
              }}
            >
              {row.map((key) => {
                if (key === "backspace") {
                  return (
                    <button
                      key="backspace"
                      type="button"
                      onClick={() => handleKeypadPress("backspace")}
                      className="min-h-[64px] rounded-2xl border-2 border-border bg-muted/50 hover:bg-muted hover:border-primary/30 active:scale-[0.98] transition-all flex items-center justify-center"
                    >
                      <Delete className="size-8 text-muted-foreground" />
                    </button>
                  );
                }
                if (key === "confirm") {
                  return (
                    <button
                      key="confirm"
                      type="button"
                      onClick={() => handleKeypadPress("confirm")}
                      disabled={!canConfirm}
                      className={cn(
                        "min-h-[64px] rounded-2xl font-semibold text-lg transition-all active:scale-[0.98]",
                        canConfirm
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      )}
                    >
                      Xác nhận
                    </button>
                  );
                }
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleKeypadPress(key)}
                    className="min-h-[64px] rounded-2xl border-2 border-border bg-card hover:bg-primary/10 hover:border-primary/30 active:scale-[0.98] transition-all text-2xl font-semibold"
                  >
                    {key}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
    </KioskScreenLayout>
  );
};

export default KioskInputOTPPage;
