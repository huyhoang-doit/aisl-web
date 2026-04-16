import { useEffect, useState } from "react";
import { Bell, FileText, Search } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { Input } from "@/shared/components/ui/input";
import { Pagination } from "@/shared/components/ui/pagination";
import { notificationService } from "@/shared/services/notification.service";
import type { NotificationMessage } from "@/shared/types/notification.types";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="h-6 w-6" /> Danh sách thông báo
        </h1>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground font-medium">
          {meta.totalItems} Thông báo
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm theo tiêu đề..."
            className="pl-9 rounded-full bg-muted/50 border-none"
            defaultValue={search}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch(e.currentTarget.value);
              }
            }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <div className="text-center py-10 text-muted-foreground">Đang tải...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">Không tìm thấy thông báo nào.</div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/staff/notifications/${item.id}`)}
              className={`group flex items-center justify-between gap-4 p-4 rounded-lg transition-colors cursor-pointer ${
                item.isRead ? "bg-card hover:bg-accent/50" : "bg-muted/30"
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`h-2 w-2 rounded-full ${item.isRead ? "bg-gray-300" : "bg-primary"}`} />

                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-background border shadow-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-sm truncate block">{item.title}</span>
                  <p className="text-sm text-muted-foreground line-clamp-1">{item.body}</p>
                </div>
              </div>

              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {new Intl.DateTimeFormat("vi-VN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }).format(new Date(item.createdAt))}
              </span>
            </div>
          ))
        )}
      </div>

      {meta.totalPages > 1 && (
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
      )}
    </div>
  );
};

export default NotificationsPage;