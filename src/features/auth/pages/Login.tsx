import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { roles } from "@/shared/configs/role";
import { Command } from "lucide-react";
import landingImage from "@/assets/landing-2.jpg";
import { useAuthStore } from "../store/auth.store";

const loginSchema = z.object({
  email: z.string().min(1, "Email không được để trống").email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Collect device info
      // Note: We need to import getDeviceInfo from shared utils.
      const { getDeviceInfo } = await import('@/shared/utils/device');
      const deviceInfo = await getDeviceInfo();

      await login({
        ...data,
        deviceInfo
      });
      
      // Lấy user từ store sau khi login thành công
      const user = useAuthStore.getState().user;
      
      // Redirect dựa trên role
      if (user?.roles.includes(roles.ADMIN)) {
        navigate("/admin/dashboard", { replace: true });
      } else if (user?.roles.includes(roles.TECHNICIAN)) {
        navigate("/staff/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      // Error đã được xử lý trong store (toast notification)
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-background">
      <div className="w-full max-w-6xl border-2 rounded-xl">
        <Card className="overflow-hidden border-0 shadow-2xl bg-background">
          <CardContent className="grid p-0 md:grid-cols-2">
            {/* Left Column - Login Form */}
            <div className="flex flex-col justify-center p-6 md:p-8 lg:p-12">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Logo and Header */}
                  <div className="flex flex-col items-start space-y-2 mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Link to="/">
                        <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm shadow-primary/20">
                        <Command className="size-5" />
                      </div>
                        </Link>
                     
                      <span className="text-xl font-bold">Lockerly</span>
                    </div>
                    <h1 className="text-3xl font-bold">Chào mừng quay trở lại</h1>
                    <p className="text-muted-foreground">
                      Đăng nhập vào tài khoản Lockerly của bạn
                    </p>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Nhập email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mật khẩu</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Nhập mật khẩu"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                      {error}
                    </div>
                  )}

                  {/* Login Button */}
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </Button>

                  {/* Register Link */}
                  {/* <div className="text-center text-sm">
                    Nếu bạn chưa có tài khoản?{" "}
                    <Link
                      to="#"
                      className="text-primary underline-offset-4 hover:underline font-medium"
                    >
                      Đăng ký ngay
                    </Link>
                  </div> */}
                </form>
              </Form>
            </div>

            {/* Right Column - Illustration */}
            <div className="relative hidden md:block bg-muted min-h-[600px]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5" />
              <img
                src={landingImage}
                alt="Lockerly Smart Locker System"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {/* <div className="relative z-10 h-full flex items-center justify-center p-8">
                <div className="text-center space-y-4 text-white drop-shadow-lg">
                  <h2 className="text-3xl font-bold">Hệ thống tủ thông minh</h2>
                  <p className="text-lg text-white/90">
                    Giải pháp quản lý tủ locker hiện đại với công nghệ AI
                  </p>
                </div>
              </div> */}
            </div>
          </CardContent>
        </Card>

        {/* Terms and Privacy */}
        {/* <div className="text-center text-xs text-muted-foreground mt-6 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          Bằng cách tiếp tục, bạn đồng ý với{" "}
          <Link to="#" className="text-primary">
            Điều khoản dịch vụ
          </Link>{" "}
          và{" "}
          <Link to="#" className="text-primary">
            Chính sách bảo mật
          </Link>{" "}
          của chúng tôi.
        </div> */}
      </div>
    </div>
  );
};

export default Login;