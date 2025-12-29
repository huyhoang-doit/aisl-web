import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ScanFace, Users } from "lucide-react";
import type React from "react";

interface WorkflowPanelProps {
  title: string;
  icon: React.ReactNode;
  steps: string[];
}

const workflowPanels: WorkflowPanelProps[] = [
  {
    title: "GỬI HÀNG",
    icon: <Package className="w-8 h-8 text-primary" />,
    steps: [
      "Người nhận mở ứng dụng, chọn 'Tạo đơn hàng nhận' hoặc 'Book tủ'",
      "Chọn kích cỡ tủ (Nhỏ, Vừa, Lớn) và địa điểm tủ locker",
      "Hệ thống tạo mã PIN/QR dùng một lần và gửi cho người nhận",
      "Người nhận gửi mã cho Courier/Shipper",
      "Courier đến trạm locker, chọn 'Gửi hàng' trên màn hình",
      "Courier nhập mã PIN hoặc quét mã QR",
      "Courier chụp ảnh/video gói hàng làm bằng chứng",
      "Hệ thống mở tủ trống đúng kích cỡ đã chọn",
      "Courier bỏ hàng vào và đóng tủ lại",
      "Hệ thống khóa tủ và gửi thông báo cho người nhận",
    ],
  },
  {
    title: "NHẬN HÀNG",
    icon: <ScanFace className="w-8 h-8 text-primary" />,
    steps: [
      "Nhận thông báo hàng đã đến tủ",
      "Đến trạm locker và mở ứng dụng",
      "Ứng dụng hiển thị mã Lấy hàng (QR hoặc PIN)",
      "Chọn 'Nhận hàng' trên màn hình locker",
      "Quét mã QR, nhận diện khuôn mặt hoặc nhập mã PIN",
      "Hệ thống xác thực và mở tủ chứa hàng",
      "Lấy hàng và đóng tủ lại",
      "Hệ thống ghi nhận hoàn thành, tủ chuyển về trạng thái trống",
    ],
  },
  {
    title: "TỰ THUÊ",
    icon: <Users className="w-8 h-8 text-primary" />,
    steps: [
      "Mở ứng dụng, chọn 'Thuê tủ cá nhân' hoặc 'Gửi đồ cá nhân'",
      "Chọn trạm locker gần nhất trên bản đồ",
      "Chọn kích cỡ tủ (Nhỏ, Vừa, Lớn) và gói thời gian thuê",
      "Hệ thống tính toán tổng chi phí",
      "Thanh toán qua ví điện tử/thẻ (nếu cần nạp thêm vào ví)",
      "Hệ thống tạo 'Mã Truy cập' (PIN/QR) duy nhất",
      "Đến trạm locker, chọn 'Thuê tủ cá nhân' trên màn hình",
      "Quét mã truy cập hoặc nhận diện khuôn mặt",
      "Hệ thống mở tủ, cất đồ vào và đóng tủ lại",
      "Khi lấy lại: Quét lại mã truy cập hoặc nhận diện khuôn mặt",
    ],
  },
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="container py-8 sm:py-12">
      <div className="text-center mb-12">
        <h2 className="text-lg text-primary mb-2 tracking-wider">
          Cách Thức Hoạt Động
        </h2>

        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Lockerly Hoạt Động Như Thế Nào?
        </h2>

        <p className="md:w-2/3 mx-auto text-xl text-muted-foreground">
          Trải nghiệm quy trình giao nhận hàng thông minh, đơn giản và an toàn. 
          Từ gửi hàng đến nhận hàng, mọi thứ đều được tự động hóa hoàn toàn.
        </p>
      </div>

      {/* Three Panel Layout */}
      <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
        {workflowPanels.map(({ title, icon, steps }, index) => (
          <Card
            key={index}
            className="bg-muted/50 dark:bg-card border-2 border-border hover:border-primary/50 transition-all duration-300 overflow-hidden group h-full flex flex-col"
          >
            {/* Header with Icon and Title */}
            <CardHeader className="border-b border-border/50 bg-background/50">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-primary/20 p-3 rounded-full ring-4 ring-primary/10">
                  {icon}
                </div>
                <div className="h-0.5 w-16 bg-primary"></div>
              </div>
              <CardTitle className="text-xl md:text-2xl font-bold text-center">{title}</CardTitle>
            </CardHeader>

            {/* Steps List */}
            <CardContent className="pt-6">
              <ol className="space-y-2.5 mb-6 max-h-[500px] overflow-y-auto pr-2">
                {steps.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center mt-0.5">
                      {stepIndex + 1}
                    </span>
                    <span className="text-muted-foreground text-sm flex-1 pt-0.5 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>

            {/* Video Thumbnail Section */}
            {/* <div className="px-6 pb-6">
              <div className="relative rounded-lg overflow-hidden bg-muted aspect-video group-hover:shadow-lg transition-shadow duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-xl group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                      <Play className="w-8 h-8 text-white ml-1" fill="white" />
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                  <p className="text-white text-xs font-semibold mb-1 line-clamp-2">
                    {videoTitle}
                  </p>
                  <p className="text-white/70 text-[10px] line-clamp-1">
                    {videoSubtitle}
                  </p>
                </div>
              </div>
            </div> */}
          </Card>
        ))}
      </div>

    </section>
  );
};
