import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";

interface ReviewProps {
  image: string;
  name: string;
  userName: string;
  comment: string;
  rating: number;
}

const reviewList: ReviewProps[] = [
  {
    image: "https://github.com/shadcn.png",
    name: "Nguyễn Văn A",
    userName: "Cư dân chung cư",
    comment:
      "Lockerly đã thay đổi hoàn toàn cách tôi nhận hàng. Không còn phải chờ ở quầy lễ tân hoặc nhờ hàng xóm. Nhận diện khuôn mặt cực kỳ nhanh và đáng tin cậy!",
    rating: 5.0,
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Trần Thị B",
    userName: "Quản lý văn phòng",
    comment:
      "Là người quản lý giao hàng cho tòa nhà văn phòng, Lockerly đã loại bỏ hoàn toàn gánh nặng hành chính. Tính năng thanh toán tự động và phân bổ thông minh thực sự thay đổi cuộc chơi.",
    rating: 4.9,
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Lê Văn C",
    userName: "Sinh viên ký túc xá",
    comment:
      "Phần tốt nhất là không cần điện thoại! Tôi có thể lấy hàng ngay cả khi pin hết. Trải nghiệm không cần thiết bị chính xác là thứ tôi cần cho lịch trình bận rộn.",
    rating: 5.0,
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Phạm Thị D",
    userName: "Người mua sắm trực tuyến thường xuyên",
    comment:
      "Tôi yêu cách hệ thống tự động tính phí lưu trữ. Không còn phí bất ngờ hoặc thanh toán thủ công. Tích hợp ví làm mọi thứ trở nên mượt mà.",
    rating: 4.8,
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Hoàng Văn E",
    userName: "Nhân viên bảo vệ",
    comment:
      "Tính năng giám sát thời gian thực và lịch sử kiểm tra cho chúng tôi tầm nhìn hoàn chỉnh. Chúng tôi có thể theo dõi mọi gói hàng và sự kiện truy cập, đảm bảo an ninh tối đa cho cư dân.",
    rating: 5.0,
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Nguyễn Thị F",
    userName: "Quản lý tài sản",
    comment:
      "Lockerly đã giảm 90% khiếu nại liên quan đến gói hàng. Cư dân yêu thích sự tiện lợi, và chúng tôi yêu thích khối lượng công việc giảm. Đó là giải pháp đôi bên cùng có lợi.",
    rating: 4.9,
  },
];

export const TestimonialSection = () => {
  return (
    <section id="testimonials" className="container py-8 sm:py-12">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          Đánh Giá
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
          Được Tin Tưởng Bởi Cư Dân & Quản Lý Tài Sản
        </h2>
      </div>

      <Carousel
        opts={{
          align: "start",
        }}
        className="relative w-[80%] sm:w-[90%] lg:max-w-screen-xl mx-auto"
      >
        <CarouselContent>
          {reviewList.map((review) => (
            <CarouselItem
              key={review.name}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <Card className="bg-muted/50 dark:bg-card">
                <CardContent className="pt-6 pb-0">
                  <div className="flex gap-1 pb-6">
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                  </div>
                  {`"${review.comment}"`}
                </CardContent>

                <CardHeader>
                  <div className="flex flex-row items-center gap-4">
                    <Avatar>
                      <AvatarImage
                        src="https://avatars.githubusercontent.com/u/75042455?v=4"
                        alt="radix"
                      />
                      <AvatarFallback>SV</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <CardTitle className="text-lg">{review.name}</CardTitle>
                      <CardDescription>{review.userName}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};

