import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  Package,
  AlertCircle,
  AlertTriangle,
  Info,
  ShoppingBag,
  Clock,
  Calendar,
  ChevronLeft
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { notificationService } from "@/shared/services/notification.service";
import type { NotificationMessage, NotificationDetailResponse } from "@/shared/types/notification.types";
import { format } from "date-fns";
import { Separator } from "@/shared/components/ui/separator";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";

type ExtendedNotification = NotificationMessage & Partial<NotificationDetailResponse>;

const NotificationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [notification, setNotification] = useState<ExtendedNotification | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const isAdmin = window.location.pathname.startsWith("/admin");
        let detail;

        if (isAdmin) {
          detail = await notificationService.getNotificationDetail(id);
        } else {
          const res = await notificationService.getUserNotificationDetail(id);
          detail = (res?.data ?? res);
        }

        setNotification(detail);

        if (detail && !detail.isRead && detail.status !== "READ") {
          try {
            await notificationService.markAsRead(id);
          } catch (e) {
            console.warn("Failed to mark as read", e);
          }
        }
      } catch (error) {
        console.error("Failed to fetch notification detail:", error);
        toast.error("Không thể tải chi tiết thông báo");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const getCategoryIcon = (category?: string, type?: string) => {
    const combined = `${category}_${type}`.toUpperCase();
    if (combined.includes("LOGISTICS") || combined.includes("DISPATCH")) return <Truck className="h-5 w-5" />;
    if (combined.includes("ORDER")) return <ShoppingBag className="h-5 w-5" />;
    if (combined.includes("SYSTEM")) return <ShieldCheck className="h-5 w-5" />;
    if (combined.includes("ERROR")) return <AlertCircle className="h-5 w-5" />;
    if (combined.includes("WARNING")) return <AlertTriangle className="h-5 w-5" />;

    switch (category) {
      case "LOGISTICS": return <Package className="h-5 w-5" />;
      case "SYSTEM": return <ShieldCheck className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "LOGISTICS": return "bg-blue-500 text-white";
      case "ORDER": return "bg-green-500 text-white";
      case "ERROR": return "bg-destructive text-destructive-foreground";
      case "WARNING": return "bg-orange-500 text-white";
      default: return "bg-primary text-primary-foreground";
    }
  };

  if (isLoading) return (
    <div className="container mx-auto py-20 text-center space-y-4">
      <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto" />
      <p className="text-muted-foreground animate-pulse">Đang tải nội dung thông báo...</p>
    </div>
  );

  if (!notification) return (
    <div className="container mx-auto py-20 text-center">
      <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
      <h2 className="text-xl font-bold">Không tìm thấy thông báo</h2>
      <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
        <ChevronLeft className="mr-2 h-4 w-4" /> Quay lại
      </Button>
    </div>
  );

  const content = notification.content || notification.body || "";

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Chi tiết thông báo</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest h-5 px-2 bg-muted/50">
                {notification.category || "General"}
              </Badge>
              <span className="text-muted-foreground text-xs font-mono">{notification.id}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-2 shadow-sm overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="bg-muted/30 border-b pb-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                  {notification.title}
                </CardTitle>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="h-4 w-4" />
                    {notification.createdAt ? format(new Date(notification.createdAt), "dd/MM/yyyy") : "—"}
                  </span>
                  <span className="text-muted-foreground/30">•</span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="h-4 w-4" />
                    {notification.createdAt ? format(new Date(notification.createdAt), "HH:mm:ss") : "—"}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="prose dark:prose-invert max-w-none text-foreground/90 text-lg leading-relaxed whitespace-pre-wrap bg-muted/10 p-6 md:p-10 rounded-2xl border border-dashed border-primary/20 italic font-medium">
              {content}
            </div>

            <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Nguồn: Hệ thống quản trị AI Lockerly</span>
              </div>
              {notification.status && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Trạng thái gửi:</span>
                  <Badge variant={notification.status === "SENT" ? "default" : "outline"} className="text-[10px] px-3">
                    {notification.status}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-sm border-2 overflow-hidden">
            <CardHeader className="bg-primary/5 border-b py-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" /> Thông tin bổ sung
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border">
                <Avatar className={`h-12 w-12 shadow-sm ${getCategoryColor(notification.category)}`}>
                  <AvatarFallback className="bg-transparent">
                    {getCategoryIcon(notification.category, notification.type)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Phân loại</p>
                  <p className="text-sm font-bold">{notification.category || "General"}</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Mã định danh:</span>
                  <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">...{notification.id.slice(-8)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Ngày tạo:</span>
                  <span className="font-medium">{notification.createdAt ? format(new Date(notification.createdAt), "dd/MM/yyyy") : "—"}</span>
                </div>
                {notification.updatedAt && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Cập nhật lúc:</span>
                    <span className="font-medium">{format(new Date(notification.updatedAt), "HH:mm")}</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="bg-blue-500/5 border border-blue-200 dark:border-blue-900/30 p-4 rounded-xl space-y-2">
                <p className="text-[11px] text-blue-700 dark:text-blue-400 leading-relaxed italic">
                  Thông báo này được gửi tự động đến tài khoản của bạn. Vui lòng không trả lời trực tiếp tin nhắn này.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailPage;