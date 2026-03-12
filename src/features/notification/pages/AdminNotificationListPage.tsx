import { useEffect, useState, type MouseEvent } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Search,
  MoreHorizontal,
  Trash2,
  FileText,
  Bell,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { toast } from "sonner";
import { Pagination } from "@/shared/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";

import { notificationService } from "@/shared/services/notification.service";
import type { NotificationDetailResponse } from "@/shared/types/notification.types";

export default function AdminNotificationListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState<NotificationDetailResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [meta, setMeta] = useState({
    itemCount: 0,
    totalItems: 0,
    itemsPerPage: 10,
    totalPages: 0,
    currentPage: 1,
  });

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  
  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await notificationService.getAllNotificationsAdmin({
        page,
        limit: 10,
        search,
        orderBy: "createdAt",
        orderDirection: "DESC",
      });
      // Service returns res.data which is { items: [], total: ... }
      setNotifications(res.items);
      setMeta({
        itemCount: res.items.length,
        totalItems: res.total,
        itemsPerPage: res.limit,
        totalPages: res.totalPages,
        currentPage: res.page,
      });
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Không thể tải danh sách thông báo");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page, search]);

  const handleSearch = (term: string) => {
    setSearchParams((prev) => {
      if (term) prev.set("search", term);
      else prev.delete("search");
      prev.set("page", "1");
      return prev;
    });
  };

  const handleDeleteClick = (e: MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await notificationService.deleteNotification(deleteId);
      toast.success("Đã xóa thông báo");
      fetchNotifications();
    } catch (error: any) {
      console.log(error);
      toast.error("Xóa thất bại");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="h-6 w-6" /> Danh sách thông báo
        </h1>
        <Button variant="outline" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
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
              onClick={() => navigate(`/admin/notifications/${item.id}`)}
              className={`group flex items-center justify-between gap-4 p-4 rounded-lg transition-colors cursor-pointer ${
                item.status === 'PENDING' ? "bg-muted/30" : "bg-card hover:bg-accent/50"
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`h-2 w-2 rounded-full ${item.status === 'SENT' ? 'bg-green-500' : 'bg-gray-300'}`} />
                
                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-background border shadow-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm truncate">{item.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{item.content}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                   {new  Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(item.createdAt))}
                </span>
                <Button
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity bg-destructive/10 hover:bg-destructive/20 rounded-full h-8 w-8"
                  onClick={(e) => handleDeleteClick(e, item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {meta.totalPages > 1 && (
        <Pagination
            current={page}
            total={meta.totalItems}
            pageSize={10}
            onPageChange={(newPage) => {
              setSearchParams((prev) => {
                prev.set("page", String(newPage));
                return prev;
              });
            }}
          />
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa thông báo này không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
