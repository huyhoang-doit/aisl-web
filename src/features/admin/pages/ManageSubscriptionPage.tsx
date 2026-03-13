import { useState } from "react";
import {
  DataTable,
  type Column,
  type QuickFilter,
} from "@/shared/components/DataTable";
import CreateOrUpdateSubscriptionModal, {
  type SubscriptionFormData,
} from "../features/subscription/modals/CreateOrUpdateSubscriptionModal";
import SubscriptionDetailModal from "../features/subscription/modals/SubscriptionDetailModal";
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
import { Eye } from "lucide-react";
import { subscriptionService } from "../features/subscription/services/subscription.service";
import { useSubscription } from "../features/subscription/hooks/useSubscription";
import { usePlan } from "../features/plan/hooks/usePlan";
import type { Subscription } from "../features/subscription/types/subscription.types";
import StatusComponent from "@/shared/components/StatusComponent";
import { toast } from "sonner";

const ManageSubscriptionPage = () => {
  const { plans } = usePlan({ fetchOnMount: true });
  const {
    subscriptions,
    total,
    isLoading,
    page,
    pageSize,
    setSubscriptions,
    setPage,
    setPageSize,
    refetch,
    handleSearch,
    handleFilter,
    handleClearFilters,
  } = useSubscription({ defaultPageSize: 10 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");

  const columns: Column<Subscription>[] = [
    {
      key: "user",
      header: "Người dùng",
      sortable: true,
      accessor: (row) => (
        <div className="font-medium">
          {row.user?.fullName ?? row.user?.email ?? row.userId}
        </div>
      ),
    },
    {
      key: "plan",
      header: "Gói dịch vụ",
      sortable: true,
      accessor: (row) => (
        <div className="text-muted-foreground">
          {row.plan?.name ?? `ID: ${row.plan?.id ?? row.planId ?? "-"}`}
        </div>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      sortable: true,
      accessor: (row) => <StatusComponent status={row.status} />,
    },
    {
      key: "startDate",
      header: "Ngày bắt đầu",
      sortable: true,
      accessor: (row) =>
        row.startDate
          ? new Date(row.startDate).toLocaleDateString("vi-VN")
          : "-",
    },
    {
      key: "endDate",
      header: "Ngày kết thúc",
      sortable: true,
      accessor: (row) => {
        const end = row.endDate?.trim();
        return end ? new Date(end).toLocaleDateString("vi-VN") : "-";
      },
    },
  ];

  const quickFilters: QuickFilter[] = [
    {
      key: "sortOrder",
      label: "Sắp xếp",
      placeholder: "Sắp xếp",
      hideAllOption: true,
      defaultValue: "Mới nhất",
      options: [
        { value: "Mới nhất", label: "Mới nhất" },
        { value: "Cũ nhất", label: "Cũ nhất" },
      ],
    },
    {
      key: "status",
      label: "Trạng thái",
      allStringValue: "Tất cả trạng thái",
      placeholder: "Chọn trạng thái",
      options: [
        { value: "Đang hoạt động", label: "Đang hoạt động" },
        { value: "Tạm ngưng", label: "Tạm ngưng" },
        { value: "Hết hạn", label: "Hết hạn" },
        { value: "Đã hủy", label: "Đã hủy" },
      ],
    },
  ];

  // const handleCreate = () => {
  //   setSelectedSubscription(null);
  //   setModalMode("create");
  //   setIsModalOpen(true);
  // };

  const handleEdit = async (subscription: Subscription) => {
    try {
      const res = await subscriptionService.getDetail(subscription.id);
      setSelectedSubscription(res.data);
      setModalMode("update");
      setIsDetailModalOpen(false);
      setIsModalOpen(true);
    } catch {
      toast.error("Không tải được thông tin đăng ký dịch vụ");
    }
  };

  const handleDelete = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsDeleteDialogOpen(true);
  };

  const handleViewDetails = async (subscription: Subscription) => {
    try {
      const res = await subscriptionService.getDetail(subscription.id);
      setSelectedSubscription(res.data);
      setIsDetailModalOpen(true);
    } catch {
      toast.error("Không tải được chi tiết đăng ký dịch vụ");
    }
  };

  const confirmDelete = async () => {
    if (!selectedSubscription?.id) return;

    try {
      await subscriptionService.delete(selectedSubscription.id);
      setSubscriptions(subscriptions.filter((s) => s.id !== selectedSubscription.id));
      refetch();
      setIsDeleteDialogOpen(false);
      setSelectedSubscription(null);
      toast.success("Xóa đăng ký dịch vụ thành công");
    } catch (error) {
      console.error("Error deleting subscription:", error);
      toast.error("Có lỗi xảy ra khi xóa đăng ký dịch vụ");
    }
  };

  const handleSubmit = async (data: SubscriptionFormData) => {
    try {
      const payload = {
        userId: data.userId,
        planId: data.planId,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
        status: data.status,
      };

      if (modalMode === "create") {
        await subscriptionService.create(payload);
        toast.success("Thêm đăng ký dịch vụ thành công");
        refetch();
      } else {
        if (!selectedSubscription?.id) return;
        await subscriptionService.update(selectedSubscription.id, {
          startDate: data.startDate,
          endDate: data.endDate,
          status: data.status,
        });
        toast.success("Cập nhật đăng ký dịch vụ thành công");
        refetch();
      }

      setIsModalOpen(false);
      setSelectedSubscription(null);
    } catch (error) {
      console.error("Error saving subscription:", error);
      toast.error("Có lỗi xảy ra khi thêm/cập nhật đăng ký dịch vụ");
      throw error;
    }
  };

  const handleDetailModalClose = (open: boolean | Subscription) => {
    if (typeof open === "boolean") {
      setIsDetailModalOpen(open);
      if (!open) setSelectedSubscription(null);
    } else {
      setSubscriptions(
        subscriptions.map((s) => (s.id === open.id ? open : s))
      );
      setIsDetailModalOpen(false);
      setSelectedSubscription(null);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Quản lý đăng ký dịch vụ
        </h1>
        <p className="text-muted-foreground mt-2">
          Quản lý các đăng ký dịch vụ của người dùng với các gói đăng ký
        </p>
      </div>

      <DataTable
        data={subscriptions}
        columns={columns}
        keyExtractor={(row) => row.id}
        // onEdit={handleEdit}
        // onDelete={handleDelete}
        // onCreate={handleCreate}
        customActions={[
          {
            label: "Xem chi tiết",
            icon: <Eye className="h-4 w-4" />,
            onClick: handleViewDetails,
            variant: "ghost",
          },
        ]}
        emptyMessage="Chưa có đăng ký dịch vụ nào"
        isLoading={isLoading}
        filterable={false}
        onSort={() => setPage(1)}
        onFilter={handleFilter}
        pagination={{
          page,
          pageSize,
          total,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
          pageSizeOptions: [5, 10, 20, 50, 100],
        }}
        searchable={true}
        searchPlaceholder="Tìm kiếm theo người dùng, gói dịch vụ..."
        onSearch={handleSearch}
        quickFilters={quickFilters}
        onQuickFilterChange={() => setPage(1)}
        onClearFilters={handleClearFilters}
      />

      <CreateOrUpdateSubscriptionModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        subscriptionData={selectedSubscription}
        plans={plans}
        onSubmit={handleSubmit}
        mode={modalMode}
      />

      {selectedSubscription && (
        <SubscriptionDetailModal
          open={isDetailModalOpen}
          onOpenChange={handleDetailModalClose}
          subscription={selectedSubscription}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa đăng ký dịch vụ</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa đăng ký dịch vụ này? Hành động này không
              thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageSubscriptionPage;
