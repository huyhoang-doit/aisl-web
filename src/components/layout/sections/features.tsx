import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

interface FeaturesProps {
  icon: string;
  title: string;
  description: string;
}

const featureList: FeaturesProps[] = [
  {
    icon: "ScanFace",
    title: "Multi-Factor Security & Biometrics",
    description:
      "Face recognition technology for secure, contactless package retrieval with multi-layer authentication.",
  },
  {
    icon: "Wallet",
    title: "Wallet & Automated Billing",
    description:
      "Time-based billing automatically calculates storage fees and deducts from your pre-loaded wallet.",
  },
  {
    icon: "Package",
    title: "Smart Locker Allocation",
    description:
      "Automatically assigns optimal locker compartments based on package size and availability.",
  },
  {
    icon: "Activity",
    title: "Real-time IoT Monitoring",
    description:
      "Continuous monitoring of locker status, package conditions, and system health via IoT sensors.",
  },
  {
    icon: "Calendar",
    title: "Slot Reservation System",
    description:
      "Reserve locker slots in advance for scheduled deliveries with secure space allocation.",
  },
  {
    icon: "Users",
    title: "Smart Delegation & Liability Transfer",
    description:
      "Delegate package pickup with automatic liability transfer and access management.",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="container py-18 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Features
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        Powerful Features for Modern Living
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        Experience the next generation of smart locker technology. From AI-powered face recognition 
        to automated billing, Lockerly delivers convenience and security in one seamless solution.
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featureList.map(({ icon, title, description }) => (
          <div key={title}>
            <Card className="h-full bg-background border-0 shadow-none">
              <CardHeader className="flex justify-center items-center">
                <div className="bg-primary/20 p-2 rounded-full ring-8 ring-primary/10 mb-4">
                  <Icon
                    name={icon}
                    size={24}
                    className="text-primary w-6 h-6"
                  />
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground text-center">
                {description}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};

