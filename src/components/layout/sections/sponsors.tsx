import React from "react";
import { Icon } from "@/components/ui/icon";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface sponsorsProps {
  icon: string;
  name: string;
}

const sponsors: sponsorsProps[] = [
  {
    icon: "Building2",
    name: "Apartment Complexes",
  },
  {
    icon: "Building2",
    name: "Office Buildings",
  },
  {
    icon: "Building2",
    name: "Dormitories",
  },
  {
    icon: "Building2",
    name: "Residential Areas",
  },
  {
    icon: "Building2",
    name: "Property Management",
  },
  {
    icon: "Building2",
    name: "Logistics Partners",
  },
  {
    icon: "Building2",
    name: "Smart City Solutions",
  },
];

export const SponsorsSection = () => {
  const [api, setApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 2000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section id="sponsors" className="max-w-[75%] mx-auto pb-24 sm:pb-32">
            <h2 className="text-lg md:text-xl text-center mb-6">
              Trusted by Leading Properties
            </h2>

      <div className="mx-auto">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {sponsors.map(({ icon, name }) => (
              <CarouselItem
                key={name}
                className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <div className="flex items-center justify-center text-xl md:text-2xl font-medium">
                  <Icon
                    name={icon}
                    size={32}
                    color="white"
                    className="mr-2"
                  />
                  {name}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

