import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Icon } from "@/shared/components/ui/icon";
import benefitsImage from "@/assets/landing-1.jpg";

interface BenefitsProps {
  icon: string;
  title: string;
  description: string;
}

const benefitList: BenefitsProps[] = [
  {
    icon: "BadgeCheck",
    title: "Tủ Thông Minh Tiện Lợi",
    description:
      "Nhận hàng thông qua AI nhận diện khuôn mặt để mở khóa.",
  },
  {
    icon: "LineChart",
    title: "Xóa Bỏ Sự Hỗn Loạn Giao Hàng",
    description:
      "Không còn hàng bị nhỡ, bị mất cắp hoặc phải nhờ hàng xóm. Lưu trữ tập trung và an toàn cho tất cả các gói hàng của bạn.",
  },
  {
    icon: "Wallet",
    title: "Thanh Toán Thông Minh Tự Động",
    description:
      "Chỉ trả phí cho thời gian lưu trữ thực tế. Hệ thống tự động tính phí và trừ vào ví của bạn—không cần thao tác thanh toán thủ công.",
  },
  {
    icon: "Sparkle",
    title: "Truy Cập 24/7 & An Toàn",
    description:
      "Truy cập gói hàng của bạn bất cứ lúc nào, ngày hay đêm. Bảo mật cao cấp với nhận diện khuôn mặt và giám sát thời gian thực đảm bảo hàng hóa của bạn an toàn.",
  },
];

export const BenefitsSection = () => {
  return (
    <section id="benefits" className="container py-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Side - Text Content and Image */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="text-lg text-primary mb-2 tracking-wider">Lợi Ích</h2>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Tại Sao Chọn Lockerly?
              </h2>
              <p className="text-muted-foreground mb-6">
                Trải nghiệm tương lai của giao nhận hàng hóa. Lockerly thay đổi cách bạn nhận hàng 
                với công nghệ AI tiên tiến, loại bỏ những rắc rối của phương thức giao hàng truyền thống 
                và tạo ra trải nghiệm mượt mà, an toàn.
              </p>
            </div>
            
            {/* Small Image */}
            <div className="rounded-xl overflow-hidden shadow-lg border border-border/50">
              <img
                src={benefitsImage}
                alt="Lockerly Smart Locker Benefits"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Right Side - Benefits Cards Grid */}
          <div className="lg:col-span-7">
            <div className="grid sm:grid-cols-2 gap-4">
              {benefitList.map(({ icon, title, description }, index) => (
                <Card
                  key={title}
                  className="bg-muted/50 dark:bg-card hover:bg-background transition-all delay-75 group/number"
                >
                  <CardHeader>
                    <div className="flex justify-between">
                      <Icon
                        name={icon}
                        size={32}
                        className="mb-6 text-primary"
                      />
                      <span className="text-5xl text-muted-foreground/15 font-medium transition-all delay-75 group-hover/number:text-muted-foreground/30">
                        0{index + 1}
                      </span>
                    </div>

                    <CardTitle>{title}</CardTitle>
                  </CardHeader>

                  <CardContent className="text-muted-foreground">
                    {description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

