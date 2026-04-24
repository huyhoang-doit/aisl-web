import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Check } from "lucide-react";
import { PopularPlan } from "@/shared/utils/constants";

interface PlanProps {
  title: string;
  popular: typeof PopularPlan.NO | typeof PopularPlan.YES;
  price: number;
  description: string;
  buttonText: string;
  benefitList: string[];
}

const plans: PlanProps[] = [
  {
    title: "Miễn Phí",
    popular: 0,
    price: 0,
    description:
      "Hoàn hảo cho người nhận hàng không thường xuyên. Trả phí theo sử dụng với mức giá tiêu chuẩn.",
    buttonText: "Bắt Đầu",
    benefitList: [
      "Thiết lập nhận diện khuôn mặt",
      "Thanh toán theo sử dụng",
      "Mức giá lưu trữ tiêu chuẩn",
      "Thông báo qua email",
      "Hỗ trợ cơ bản",
      "Tối đa 2 tủ active cùng lúc",
    ],
  },
  {
    title: "Premium",
    popular: 1,
    price: 299,
    description:
      "Lý tưởng cho người mua sắm trực tuyến thường xuyên. Đăng ký hàng tháng với giá giảm và tính năng ưu tiên.",
    buttonText: "Đăng Ký Ngay",
    benefitList: [
      "Nhận diện khuôn mặt không giới hạn",
      "Giảm giá 20% phí lưu trữ",
      "Phân bổ tủ ưu tiên",
      "Tính năng ủy quyền nâng cao",
      "Đặt lịch trước (Reservation)",
      "Hỗ trợ ưu tiên 24/7",
    ],
  },
  {
    title: "Doanh Nghiệp",
    popular: 0,
    price: 999,
    description:
      "Giải pháp tùy chỉnh cho quản lý tài sản và doanh nghiệp. Giá theo khối lượng và hỗ trợ chuyên dụng.",
    buttonText: "Liên Hệ Bán Hàng",
    benefitList: [
      "Gói đăng ký tùy chỉnh",
      "Giảm giá theo khối lượng",
      "Quản lý tài khoản chuyên dụng",
      "Truy cập API & Tích hợp",
      "Giải pháp thanh toán tùy chỉnh",
      "Thuê tủ cố định theo tháng",
    ],
  },
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="container py-8 sm:py-12">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Bảng Giá
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        Chọn Gói Của Bạn
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground pb-14">
        Tùy chọn giá linh hoạt cho cá nhân, người dùng thường xuyên và doanh nghiệp. 
        Bắt đầu với trả phí theo sử dụng hoặc đăng ký để tiết kiệm tối đa.
      </h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-4">
        {plans.map(
          ({ title, popular, price, description, buttonText, benefitList }) => (
            <Card
              key={title}
              className={
                popular === PopularPlan?.YES
                  ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-[1.5px] border-primary lg:scale-[1.1]"
                  : ""
              }
            >
              <CardHeader>
                <CardTitle className="pb-2">{title}</CardTitle>

                <CardDescription className="pb-4">
                  {description}
                </CardDescription>

                <div>
                  <span className="text-3xl font-bold">{price === 0 ? "Miễn phí" : `${price.toLocaleString('vi-VN')}đ`}</span>
                  {price > 0 && <span className="text-muted-foreground"> /tháng</span>}
                </div>
              </CardHeader>

              <CardContent className="flex">
                <div className="space-y-4">
                  {benefitList.map((benefit) => (
                    <span key={benefit} className="flex">
                      <Check className="text-primary mr-2" />
                      <h3>{benefit}</h3>
                    </span>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  variant={
                    popular === PopularPlan?.YES ? "default" : "secondary"
                  }
                  className="w-full"
                >
                  {buttonText}
                </Button>
              </CardFooter>
            </Card>
          )
        )}
      </div>
    </section>
  );
};

