import { Separator } from "@/components/ui/separator";
import { RotateCcwKeyIcon } from "lucide-react";

export const FooterSection = () => {
  return (
    <footer id="footer" className="container py-18 sm:py-32">
      <div className="p-10 bg-card border border-secondary rounded-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
          <div className="col-span-full xl:col-span-2">
            <a href="#" className="flex font-bold items-center">
              <RotateCcwKeyIcon className="w-9 h-9 mr-2 bg-gradient-to-tr from-primary via-primary/70 to-primary rounded-lg border border-secondary" />

              <h3 className="text-2xl">Lockerly</h3>
            </a>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Contact</h3>
            <div>
              <a href="#" className="opacity-60 hover:opacity-100">
                Github
              </a>
            </div>

            <div>
              <a href="#" className="opacity-60 hover:opacity-100">
                Twitter
              </a>
            </div>

            <div>
              <a href="#" className="opacity-60 hover:opacity-100">
                Instagram
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Platforms</h3>
            <div>
              <a href="#" className="opacity-60 hover:opacity-100">
                Web Application
              </a>
            </div>

            <div>
              <a href="#" className="opacity-60 hover:opacity-100">
                Mobile App
              </a>
            </div>

            <div>
              <a href="#" className="opacity-60 hover:opacity-100">
                IoT Dashboard
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Help</h3>
            <div>
              <a href="#" className="opacity-60 hover:opacity-100">
                Contact Us
              </a>
            </div>

            <div>
              <a href="#" className="opacity-60 hover:opacity-100">
                FAQ
              </a>
            </div>

            <div>
              <a href="#" className="opacity-60 hover:opacity-100">
                Feedback
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Socials</h3>
            <div>
              <a href="#" className="opacity-60 hover:opacity-100">
                Twitch
              </a>
            </div>

            <div>
              <a href="#" className="opacity-60 hover:opacity-100">
                Discord
              </a>
            </div>

            <div>
              <a href="#" className="opacity-60 hover:opacity-100">
                Dribbble
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-6" />
        <section className="">
          <h3 className="">
            &copy; 2025 AI-Powered Smart Locker (GSP26SE20) - 
            <span className="text-primary ml-1">SEP490-Lockerly Team</span>
          </h3>
        </section>
      </div>
    </footer>
  );
};

