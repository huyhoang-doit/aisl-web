import landingImage from "@/assets/landing-2.jpg";
import { ScanFace, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroRight() {
  return (
    <div className="relative w-full max-w-2xl mx-auto lg:mx-0 perspective-1000">
      {/* Main Image Container */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] shadow-primary/20 border border-border/50 group transition-all duration-700 bg-card/30 backdrop-blur-sm p-2 z-20"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent z-10" />
        
        {/* Main Image */}
        <div className="relative overflow-hidden rounded-xl bg-muted">
          <img
            src={landingImage}
            alt="Lockerly Smart Locker System"
            className="w-full h-auto object-cover aspect-[4/3] lg:aspect-square transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          />
          <div className="absolute inset-0 border border-primary/20 rounded-xl mix-blend-overlay"></div>
          
          {/* Scanning line effect */}
          <motion.div 
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-0.5 bg-primary/60 shadow-[0_0_15px_oklch(0.7686_0.1647_70.0804)] z-20"
          />
        </div>
      </motion.div>

      {/* Floating Badges */}
      <motion.div 
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="hidden lg:flex absolute top-10 -left-8 z-30"
      >
        <div className="bg-background/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-primary/20 rounded-xl p-3 flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <ScanFace className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">Face ID AI</div>
            <div className="text-sm font-bold">Xác thực thành công</div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="hidden lg:flex absolute bottom-24 -right-8 z-30"
      >
        <div className="bg-background/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-primary/20 rounded-xl p-3 flex items-center gap-3">
          <div className="bg-green-500/10 p-2 rounded-lg">
            <Activity className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">Hệ thống IoT</div>
            <div className="text-sm font-bold text-green-500">Online & Sẵn sàng</div>
          </div>
        </div>
      </motion.div>

      {/* Decorative Gradient Orbs */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/30 rounded-full blur-[50px] z-0 hidden lg:block animate-pulse" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-500/20 rounded-full blur-[60px] z-0 hidden lg:block animate-pulse delay-1000" />
    </div>
  );
}

