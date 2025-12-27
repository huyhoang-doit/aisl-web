import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

interface BenefitsProps {
  icon: string;
  title: string;
  description: string;
}

const benefitList: BenefitsProps[] = [
  {
    icon: "BadgeCheck",
    title: "Hands-Free Convenience",
    description:
      "Retrieve packages without carrying your phone. Simply approach the locker and let AI recognize your face for instant access.",
  },
  {
    icon: "LineChart",
    title: "Eliminate Delivery Chaos",
    description:
      "No more missed deliveries, stolen packages, or relying on neighbors. Centralized, secure storage for all your deliveries.",
  },
  {
    icon: "Wallet",
    title: "Automated Smart Billing",
    description:
      "Pay only for actual storage time. The system automatically calculates fees and deducts from your wallet—no manual payment steps.",
  },
  {
    icon: "Sparkle",
    title: "24/7 Access & Security",
    description:
      "Access your packages anytime, day or night. Advanced security with face recognition and real-time monitoring ensures your items are safe.",
  },
];

export const BenefitsSection = () => {
  return (
    <section id="benefits" className="container py-18 sm:py-32">
      <div className="grid lg:grid-cols-2 place-items-center lg:gap-24">
        <div>
          <h2 className="text-lg text-primary mb-2 tracking-wider">Benefits</h2>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Lockerly?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Experience the future of package delivery. Lockerly transforms how you receive packages 
            with cutting-edge AI technology, eliminating the hassles of traditional delivery methods 
            and creating a seamless, secure experience.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 w-full">
          {benefitList.map(({ icon, title, description }, index) => (
            <Card
              key={title}
              className="bg-muted/50 dark:bg-card hover:bg-background transition-all delay-75 group/number"
            >
              <CardHeader>
                <div className="flex justify-between">
                  <Icon
                    name={icon}
                    size={32}
                    className="mb-6 text-primary"
                  />
                  <span className="text-5xl text-muted-foreground/15 font-medium transition-all delay-75 group-hover/number:text-muted-foreground/30">
                    0{index + 1}
                  </span>
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

