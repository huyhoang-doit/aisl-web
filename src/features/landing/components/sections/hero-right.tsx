import landingImage from "@/assets/landing-2.jpg";
import { Badge } from "@/shared/components/ui/badge";
import { ScanFace, Shield, Clock } from "lucide-react";

export default function HeroRight() {
  return (
    <div className="relative w-full max-w-2xl mx-auto lg:mx-0">
      {/* Main Image Container */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border border-border/50 group hover:shadow-primary/30 transition-all duration-500">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Main Image */}
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={landingImage}
            alt="Lockerly Smart Locker System - Hệ thống tủ thông minh với công nghệ AI"
            className="w-full h-auto object-cover aspect-[4/3] lg:aspect-square transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        
        {/* Overlay Badges - Top Left - Hidden on Mobile */}
        <div className="hidden lg:flex absolute top-4 left-4 z-20 flex-col gap-2 animate-in fade-in slide-in-from-top-4 duration-500">
          <Badge 
            variant="secondary" 
            className="bg-background/95 backdrop-blur-md shadow-lg px-3 py-1.5 hover:bg-background transition-colors border border-border/50"
          >
            <ScanFace className="w-4 h-4 mr-2 text-primary" />
            <span className="font-semibold text-sm">Nhận Diện Khuôn Mặt</span>
          </Badge>
          <Badge 
            variant="secondary" 
            className="bg-background/95 backdrop-blur-md shadow-lg px-3 py-1.5 hover:bg-background transition-colors border border-border/50"
          >
            <Shield className="w-4 h-4 mr-2 text-primary" />
            <span className="font-semibold text-sm">Bảo Mật Cao</span>
          </Badge>
        </div>

        {/* Bottom Right Badge */}
        <div className="absolute bottom-2 right-2 lg:bottom-4 lg:right-4 z-20 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
          <Badge 
            variant="secondary" 
            className="bg-background/95 backdrop-blur-md shadow-lg px-1.5 py-0.5 lg:px-3 lg:py-1.5 hover:bg-background transition-colors border border-border/50"
          >
            <Clock className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2 text-primary" />
            <span className="font-semibold text-xs lg:text-sm">Hoạt Động 24/7</span>
          </Badge>
        </div>
      </div>

      {/* Decorative Gradient Orbs */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl -z-10 hidden lg:block animate-pulse" />
      <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10 hidden lg:block animate-pulse delay-1000" />
      
      {/* Floating Stats Card - Desktop Only */}
      <div className="hidden lg:flex absolute -bottom-8 -left-8 bg-card/95 backdrop-blur-md rounded-xl shadow-xl border border-border p-4 z-30 min-w-[200px] animate-in fade-in slide-in-from-left-4 duration-700 delay-300 hover:scale-105 transition-transform">
        <div className="space-y-2 w-full">
          <div className="text-sm text-muted-foreground font-medium">Đã Phục Vụ</div>
          <div className="text-3xl font-bold text-primary">10K+</div>
          <div className="text-xs text-muted-foreground">Người Dùng Tin Tưởng</div>
        </div>
      </div>
    </div>
  );
}

