import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    title: "Face Recognition Setup",
    description:
      "One-time registration of your face data for instant, hands-free package retrieval at any locker.",
    pro: 0,
  },
  {
    title: "Proxy Rental Service",
    description:
      "Senders can pay the base storage fee upfront, making package delivery convenient for both parties.",
    pro: 0,
  },
  {
    title: "Advanced Subscription Plans",
    description: "Custom subscription packages with flexible pricing for frequent users and businesses.",
    pro: 0,
  },
  {
    title: "Audit Trail & Security",
    description: "Complete transaction history and security logs for all package activities and access events.",
    pro: 1,
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="container py-18 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Services
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        Complete Smart Locker Services
      </h2>
      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        From secure package storage to automated billing, Lockerly provides comprehensive 
        solutions for modern residential complexes, offices, and dormitories.
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full lg:w-[60%] mx-auto">
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
    </section>
  );
};

