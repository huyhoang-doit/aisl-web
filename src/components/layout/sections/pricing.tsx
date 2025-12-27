import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { PopularPlan } from "@/utils/constants";

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
    title: "Basic",
    popular: 0,
    price: 0,
    description:
      "Perfect for occasional package recipients. Pay-as-you-go with standard storage rates.",
    buttonText: "Get Started",
    benefitList: [
      "Face recognition setup",
      "Pay-per-use billing",
      "Standard storage rates",
      "Email notifications",
      "Basic support",
    ],
  },
  {
    title: "Premium",
    popular: 1,
    price: 29,
    description:
      "Ideal for frequent online shoppers. Monthly subscription with discounted rates and priority features.",
    buttonText: "Subscribe Now",
    benefitList: [
      "Unlimited face recognition",
      "20% storage discount",
      "Priority locker allocation",
      "Advanced delegation features",
      "24/7 priority support",
    ],
  },
  {
    title: "Enterprise",
    popular: 0,
    price: 99,
    description:
      "Custom solutions for property managers and businesses. Volume pricing and dedicated support.",
    buttonText: "Contact Sales",
    benefitList: [
      "Custom subscription plans",
      "Volume pricing discounts",
      "Dedicated account manager",
      "API access & integration",
      "Custom billing solutions",
    ],
  },
];

export const PricingSection = () => {
  return (
    <section className="container py-18 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Pricing
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        Choose Your Plan
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground pb-14">
        Flexible pricing options for individuals, frequent users, and businesses. 
        Start with pay-as-you-go or subscribe for maximum savings.
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
                  <span className="text-3xl font-bold">${price}</span>
                  <span className="text-muted-foreground"> /month</span>
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

