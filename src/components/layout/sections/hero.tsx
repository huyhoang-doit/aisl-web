import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import HeroRight from "./hero-right";

export const HeroSection = () => {
  return (
    <section className="container w-full relative overflow-hidden">
      {/* Gradient orb trung tâm duy nhất - mềm mại, không tách biệt */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] sm:w-[800px] sm:h-[600px] md:w-[1000px] md:h-[800px] rounded-full blur-3xl -z-10"
        style={{
          background:
            "radial-gradient(circle, oklch(0.7686 0.1647 70.0804 / 0.12), oklch(0.7686 0.1647 70.0804 / 0.06), transparent 70%)",
        }}
      />

      <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center py-6 sm:py-10 md:py-12 lg:py-10 relative z-10 px-4 sm:px-6">
        {/* Left side: Text content and CTA */}
        <div className="space-y-4 sm:space-y-6 md:space-y-8 text-center lg:text-left order-2 lg:order-1">
          <Badge
            variant="outline"
            className="text-xs sm:text-sm py-1.5 sm:py-2 inline-flex"
          >
            <span className="mr-1.5 sm:mr-2 text-primary">
              <Badge className="text-xs">AI-Powered</Badge>
            </span>
            <span className="text-xs sm:text-sm"> Giải Pháp Tủ Thông Minh </span>
          </Badge>

          <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight px-2 sm:px-0">
            <h1 className="whitespace-normal break-words">
              Trải Nghiệm
              <span className="text-transparent px-1 sm:px-2 bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text block sm:inline">
                Lockerly
              </span>
              <span className="block sm:inline"> Giao Nhận Thông Minh</span>
            </h1>
          </div>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 px-4 sm:px-0">
            {`Tương lai của giao nhận hàng hóa. Với công nghệ nhận diện khuôn mặt AI. 
            An toàn, tự động hóa và tiện lợi cho cuộc sống hiện đại.`}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-4 sm:px-0">
            <Button
              size="lg"
              className="font-bold group/arrow text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto"
            >
              Bắt Đầu Sử Dụng
              <ArrowRight className="size-4 sm:size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="font-bold text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto"
            >
              Tìm Hiểu Thêm
            </Button>
          </div>
        </div>

        {/* Right side: Hero Image */}
        <div className="flex justify-center lg:justify-end items-center order-1 lg:order-2 px-2 sm:px-0">
          <HeroRight />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-16 sm:h-20 md:h-28 bg-gradient-to-b from-background/0 via-background/50 to-background rounded-lg"></div>
    </section>
  );
};
