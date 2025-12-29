import { QrCode } from "lucide-react";
import appStoreBadge from "@/assets/app-store.svg";
import googlePlayBadge from "@/assets/gg-play.svg";

export const DownloadAppSection = () => {
  return (
    <section id="download-app" className="container py-6 sm:py-8">
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl p-6 sm:p-8 border border-primary/20 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
          {/* Left Side - Text and Badges */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Tải Ứng Dụng Ngay
            </h2>
            <p className="text-muted-foreground">
              Trải nghiệm đầy đủ các tính năng của Lockerly trên điện thoại di động
            </p>

            {/* App Store Badges */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start pt-2">
              <a
                href="#"
                className="inline-block hover:opacity-80 transition-opacity"
                aria-label="Download on the App Store"
              >
                <img
                  src={appStoreBadge}
                  alt="Download on the App Store"
                  className="h-20 w-auto"
                />
              </a>
              <a
                href="#"
                className="inline-block hover:opacity-80 transition-opacity"
                aria-label="Get it on Google Play"
              >
                <img
                  src={googlePlayBadge}
                  alt="Get it on Google Play"
                  className="h-20 w-auto"
                />
              </a>
            </div>
          </div>

          {/* Right Side - Compact QR Codes */}
          <div className="flex gap-4">
            {/* Web App QR */}
            {/* <div className="bg-background rounded-lg p-4 shadow-md border border-border text-center">
              <h3 className="font-semibold text-xs mb-2">Web App</h3>
              <div className="w-24 h-24 bg-muted rounded flex items-center justify-center border border-dashed border-border">
                <QrCode className="w-12 h-12 text-muted-foreground/50" />
              </div>
            </div> */}

            {/* Mobile App QR */}
            <div className="bg-background rounded-lg p-4 shadow-md border border-border text-center">
              <h3 className="font-semibold text-xs mb-2">Mobile App</h3>
              <div className="w-24 h-24 bg-muted rounded flex items-center justify-center border border-dashed border-border">
                <QrCode className="w-12 h-12 text-muted-foreground/50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

