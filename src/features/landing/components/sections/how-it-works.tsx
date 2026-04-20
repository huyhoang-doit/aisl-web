import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Package, ScanFace, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
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
      "Người nhận gửi mã cho Người vận chuyển",
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="container py-16 sm:py-24 relative">
      {/* Decorative background lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-lg text-primary mb-3 tracking-widest uppercase font-semibold">
          Quy Trình Tự Động
        </h2>

        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Hoạt Động Trơn Tru, Nhanh Chóng
        </h2>

        <p className="md:w-2/3 mx-auto text-lg md:text-xl text-muted-foreground/90">
          Mọi thao tác đều được số hóa và tối ưu. Không cần chìa khóa, không cần chờ đợi. Chỉ với vài chạm và xác thực khuôn mặt.
        </p>
      </motion.div>

      {/* Three Panel Layout */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto"
      >
        {workflowPanels.map(({ title, icon, steps }, index) => (
          <motion.div key={index} variants={cardVariants} className="h-full">
            <Card
              className="bg-card/60 backdrop-blur-md border-border/60 hover:border-primary/60 transition-all duration-500 overflow-hidden group h-full flex flex-col shadow-lg hover:shadow-xl hover:shadow-primary/5 relative"
            >
              {/* Glowing top line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="border-b border-border/40 bg-muted/20 relative z-10 pb-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-background p-4 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.05)] border border-border/50 group-hover:border-primary/30 group-hover:scale-110 transition-all duration-300 text-primary">
                    {icon}
                  </div>
                  {index < workflowPanels.length - 1 && (
                    <div className="hidden md:flex absolute -right-6 top-10 z-20 bg-background rounded-full p-1 border border-border shadow-sm">
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-xl md:text-2xl font-bold tracking-tight">{title}</CardTitle>
              </CardHeader>

              <CardContent className="pt-8 relative z-10 flex-1">
                <ol className="space-y-4 mb-6 max-h-[450px] overflow-y-auto pr-2">
                  {steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start gap-4 group/step">
                      <span className="shrink-0 w-7 h-7 rounded-full bg-muted border border-border text-muted-foreground group-hover/step:bg-primary group-hover/step:text-primary-foreground group-hover/step:border-primary font-semibold text-xs flex items-center justify-center transition-colors duration-300 shadow-sm mt-0.5">
                        {stepIndex + 1}
                      </span>
                      <span className="text-muted-foreground text-sm flex-1 pt-1 leading-relaxed group-hover/step:text-foreground transition-colors duration-300">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </CardContent>
              
              {/* Animated bottom gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-20" />
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
