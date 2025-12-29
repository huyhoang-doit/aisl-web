import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import servicesImage from "@/assets/landing-3.jpg";

const ProService = {
  YES: 1,
  NO: 0,
} as const;

interface ServiceProps {
  title: string;
  pro: typeof ProService.YES | typeof ProService.NO;
  description: string;
}
const serviceList: ServiceProps[] = [
  {
    title: "Thiết Lập Nhận Diện Khuôn Mặt",
    description:
      "Đăng ký dữ liệu khuôn mặt một lần để nhận hàng tức thì, không cần điện thoại tại bất kỳ tủ nào. Hỗ trợ FaceID và phương thức dự phòng.",
    pro: 0,
  },
  {
    title: "Dịch Vụ Thuê Tủ Ủy Quyền",
    description:
      "Người gửi có thể trả phí lưu trữ cơ bản trước, giúp việc giao hàng thuận tiện cho cả hai bên. Hỗ trợ ủy quyền thông minh.",
    pro: 0,
  },
  {
    title: "Gói Đăng Ký Nâng Cao",
    description: "Gói đăng ký tùy chỉnh với giá cả linh hoạt cho người dùng thường xuyên và doanh nghiệp. Hỗ trợ gói FREE và Premium.",
    pro: 0,
  },
  {
    title: "Lịch Sử Kiểm Tra & Bảo Mật",
    description: "Lịch sử giao dịch đầy đủ và nhật ký bảo mật cho tất cả hoạt động gói hàng và sự kiện truy cập. Append-only audit log.",
    pro: 1,
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="container py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          Dịch Vụ
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
          Dịch Vụ Tủ Thông Minh Toàn Diện
        </h2>
        <h3 className="md:w-2/3 mx-auto text-xl text-center text-muted-foreground mb-12">
          Từ lưu trữ gói hàng an toàn đến thanh toán tự động, Lockerly cung cấp giải pháp toàn diện 
          cho các khu chung cư, văn phòng và ký túc xá hiện đại.
        </h3>

        {/* Content with Image on Left */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Side - Small Image */}
          <div className="lg:col-span-4 order-2 lg:order-1">
            <div className="sticky top-24 rounded-xl overflow-hidden shadow-lg border border-border/50">
              <img
                src={servicesImage}
                alt="Lockerly Services"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Right Side - Services Cards */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <div className="grid sm:grid-cols-2 gap-4">
              {serviceList.map(({ title, description, pro }) => (
                <Card
                  key={title}
                  className="bg-muted/60 dark:bg-card h-full relative"
                >
                  <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                  <Badge
                    data-pro={ProService.YES === pro}
                    variant="secondary"
                    className="absolute -top-2 -right-3 data-[pro=false]:hidden"
                  >
                    PRO
                  </Badge>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

