import DiscordIcon from "@/shared/components/icons/discord-icon";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import communityImage1 from "@/assets/landing-4.jpg";
import communityImage2 from "@/assets/landing-5.jpg";

export const CommunitySection = () => {
  return (
    <section id="community" className="py-8">
      <hr className="border-secondary" />
      <div className="container py-8 sm:py-10">
        {/* Images Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-xl border border-border/50 group hover:shadow-2xl transition-all duration-500">
            <img
              src={communityImage1}
              alt="Lockerly Community Experience"
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl border border-border/50 group hover:shadow-2xl transition-all duration-500">
            <img
              src={communityImage2}
              alt="Lockerly Smart Locker System"
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        <div className="lg:w-[60%] mx-auto">
          <Card className="bg-background border-none shadow-none text-center flex flex-col items-center justify-center">
            <CardHeader>
              <CardTitle className="text-4xl md:text-5xl font-bold flex flex-col items-center">
                {/* <DiscordIcon /> */}
                <div>
                  Sẵn sàng trải nghiệm
                  <span className="text-transparent pl-2 bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text">
                    Lockerly?
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="lg:w-[80%] text-xl text-muted-foreground">
              Thay đổi cách bạn nhận hàng. Tham gia cùng hàng nghìn cư dân và quản lý tài sản 
              đã nâng cấp lên giao nhận hàng thông minh, không cần thiết bị. Bắt đầu ngay hôm nay! 🚀
            </CardContent>

            <CardFooter>
              <Button asChild>
                <a href="#contact" rel="noopener noreferrer">
                  Bắt Đầu Ngay
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <hr className="border-secondary" />
    </section>
  );
};

