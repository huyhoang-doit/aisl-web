import React from "react";
import { Icon } from "@/shared/components/ui/icon";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/shared/components/ui/carousel";

interface sponsorsProps {
  icon: string;
  name: string;
}

const sponsors: sponsorsProps[] = [
  {
    icon: "Building2",
    name: "Khu Chung Cư",
  },
  {
    icon: "Building2",
    name: "Tòa Nhà Văn Phòng",
  },
  {
    icon: "Building2",
    name: "Ký Túc Xá",
  },
  {
    icon: "Building2",
    name: "Khu Dân Cư",
  },
  {
    icon: "Building2",
    name: "Quản Lý Tài Sản",
  },
  {
    icon: "Building2",
    name: "Đối Tác Logistics",
  },
  {
    icon: "Building2",
    name: "Giải Pháp Thành Phố Thông Minh",
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
    <section id="sponsors" className="max-w-[75%] mx-auto pb-8 sm:pb-12">
            <h2 className="text-lg md:text-xl text-center mb-6">
              Đối Tượng Hợp Tác
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

