import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Icon } from "@/shared/components/ui/icon";
import { motion } from "framer-motion";

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const FeaturesSection = () => {
  return (
    <section id="features" className="container py-16 sm:py-24 relative">
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-lg text-primary mb-3 tracking-widest uppercase font-semibold">
          Công Nghệ Lõi
        </h2>

        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Sức Mạnh Đằng Sau <span className="text-transparent bg-gradient-to-r from-primary to-purple-500 bg-clip-text">Lockerly</span>
        </h2>

        <p className="md:w-2/3 mx-auto text-lg md:text-xl text-muted-foreground/90">
          Trải nghiệm thế hệ tiếp theo của giao nhận hàng hóa. Tích hợp sâu AI, IoT và tự động hóa để mang lại trải nghiệm liền mạch và an toàn tuyệt đối.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants as any}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
      >
        {featureList.map(({ icon, title, description }) => (
          <motion.div key={title} variants={itemVariants as any} className="h-full">
            <Card className="h-full bg-card/40 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-primary/10 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-[30px] group-hover:bg-primary/20 transition-colors duration-500" />
              
              <CardHeader className="flex flex-col items-start pb-4 relative z-10">
                <div className="bg-background p-3 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300 ring-1 ring-border shadow-sm group-hover:ring-primary/30">
                  <Icon
                    name={icon}
                    size={28}
                    className="text-primary"
                  />
                </div>
                <CardTitle className="text-xl font-bold leading-snug">{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground relative z-10 text-sm md:text-base leading-relaxed">
                {description}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
