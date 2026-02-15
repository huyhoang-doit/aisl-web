import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MoreHorizontal, ShieldCheck } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { toast } from "sonner";
import { notificationService } from "@/shared/services/notification.service";
import type { NotificationDetailResponse } from "@/shared/types/notification.types";

export default function AdminNotificationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [notification, setNotification] = useState<NotificationDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const res: any = await notificationService.getNotificationDetail(id);
        // Service already returns specific detail object (unwrapped data)
        setNotification(res);
      } catch (error) {
        console.error("Failed to fetch notification detail:", error);
        toast.error("Không thể tải chi tiết thông báo");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Đang tải...</div>;
  if (!notification) return <div className="p-8 text-center text-muted-foreground">Không tìm thấy thông báo</div>;

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <Button 
        variant="ghost" 
        className="mb-4 pl-0 hover:pl-2 transition-all"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
      </Button>

      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        {/* Header with Sender Info */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage src="/placeholder-logo.png" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                <ShieldCheck className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">Hệ thống</h3>
                <span className="text-muted-foreground">•</span>
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                {new Intl.DateTimeFormat('vi-VN', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(notification.createdAt))}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{notification.title}</h1>
          
          <div className="prose dark:prose-invert max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap">
            {notification.content}
          </div>
          
          {/* Example Action Button Area if needed */}
          <div className="pt-4 border-t mt-8">
            <p className="text-sm text-muted-foreground italic">
              Thông báo này được gửi tự động từ hệ thống.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
