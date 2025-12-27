import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "Do I need a smartphone to retrieve packages?",
    answer: "No! That's the key advantage of Lockerly. Once you register your face and top up your wallet via the web app, you can retrieve packages using only face recognition—no phone, keys, or access cards needed at the locker.",
    value: "item-1",
  },
  {
    question: "How does the automated billing work?",
    answer:
      "The system automatically calculates storage fees based on the actual time your package stays in the locker. Fees are deducted from your pre-loaded wallet balance, so you only pay for what you use—no manual payment steps required.",
    value: "item-2",
  },
  {
    question:
      "Is my face data secure?",
    answer:
      "Yes. Lockerly uses advanced biometric encryption and does not store raw face images. Only encrypted biometric templates are stored, ensuring your privacy and security.",
    value: "item-3",
  },
  {
    question: "Can I delegate package pickup to someone else?",
    answer: "Yes! You can delegate pickup to family members or friends. For system users, they assume financial liability. For non-users, you can share an OTP/QR code, but you retain financial liability.",
    value: "item-4",
  },
  {
    question:
      "What payment methods are accepted?",
    answer: "Lockerly uses digital wallet integration. You can top up your wallet using e-wallets or online payment methods. Cash payments are not supported.",
    value: "item-5",
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="container md:w-[700px] py-18 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          FAQS
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold">
          Frequently Asked Questions
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

