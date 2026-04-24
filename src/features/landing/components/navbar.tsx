import { RotateCcwKey, Menu } from "lucide-react";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { Separator } from "@/shared/components/ui/separator";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/shared/components/ui/navigation-menu";
import { Button } from "@/shared/components/ui/button";
import { ToggleTheme } from "./toggle-theme";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "#pricing",
    label: "Bảng Giá",
  },
  {
    href: "#testimonials",
    label: "Đánh Giá",
  },
  {
    href: "#contact",
    label: "Liên Hệ",
  },
  {
    href: "#faq",
    label: "FAQ",
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <header className="shadow-inner bg-opacity-15 w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border border-amber-400 z-40 rounded-2xl flex justify-between items-center p-2 bg-card">
      <a href="/" className="font-bold text-lg flex items-center">
        <RotateCcwKey className="bg-gradient-to-tr border-secondary from-primary via-primary/70 to-primary rounded-lg w-9 h-9 mr-2 border text-white" />
        Lockerly
      </a>
      {/* <!-- Mobile --> */}
      <div className="flex items-center lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Menu
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer lg:hidden"
            />
          </SheetTrigger>

          <SheetContent
            side="left"
            className="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-card border-secondary"
          >
            <div>
              <SheetHeader className="mb-4 ml-4">
                <SheetTitle className="flex items-center">
                  <a href="/" className="flex items-center">
                    <RotateCcwKey className="bg-gradient-to-tr border-secondary from-primary via-primary/70 to-primary rounded-lg w-9 h-9 mr-2 border text-white" />
                    Lockerly
                  </a>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    const element = document.querySelector("#benefits");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  variant="ghost"
                  className="justify-start text-base"
                >
                  Lợi Ích
                </Button>
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    const element = document.querySelector("#features");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  variant="ghost"
                  className="justify-start text-base"
                >
                  Tính Năng
                </Button>
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    const element = document.querySelector("#how-it-works");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  variant="ghost"
                  className="justify-start text-base"
                >
                  Cách Thức Hoạt Động
                </Button>
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    const element = document.querySelector("#services");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  variant="ghost"
                  className="justify-start text-base"
                >
                  Dịch Vụ
                </Button>
                {routeList.map(({ href, label }) => (
                  <Button
                    key={href}
                    onClick={() => {
                      setIsOpen(false);
                      const element = document.querySelector(href);
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }}
                    variant="ghost"
                    className="justify-start text-base"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <SheetFooter className="flex-col sm:flex-col justify-start items-start">
              <Separator className="mb-2" />

              <ToggleTheme />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* <!-- Desktop --> */}
      <NavigationMenu className="hidden lg:block mx-auto">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-card text-base">
              Giới Thiệu
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[400px] grid-cols-1 gap-5 p-4">
                <div className="flex flex-col gap-2">
                  <a
                    href="#benefits"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.querySelector("#benefits");
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }}
                    className="block rounded-md p-3 text-sm hover:bg-muted transition-colors cursor-pointer"
                  >
                    <p className="mb-1 font-semibold leading-none text-foreground">
                      Lợi Ích
                    </p>
                    <p className="line-clamp-2 text-muted-foreground">
                      Tại sao chọn Lockerly? Trải nghiệm tương lai của giao nhận hàng hóa với công nghệ AI tiên tiến.
                    </p>
                  </a>
                  <a
                    href="#features"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.querySelector("#features");
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }}
                    className="block rounded-md p-3 text-sm hover:bg-muted transition-colors cursor-pointer"
                  >
                    <p className="mb-1 font-semibold leading-none text-foreground">
                      Tính Năng
                    </p>
                    <p className="line-clamp-2 text-muted-foreground">
                      Tính năng mạnh mẽ cho cuộc sống hiện đại. Từ nhận diện khuôn mặt AI đến thanh toán tự động.
                    </p>
                  </a>
                  <a
                    href="#how-it-works"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.querySelector("#how-it-works");
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }}
                    className="block rounded-md p-3 text-sm hover:bg-muted transition-colors cursor-pointer"
                  >
                    <p className="mb-1 font-semibold leading-none text-foreground">
                      Cách Thức Hoạt Động
                    </p>
                    <p className="line-clamp-2 text-muted-foreground">
                      Tìm hiểu quy trình gửi hàng, nhận hàng và thuê tủ cá nhân một cách chi tiết và dễ hiểu.
                    </p>
                  </a>
                  <a
                    href="#services"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.querySelector("#services");
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }}
                    className="block rounded-md p-3 text-sm hover:bg-muted transition-colors cursor-pointer"
                  >
                    <p className="mb-1 font-semibold leading-none text-foreground">
                      Dịch Vụ
                    </p>
                    <p className="line-clamp-2 text-muted-foreground">
                      Dịch vụ tủ thông minh toàn diện cho các khu chung cư, văn phòng và ký túc xá hiện đại.
                    </p>
                  </a>
                </div>
                {/* <ul className="flex flex-col gap-2">
                  {featureList.map(({ title, description, href }) => (
                    <li key={title}>
                      <a
                        href={href}
                        onClick={(e) => {
                          e.preventDefault();
                          const element = document.querySelector(href);
                          if (element) {
                            element.scrollIntoView({ behavior: "smooth", block: "start" });
                          }
                        }}
                        className="block rounded-md p-3 text-sm hover:bg-muted transition-colors cursor-pointer"
                      >
                        <p className="mb-1 font-semibold leading-none text-foreground">
                          {title}
                        </p>
                        <p className="line-clamp-2 text-muted-foreground">
                          {description}
                        </p>
                      </a>
                    </li>
                  ))}
                </ul> */}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {routeList.map(({ href, label }) => (
            <NavigationMenuItem key={href}>
              <NavigationMenuLink asChild>
                <a 
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.querySelector(href);
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  className="text-base px-2"
                >
                  {label}
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="hidden lg:flex gap-2">
        <ToggleTheme />
        <Button asChild >
          <a href="/login">
            Quản trị viên
          </a>
        </Button>
      </div>
    </header>
  );
};

