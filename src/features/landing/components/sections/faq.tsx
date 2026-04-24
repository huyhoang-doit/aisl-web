import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "Tôi có cần điện thoại thông minh để nhận hàng không?",
    answer: "Không! Đó là lợi thế chính của Lockerly. Khi bạn đã đăng ký khuôn mặt và nạp tiền vào ví qua ứng dụng web, bạn có thể nhận hàng chỉ bằng nhận diện khuôn mặt—không cần điện thoại, chìa khóa hay thẻ truy cập tại tủ.",
    value: "item-1",
  },
  {
    question: "Hệ thống thanh toán tự động hoạt động như thế nào?",
    answer:
      "Hệ thống tự động tính phí lưu trữ dựa trên thời gian thực tế gói hàng ở trong tủ. Phí được trừ từ số dư ví đã nạp trước của bạn, vì vậy bạn chỉ trả cho những gì bạn sử dụng—không cần thao tác thanh toán thủ công.",
    value: "item-2",
  },
  {
    question:
      "Dữ liệu khuôn mặt của tôi có an toàn không?",
    answer:
      "Có. Lockerly sử dụng mã hóa sinh trắc học tiên tiến và không lưu trữ ảnh khuôn mặt gốc. Chỉ các template sinh trắc học đã mã hóa được lưu trữ, đảm bảo quyền riêng tư và an toàn của bạn.",
    value: "item-3",
  },
  {
    question: "Tôi có thể ủy quyền cho người khác nhận hàng không?",
    answer: "Có! Bạn có thể ủy quyền nhận hàng cho thành viên gia đình hoặc bạn bè. Đối với người dùng hệ thống, họ chịu trách nhiệm tài chính. Đối với người không phải người dùng, bạn có thể chia sẻ mã OTP/QR, nhưng bạn vẫn giữ trách nhiệm tài chính.",
    value: "item-4",
  },
  {
    question:
      "Các phương thức thanh toán nào được chấp nhận?",
    answer: "Lockerly sử dụng tích hợp ví điện tử. Bạn có thể nạp tiền vào ví bằng ví điện tử hoặc phương thức thanh toán trực tuyến. Không hỗ trợ thanh toán bằng tiền mặt.",
    value: "item-5",
  },
  {
    question: "Chuyện gì xảy ra nếu tôi quên lấy hàng?",
    answer: "Nếu quá thời gian thuê mà hàng chưa được lấy, hệ thống sẽ tính phí phạt quá hạn (Overdue Fee). Tủ sẽ chuyển sang trạng thái OVERDUE nhưng vẫn khóa để bảo vệ tài sản. Bạn cần thanh toán đủ phí (gốc + phạt) để mở tủ.",
    value: "item-6",
  },
  {
    question: "Gói Miễn Phí có những giới hạn gì?",
    answer: "Gói Miễn Phí cho phép tối đa 2 tủ active cùng lúc, không hỗ trợ đặt lịch trước (Reservation) và không hỗ trợ thuê tủ theo tháng. Khi đăng ký gói trả phí, gói Miễn Phí sẽ tạm ngưng tự động.",
    value: "item-7",
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="container md:w-[700px] py-8 sm:py-12">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          Câu Hỏi Thường Gặp
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold">
          Câu Hỏi Thường Gặp
        </h2>
      </div>

      <Accordion type="single" collapsible className="AccordionRoot">
        {FAQList.map(({ question, answer, value }) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

