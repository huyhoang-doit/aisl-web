import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Icon } from "@/shared/components/ui/icon";

interface FeaturesProps {
  icon: string;
  title: string;
  description: string;
}

const featureList: FeaturesProps[] = [
  {
    icon: "ScanFace",
    title: "Bảo Mật Đa Lớp & Sinh Trắc Học",
    description:
      "Công nghệ nhận diện khuôn mặt để nhận hàng an toàn, không tiếp xúc với xác thực nhiều lớp. Hỗ trợ FaceID và phương thức dự phòng (Password/OTP).",
  },
  {
    icon: "Wallet",
    title: "Ví Điện Tử & Thanh Toán Tự Động",
    description:
      "Tính phí dựa trên thời gian lưu trữ thực tế, tự động trừ vào ví đã nạp trước. Không cần thao tác thanh toán thủ công.",
  },
  {
    icon: "Package",
    title: "Phân Bổ Tủ Thông Minh",
    description:
      "Tự động phân bổ tủ tối ưu dựa trên kích cỡ gói hàng và tình trạng sẵn có. Hỗ trợ Load Balancing để giảm hao mòn cục bộ.",
  },
  {
    icon: "Activity",
    title: "Giám Sát IoT Theo Thời Gian Thực",
    description:
      "Giám sát liên tục trạng thái tủ, điều kiện gói hàng và sức khỏe hệ thống qua cảm biến IoT. Cảnh báo tức thì khi có sự cố.",
  },
  {
    icon: "Calendar",
    title: "Hệ Thống Đặt Chỗ Trước",
    description:
      "Đặt trước slot tủ cho các giao hàng đã lên lịch với phân bổ không gian an toàn. Hỗ trợ đặt lịch linh hoạt.",
  },
  {
    icon: "Users",
    title: "Ủy Quyền Thông Minh & Chuyển Trách Nhiệm",
    description:
      "Ủy quyền nhận hàng với chuyển trách nhiệm tài chính tự động. Hỗ trợ ủy quyền cho người dùng hệ thống hoặc người ngoài hệ thống.",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="container py-8 sm:py-12">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Tính Năng
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        Tính Năng Mạnh Mẽ Cho Cuộc Sống Hiện Đại
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        Trải nghiệm thế hệ tiếp theo của công nghệ tủ thông minh. Từ nhận diện khuôn mặt AI 
        đến thanh toán tự động, Lockerly mang lại sự tiện lợi và an toàn trong một giải pháp hoàn chỉnh.
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featureList.map(({ icon, title, description }) => (
          <div key={title}>
            <Card className="h-full bg-background border-0 shadow-none">
              <CardHeader className="flex justify-center items-center">
                <div className="bg-primary/20 p-2 rounded-full ring-8 ring-primary/10 mb-4">
                  <Icon
                    name={icon}
                    size={24}
                    className="text-primary w-6 h-6"
                  />
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground text-center">
                {description}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};

