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
import { Command, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { KioskScreenLayout } from "../components/KioskScreenLayout";

const loginSchema = z.object({
  email: z.string().min(1, "Email không được để trống").email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Màn hình đăng nhập tại Kiosk.
 * Giao diện tối ưu màn hình dọc, nút và ô input to để dễ thao tác (touch).
 */
const KioskLoginPage = () => {
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
      await login(data);

    // Tạm thời chưa handle login in kiosk
    // TODO: Handle login in kiosk

    navigate("/kiosk/home", { replace: true });
    
    } catch {
      // Error đã được xử lý trong store (toast)
    }
  };

  return (
    <KioskScreenLayout className="items-center justify-center">
        {/* Nút quay lại */}
        <div className="w-full mb-4">
          <Button
            asChild
            variant="ghost"
            className="min-h-[56px] text-lg rounded-xl text-muted-foreground hover:text-foreground"
          >
            <Link to="/kiosk" className="flex items-center gap-2">
              <ArrowLeft className="size-6" />
              Quay lại
            </Link>
          </Button>
        </div>

        <Card className="w-full overflow-hidden border-0 shadow-xl bg-card/95 backdrop-blur">
          <CardContent className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/20">
                <Command className="size-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Đăng nhập
                </h1>
                <p className="text-base text-muted-foreground">
                  Nhập thông tin tài khoản
                </p>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Nhập email"
                          className="min-h-[64px] text-xl rounded-xl px-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-base" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Mật khẩu</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Nhập mật khẩu"
                          className="min-h-[64px] text-xl rounded-xl px-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-base" />
                    </FormItem>
                  )}
                />

                {error && (
                  <div className="text-base text-destructive bg-destructive/10 p-4 rounded-xl">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full min-h-[72px] text-xl font-semibold rounded-xl shadow-md"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
    </KioskScreenLayout>
  );
};

export default KioskLoginPage;
