import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { ArrowRight, Box, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";
import HeroRight from "./hero-right";

export const HeroSection = () => {
  return (
    <section className="container w-full relative overflow-hidden min-h-[90vh] flex items-center justify-center">
      {/* Dynamic Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-20" />
      
      {/* Animated Glowing Orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] sm:w-[800px] sm:h-[600px] md:w-[1000px] md:h-[800px] rounded-full blur-3xl -z-10"
        style={{
          background:
            "radial-gradient(circle, oklch(0.7686 0.1647 70.0804 / 0.15), oklch(0.7686 0.1647 70.0804 / 0.05), transparent 70%)",
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px] bg-primary/20 -z-10"
      />

      <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center py-10 relative z-10 px-4 sm:px-6 w-full">
        {/* Left side: Text content and CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 sm:space-y-8 text-center lg:text-left order-2 lg:order-1"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Badge
              variant="outline"
              className="text-xs sm:text-sm py-1.5 sm:py-2 px-4 inline-flex items-center gap-2 border-primary/30 bg-primary/5 backdrop-blur-sm"
            >
              <Zap className="w-4 h-4 text-primary animate-pulse" />
              <span className="font-medium">AI-Powered Smart Locker</span>
            </Badge>
          </motion.div>

          <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
            <h1 className="whitespace-normal break-words">
              Trải Nghiệm
              <span className="block mt-2 mb-2 text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text">
                Lockerly
              </span>
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground/90 font-bold">Giao Nhận Thông Minh</span>
            </h1>
          </div>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
            Tương lai của giao nhận hàng hóa. Tích hợp công nghệ nhận diện khuôn mặt AI, thanh toán tự động và giám sát IoT 24/7. An toàn tuyệt đối, tối ưu tiện lợi.
          </p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
          >
            <Button
              size="lg"
              className="font-bold group/arrow text-base h-14 px-8 w-full sm:w-auto shadow-[0_0_20px_oklch(0.7686_0.1647_70.0804/0.3)] hover:shadow-[0_0_30px_oklch(0.7686_0.1647_70.0804/0.5)] transition-all"
            >
              Bắt Đầu Sử Dụng
              <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="font-bold text-base h-14 px-8 w-full sm:w-auto border-primary/20 hover:bg-primary/5 backdrop-blur-sm"
            >
              Khám Phá Tính Năng
            </Button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-sm font-medium text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-500" /> Bảo mật đa lớp
            </div>
            <div className="flex items-center gap-2">
              <Box className="w-5 h-5 text-blue-500" /> Phân bổ thông minh
            </div>
          </motion.div>
        </motion.div>

        {/* Right side: Hero Image */}
        <motion.div 
          initial={{ opacity: 0, x: 30 } as any}
          animate={{ opacity: 1, x: 0 } as any}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" } as any}
          className="flex justify-center lg:justify-end items-center order-1 lg:order-2"
        >
          <HeroRight />
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none"></div>
    </section>
  );
};
