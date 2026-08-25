import { useEffect, useState } from "react";
import {
  Bell,
  FileText,
  Search,
  Truck,
  Package,
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  Info,
  ShoppingBag,
  Clock,
  ChevronRight
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { Input } from "@/shared/components/ui/input";
import { Pagination } from "@/shared/components/ui/pagination";
import { notificationService } from "@/shared/services/notification.service";
import type { NotificationMessage, NotificationDetailResponse } from "@/shared/types/notification.types";
import { format } from "date-fns";

type ExtendedNotification = NotificationMessage & Partial<NotificationDetailResponse>;

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [notifications, setNotifications] = useState<ExtendedNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [meta, setMeta] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 10,
  });

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const res = await notificationService.getNotifications({
          page,
          limit: 10,
          search,
          orderBy: "createdAt",
          orderDirection: "DESC",
        });

        // The API might return either NotificationMessage[] or NotificationDetailResponse[]
        // We ensure we handle both body and content
        setNotifications(res.items);
        setMeta({
          totalItems: res.total,
          totalPages: res.totalPages,
          currentPage: res.page,
          itemsPerPage: res.limit,
        });
      } catch (error) {
        console.error("Failed to fetch user notifications:", error);
        toast.error("Không thể tải danh sách thông báo");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [page, search]);

  const handleSearch = (term: string) => {
    setSearchParams((prev) => {
      if (term.trim()) prev.set("search", term.trim());
      else prev.delete("search");
      prev.set("page", "1");
      return prev;
    });
  };

  const getCategoryIcon = (category?: string, type?: string) => {
    const combined = `${category}_${type}`.toUpperCase();

    if (combined.includes("LOGISTICS") || combined.includes("DISPATCH")) return <Truck className="h-4 w-4" />;
    if (combined.includes("ORDER")) return <ShoppingBag className="h-4 w-4" />;
    if (combined.includes("SYSTEM")) return <ShieldCheck className="h-4 w-4" />;
    if (combined.includes("ERROR")) return <AlertCircle className="h-4 w-4 text-destructive" />;
    if (combined.includes("WARNING")) return <AlertTriangle className="h-4 w-4 text-orange-500" />;

    switch (category) {
      case "LOGISTICS": return <Package className="h-4 w-4" />;
      case "SYSTEM": return <ShieldCheck className="h-4 w-4" />;
      case "INFO": return <Info className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (category?: string) => {
    switch (category) {
      case "LOGISTICS": return "bg-blue-500/10 text-blue-500 border-blue-200/50";
      case "ORDER": return "bg-green-500/10 text-green-500 border-green-200/50";
      case "ERROR": return "bg-destructive/10 text-destructive border-destructive/20";
      case "WARNING": return "bg-orange-500/10 text-orange-500 border-orange-200/50";
      default: return "bg-primary/10 text-primary border-primary/20";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" /> Thông báo hệ thống
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Theo dõi các cập nhật, cảnh báo và thông báo quan trọng.</p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm thông báo..."
            className="pl-10 h-10 rounded-xl bg-muted/50 border-border focus-visible:ring-primary/20"
            defaultValue={search}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch(e.currentTarget.value);
              }
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm font-medium px-3 py-1 bg-muted rounded-full text-muted-foreground">
          {meta.totalItems} thông báo
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="grid gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-muted/50 animate-pulse border border-border/50" />
            ))}
          </div>
        ) : notifications?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground bg-muted/5 rounded-2xl border-2 border-dashed border-border/50">
            <div className="h-16 w-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
              <Bell className="h-8 w-8 opacity-20" />
            </div>
            <p className="font-medium text-lg">Không tìm thấy thông báo nào</p>
            <p className="text-sm opacity-60">Hãy thử thay đổi từ khóa tìm kiếm của bạn.</p>
          </div>
        ) : (
          notifications?.map((item) => {
            const isRead = item.isRead ?? (item.status === "SENT" || item.status === "READ"); // Fallback for SENT status
            const content = item.content || item.body || "";
            
            return (
              <div
                key={item.id}
                onClick={() => {
                  const basePath = window.location.pathname.startsWith("/admin") ? "/admin" : "/staff";
                  window.open(`${basePath}/notifications/${item.id}`, "_blank");
                }}
                className={`group relative flex items-start gap-4 p-5 rounded-xl transition-all cursor-pointer border-2 shadow-sm hover:shadow-md ${
                  isRead 
                    ? "bg-card border-border hover:border-primary/30" 
                    : "bg-primary/5 border-primary/20 hover:border-primary/40"
                }`}
              >
                {!isRead && (
                  <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                )}

                <div className={`mt-1 h-10 w-10 shrink-0 flex items-center justify-center rounded-xl border-2 shadow-inner transition-transform group-hover:scale-110 ${getStatusColor(item.category)}`}>
                  {getCategoryIcon(item.category, item.type)}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-bold text-base truncate block ${!isRead ? "text-foreground" : "text-foreground/80"}`}>
                      {item.title}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {content}
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground/70 bg-muted/50 px-2 py-0.5 rounded-md">
                      <Clock className="h-3 w-3" />
                      {item.createdAt ? format(new Date(item.createdAt), "HH:mm dd/MM/yyyy") : "—"}
                    </span>
                    {item.category && (
                      <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/50">
                        {item.category}
                      </span>
                    )}
                  </div>
                </div>

                <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {meta.totalPages > 1 && (
        <div className="pt-4 flex justify-center">
          <Pagination
            current={meta.currentPage}
            total={meta.totalItems}
            pageSize={meta.itemsPerPage}
            onPageChange={(newPage) => {
              setSearchParams((prev) => {
                prev.set("page", String(newPage));
                return prev;
              });
            }}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;