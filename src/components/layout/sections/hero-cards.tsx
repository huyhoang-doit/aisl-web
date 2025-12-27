import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Check, Lightbulb, ScanFace } from "lucide-react";

export const HeroCards = () => {
  return (
    <>
      {/* Mobile Version - Stacked Cards */}
      <div className="flex flex-col gap-8 lg:hidden w-full max-w-md mx-auto">
        {/* Testimonial */}
        <Card className="drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar>
            <AvatarImage
              alt="User"
              src="https://i.pravatar.cc/150?img=12"
            />
            <AvatarFallback>NV</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <CardTitle className="text-lg">Nguyen Van A</CardTitle>
            <CardDescription>Apartment Resident</CardDescription>
          </div>
        </CardHeader>

          <CardContent>Lockerly has completely transformed how I receive packages. The face recognition is incredibly fast!</CardContent>
        </Card>

        {/* Pricing */}
        <Card className="drop-shadow-xl shadow-black/10 dark:shadow-white/10">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Basic Plan
              <Badge
                variant="secondary"
                className="text-sm text-primary"
              >
                Most popular
              </Badge>
            </CardTitle>
            <div>
              <span className="text-3xl font-bold">$0</span>
              <span className="text-muted-foreground"> /month</span>
            </div>

            <CardDescription>
              Pay-as-you-go with standard storage rates. Perfect for occasional users.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button className="w-full">Get Started</Button>
          </CardContent>

          <hr className="w-4/5 m-auto mb-4" />

          <CardFooter className="flex">
            <div className="space-y-4">
              {["Face Recognition", "Automated Billing", "24/7 Access"].map(
                (benefit: string) => (
                  <span
                    key={benefit}
                    className="flex"
                  >
                    <Check className="text-green-500" />{" "}
                    <h3 className="ml-2">{benefit}</h3>
                  </span>
                )
              )}
            </div>
          </CardFooter>
        </Card>

        {/* Feature */}
        <Card className="drop-shadow-xl shadow-black/10 dark:shadow-white/10">
          <CardHeader className="space-y-1 flex flex-row justify-start items-start gap-4">
            <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
              <Lightbulb className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle>Hands-Free Access</CardTitle>
              <CardDescription className="text-md mt-2">
                No smartphone needed! Retrieve packages using only face recognition. 
                Register once and enjoy seamless, device-free convenience.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Desktop Version - Absolute Positioning */}
      <div className="hidden lg:flex flex-row flex-wrap gap-8 relative w-[800px] h-[600px]">
        {/* Testimonial */}
        <Card className="absolute w-[340px] top-0 left-0 drop-shadow-xl shadow-black/10 dark:shadow-white/10 z-10">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Avatar>
              <AvatarImage
                alt="User"
                src="https://i.pravatar.cc/150?img=12"
              />
              <AvatarFallback>NV</AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <CardTitle className="text-lg">Nguyen Van A</CardTitle>
              <CardDescription>Apartment Resident</CardDescription>
            </div>
          </CardHeader>

          <CardContent>Lockerly has completely transformed how I receive packages. The face recognition is incredibly fast!</CardContent>
        </Card>

        {/* Smart Locker Image */}
        <Card className="absolute right-[-50px] top-12 w-80 flex flex-col justify-center items-center drop-shadow-xl shadow-black/10 dark:shadow-white/10 z-20">
          <CardHeader className="mt-8 flex justify-center items-center pb-2">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"
              alt="Smart Locker"
              className="absolute grayscale-0 -top-12 rounded-full w-24 h-24 aspect-square object-cover border-4 border-primary/20"
            />
            <CardTitle className="text-center">Smart Locker</CardTitle>
            <CardDescription className="font-normal text-primary">
              AI-Powered System
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center pb-2">
            <p>
              Secure, automated package storage with face recognition technology
              for modern living spaces
            </p>
          </CardContent>

          <CardFooter className="flex justify-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <ScanFace className="w-4 h-4" />
              Face ID
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Check className="w-4 h-4" />
              24/7 Access
            </Badge>
          </CardFooter>
        </Card>

        {/* Pricing */}
        <Card className="absolute top-[200px] left-[-50px] w-72 drop-shadow-xl shadow-black/10 dark:shadow-white/10 z-30">
        <CardHeader>
          <CardTitle className="flex item-center justify-between">
            Basic Plan
            <Badge
              variant="secondary"
              className="text-sm text-primary"
            >
              Most popular
            </Badge>
          </CardTitle>
          <div>
            <span className="text-3xl font-bold">$0</span>
            <span className="text-muted-foreground"> /month</span>
          </div>

          <CardDescription>
            Pay-as-you-go with standard storage rates. Perfect for occasional users.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button className="w-full">Get Started</Button>
        </CardContent>

        <hr className="w-4/5 m-auto mb-4" />

        <CardFooter className="flex">
          <div className="space-y-4">
            {["Face Recognition", "Automated Billing", "24/7 Access"].map(
              (benefit: string) => (
                <span
                  key={benefit}
                  className="flex"
                >
                  <Check className="text-green-500" />{" "}
                  <h3 className="ml-2">{benefit}</h3>
                </span>
              )
            )}
          </div>
        </CardFooter>
      </Card>

        {/* Feature */}
        <Card className="absolute w-[350px] right-[20px] bottom-[60px] drop-shadow-xl shadow-black/10 dark:shadow-white/10 z-40">
        <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
          <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
            <Lightbulb className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle>Hands-Free Access</CardTitle>
            <CardDescription className="text-md mt-2">
              No smartphone needed! Retrieve packages using only face recognition. 
              Register once and enjoy seamless, device-free convenience.
            </CardDescription>
          </div>
          </CardHeader>
        </Card>
      </div>
    </>
  );
};
