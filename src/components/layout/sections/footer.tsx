import { Separator } from "@/components/ui/separator";
import { RotateCcwKeyIcon } from "lucide-react";

export const FooterSection = () => {
  return (
    <footer id="footer" className="container py-8 sm:py-12">
      <div className="p-10 bg-card border border-secondary rounded-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
          <div className="col-span-full xl:col-span-2">
            <a href="#" className="flex font-bold items-center">
              <RotateCcwKeyIcon className="w-9 h-9 mr-2 bg-gradient-to-tr from-primary via-primary/70 to-primary rounded-lg border border-secondary" />

              <h3 className="text-2xl">Lockerly</h3>
            </a>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Liên Hệ</h3>
            <div>
              <a href="#" className="opacity-60 hover:opacity-100">
                Github
              </a>
            </div>

            <div>
              <a href="#" className="opacity-60 hover:opacity-100">
                Email
              </a>
            </div>

            <div>
              <a href="#" className="opacity-60 hover:opacity-100">
                Liên Hệ Hỗ Trợ
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Nền Tảng</h3>
            <div>
              <a href="#" className="opacity-60 hover:opacity-100">
                Ứng Dụng Web
              </a>
            </div>

            <div>
              <a href="#" className="opacity-60 hover:opacity-100">
                Ứng Dụng Di Động
              </a>
            </div>

            <div>
              <a href="#" className="opacity-60 hover:opacity-100">
                Bảng Điều Khiển IoT
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Hỗ Trợ</h3>
            <div>
              <a href="#contact" className="opacity-60 hover:opacity-100">
                Liên Hệ Chúng Tôi
              </a>
            </div>

            <div>
              <a href="#faq" className="opacity-60 hover:opacity-100">
                Câu Hỏi Thường Gặp
              </a>
            </div>

            <div>
              <a href="#" className="opacity-60 hover:opacity-100">
                Phản Hồi
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Mạng Xã Hội</h3>
            <div>
              <a href="#" className="opacity-60 hover:opacity-100">
                Facebook
              </a>
            </div>

            <div>
              <a href="#" className="opacity-60 hover:opacity-100">
                LinkedIn
              </a>
            </div>

            <div>
              <a href="#" className="opacity-60 hover:opacity-100">
                Twitter
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

