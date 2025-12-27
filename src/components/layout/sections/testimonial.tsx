import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";

interface ReviewProps {
  image: string;
  name: string;
  userName: string;
  comment: string;
  rating: number;
}

const reviewList: ReviewProps[] = [
  {
    image: "https://github.com/shadcn.png",
    name: "Nguyen Van A",
    userName: "Apartment Resident",
    comment:
      "Lockerly has completely transformed how I receive packages. No more waiting at the front desk or asking neighbors. The face recognition is incredibly fast and reliable!",
    rating: 5.0,
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Tran Thi B",
    userName: "Office Manager",
    comment:
      "As someone who manages deliveries for our office building, Lockerly has eliminated all the administrative burden. The automated billing and smart allocation features are game-changers.",
    rating: 4.9,
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Le Van C",
    userName: "Dormitory Resident",
    comment:
      "The best part is not needing my phone! I can grab packages even when my battery is dead. The hands-free experience is exactly what I needed for my busy schedule.",
    rating: 5.0,
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Pham Thi D",
    userName: "Frequent Online Shopper",
    comment:
      "I love how the system automatically calculates storage fees. No more surprise charges or manual payments. The wallet integration makes everything seamless.",
    rating: 4.8,
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Hoang Van E",
    userName: "Security Officer",
    comment:
      "The real-time monitoring and audit trail features give us complete visibility. We can track every package and access event, ensuring maximum security for residents.",
    rating: 5.0,
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Nguyen Thi F",
    userName: "Property Manager",
    comment:
      "Lockerly has reduced package-related complaints by 90%. Residents love the convenience, and we love the reduced workload. It's a win-win solution.",
    rating: 4.9,
  },
];

export const TestimonialSection = () => {
  return (
    <section id="testimonials" className="container py-18 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          Testimonials
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
          Trusted by Residents & Property Managers
        </h2>
      </div>

      <Carousel
        opts={{
          align: "start",
        }}
        className="relative w-[80%] sm:w-[90%] lg:max-w-screen-xl mx-auto"
      >
        <CarouselContent>
          {reviewList.map((review) => (
            <CarouselItem
              key={review.name}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <Card className="bg-muted/50 dark:bg-card">
                <CardContent className="pt-6 pb-0">
                  <div className="flex gap-1 pb-6">
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                  </div>
                  {`"${review.comment}"`}
                </CardContent>

                <CardHeader>
                  <div className="flex flex-row items-center gap-4">
                    <Avatar>
                      <AvatarImage
                        src="https://avatars.githubusercontent.com/u/75042455?v=4"
                        alt="radix"
                      />
                      <AvatarFallback>SV</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <CardTitle className="text-lg">{review.name}</CardTitle>
                      <CardDescription>{review.userName}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};

