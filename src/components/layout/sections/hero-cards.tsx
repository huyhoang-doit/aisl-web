import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Check, Lightbulb, ScanFace } from "lucide-react";

export const HeroCards = () => {
  return (
    <>
      {/* Mobile Version - Stacked Cards */}
      <div className="flex flex-col gap-8 lg:hidden w-full max-w-md mx-auto">
        {/* Testimonial */}
        <Card className="drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar>
            <AvatarImage
              alt="User"
              src="https://i.pravatar.cc/150?img=12"
            />
            <AvatarFallback>NV</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <CardTitle className="text-lg">Nguyễn Văn A</CardTitle>
            <CardDescription>Cư dân chung cư</CardDescription>
          </div>
        </CardHeader>

          <CardContent>Lockerly đã thay đổi hoàn toàn cách tôi nhận hàng. Nhận diện khuôn mặt cực kỳ nhanh!</CardContent>
        </Card>

        {/* Pricing */}
        <Card className="drop-shadow-xl shadow-black/10 dark:shadow-white/10">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Gói Miễn Phí
              <Badge
                variant="secondary"
                className="text-sm text-primary"
              >
                Phổ biến nhất
              </Badge>
            </CardTitle>
            <div>
              <span className="text-3xl font-bold">Miễn phí</span>
            </div>

            <CardDescription>
              Trả phí theo sử dụng với mức giá tiêu chuẩn. Hoàn hảo cho người dùng không thường xuyên.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button className="w-full">Get Started</Button>
          </CardContent>

          <hr className="w-4/5 m-auto mb-4" />

          <CardFooter className="flex">
            <div className="space-y-4">
              {["Nhận diện khuôn mặt", "Thanh toán tự động", "Truy cập 24/7"].map(
                (benefit: string) => (
                  <span
                    key={benefit}
                    className="flex"
                  >
                    <Check className="text-green-500" />{" "}
                    <h3 className="ml-2">{benefit}</h3>
                  </span>
                )
              )}
            </div>
          </CardFooter>
        </Card>

        {/* Feature */}
        <Card className="drop-shadow-xl shadow-black/10 dark:shadow-white/10">
          <CardHeader className="space-y-1 flex flex-row justify-start items-start gap-4">
            <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
              <Lightbulb className="w-6 h-6 text-primary" />
            </div>
            <div>
            <CardTitle>Truy Cập Không Cần Điện Thoại</CardTitle>
              <CardDescription className="text-md mt-2">
              Không cần điện thoại thông minh! Nhận hàng chỉ bằng nhận diện khuôn mặt. 
              Đăng ký một lần và tận hưởng sự tiện lợi không cần thiết bị.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Desktop Version - Absolute Positioning */}
      <div className="hidden lg:flex flex-row flex-wrap gap-8 relative w-[800px] h-[600px]">
        {/* Testimonial */}
        <Card className="absolute w-[340px] top-0 left-0 drop-shadow-xl shadow-black/10 dark:shadow-white/10 z-10">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Avatar>
              <AvatarImage
                alt="User"
                src="https://i.pravatar.cc/150?img=12"
              />
              <AvatarFallback>NV</AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <CardTitle className="text-lg">Nguyen Van A</CardTitle>
              <CardDescription>Apartment Resident</CardDescription>
            </div>
          </CardHeader>

          <CardContent>Lockerly has completely transformed how I receive packages. The face recognition is incredibly fast!</CardContent>
        </Card>

        {/* Smart Locker Image */}
        <Card className="absolute right-[-50px] top-12 w-80 flex flex-col justify-center items-center drop-shadow-xl shadow-black/10 dark:shadow-white/10 z-20">
          <CardHeader className="mt-8 flex justify-center items-center pb-2">
            <img
              src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop"
              alt="Tủ Thông Minh"
              className="absolute grayscale-0 -top-12 rounded-full w-24 h-24 aspect-square object-cover border-4 border-primary/20"
            />
            <CardTitle className="text-center">Tủ Thông Minh</CardTitle>
            <CardDescription className="font-normal text-primary">
              Hệ Thống AI
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center pb-2">
            <p>
              Lưu trữ gói hàng an toàn, tự động với công nghệ nhận diện khuôn mặt
              cho không gian sống hiện đại
            </p>
          </CardContent>

          <CardFooter className="flex justify-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <ScanFace className="w-4 h-4" />
              Face ID
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Check className="w-4 h-4" />
              Truy cập 24/7
            </Badge>
          </CardFooter>
        </Card>

        {/* Pricing */}
        <Card className="absolute top-[200px] left-[-50px] w-72 drop-shadow-xl shadow-black/10 dark:shadow-white/10 z-30">
        <CardHeader>
          <CardTitle className="flex item-center justify-between">
            Gói Miễn Phí
            <Badge
              variant="secondary"
              className="text-sm text-primary"
            >
              Phổ biến nhất
            </Badge>
          </CardTitle>
          <div>
            <span className="text-3xl font-bold">Miễn phí</span>
          </div>

          <CardDescription>
            Trả phí theo sử dụng với mức giá tiêu chuẩn. Hoàn hảo cho người dùng không thường xuyên.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button className="w-full">Bắt Đầu</Button>
        </CardContent>

        <hr className="w-4/5 m-auto mb-4" />

        <CardFooter className="flex">
          <div className="space-y-4">
            {["Nhận diện khuôn mặt", "Thanh toán tự động", "Truy cập 24/7"].map(
              (benefit: string) => (
                <span
                  key={benefit}
                  className="flex"
                >
                  <Check className="text-green-500" />{" "}
                  <h3 className="ml-2">{benefit}</h3>
                </span>
              )
            )}
          </div>
        </CardFooter>
      </Card>

        {/* Feature */}
        <Card className="absolute w-[350px] right-[20px] bottom-[60px] drop-shadow-xl shadow-black/10 dark:shadow-white/10 z-40">
        <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
          <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
            <Lightbulb className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle>Truy Cập Không Cần Điện Thoại</CardTitle>
            <CardDescription className="text-md mt-2">
              Không cần điện thoại thông minh! Nhận hàng chỉ bằng nhận diện khuôn mặt. 
              Đăng ký một lần và tận hưởng sự tiện lợi không cần thiết bị.
            </CardDescription>
          </div>
          </CardHeader>
        </Card>
      </div>
    </>
  );
};
