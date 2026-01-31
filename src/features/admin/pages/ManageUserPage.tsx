import { useState } from "react";
import {
  DataTable,
  type Column,
  type FilterConfig,
  type QuickFilter,
} from "@/shared/components/DataTable";
import {
  CreateOrUpdateUserModal,
  type UserFormData,
} from "../features/user/components/CreateOrUpdateUserModal";
import UserDetailModal from "../features/user/components/UserDetailModal";
import { Badge } from "@/shared/components/ui/badge";
import { roles } from "@/shared/configs/role";
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
import { userService } from "../features/user/services/user.service";
import { useUser } from "../features/user/hooks/useUser";
import type { User } from "../features/user/types/user.types";
import { getUserStatusDisplay } from "../features/user/types/user.types";
import { toast } from "sonner";

const STATUS_CONFIG = {
  ACTIVE: { label: "Hoạt động", variant: "default" as const },
  INACTIVE: { label: "Không hoạt động", variant: "secondary" as const },
  LOCKED: { label: "Đã khóa", variant: "destructive" as const },
};

const ManageUserPage = () => {
  const {
    users,
    total,
    isLoading,
    page,
    pageSize,
    setUsers,
    setTotal,
    setPage,
    setPageSize,
    refetch,
    handleSearch,
    handleFilter,
    handleClearFilters,
  } = useUser({ defaultPageSize: 10 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [selectedRows, setSelectedRows] = useState<User[]>([]);

  const columns: Column<User>[] = [
    {
      key: "fullName",
      header: "Họ và tên",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Tìm theo tên",
      accessor: (row) => (
        <div className="font-medium">{row.fullName}</div>
      ),
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Tìm theo email",
      accessor: (row) => (
        <div className="text-muted-foreground">{row.email}</div>
      ),
    },
    {
      key: "phoneNumber",
      header: "Số điện thoại",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Tìm theo số điện thoại",
      accessor: (row) => row.phoneNumber,
    },
    {
      key: "role",
      header: "Vai trò",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: ["Quản trị viên", "Nhân viên"],
      accessor: (row) => (
        <Badge
          variant={row.role === roles.ADMIN ? "default" : "secondary"}
        >
          {row.role === roles.ADMIN ? "Quản trị viên" : "Nhân viên"}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: ["Hoạt động", "Không hoạt động", "Đã khóa"],
      accessor: (row) => {
        const statusValue = getUserStatusDisplay(row.status);
        const config = STATUS_CONFIG[statusValue];
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
  ];

  const handleSort = () => {
    setPage(1);
  };

  const handleFilterChange = (newFilters: FilterConfig[]) => {
    handleFilter(newFilters);
  };

  const quickFilters: QuickFilter[] = [
    {
      key: "status",
      label: "Trạng thái",
      placeholder: "Chọn trạng thái",
      options: [
        { value: "Hoạt động", label: "Hoạt động" },
        { value: "Không hoạt động", label: "Không hoạt động" },
        { value: "Đã khóa", label: "Đã khóa" },
      ],
    },
  ];

  const handleCreate = () => {
    setSelectedUser(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setModalMode("update");
    setIsDetailModalOpen(false);
    setIsModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser?.keycloakUserId) return;

    try {
      await userService.delete(selectedUser.keycloakUserId);
      setUsers(users.filter((u) => u.keycloakUserId !== selectedUser.keycloakUserId));
      setTotal((prev) => Math.max(0, prev - 1));
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      setSelectedRows(selectedRows.filter((r) => r.keycloakUserId !== selectedUser.keycloakUserId));

      if (users.length <= 1 && page > 1) {
        setPage(Math.max(1, page - 1));
      }

      toast.success("Xóa người dùng thành công");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Có lỗi xảy ra khi xóa người dùng");
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) return;

    try {
      await Promise.all(
        selectedRows.map((u) => userService.delete(u.keycloakUserId))
      );
      setUsers(
        users.filter((u) => !selectedRows.some((r) => r.keycloakUserId === u.keycloakUserId))
      );
      setTotal((prev) => Math.max(0, prev - selectedRows.length));
      setSelectedRows([]);
      toast.success(`Đã xóa ${selectedRows.length} người dùng`);
      refetch();
    } catch (error) {
      console.error("Error deleting users:", error);
      toast.error("Có lỗi xảy ra khi xóa người dùng");
    }
  };

  const handleSubmit = async (data: UserFormData) => {
    try {
      if (modalMode === "create") {
        const payload = {
          email: data.email,
          phoneNumber: data.phoneNumber,
          fullName: data.fullName,
          password: data.password!,
          role: data.role,
          status: data.status,
          isVerified: data.isVerified,
        };
        await userService.create(payload);
        toast.success("Thêm người dùng thành công");
        refetch();
      } else {
        if (!selectedUser?.keycloakUserId) return;
        const payload = {
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          role: data.role,
          status: data.status,
          isVerified: data.isVerified,
          ...(data.password && { password: data.password }),
        };
        const response = await userService.update(
          selectedUser.keycloakUserId,
          payload
        );
        setUsers(
          users.map((u) =>
            u.keycloakUserId === selectedUser.keycloakUserId ? response.data : u
          )
        );
        toast.success("Cập nhật người dùng thành công");
      }

      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Có lỗi xảy ra khi thêm/cập nhật người dùng");
      throw error;
    }
  };

  const handleDetailModalClose = (open: boolean | User) => {
    if (typeof open === "boolean") {
      setIsDetailModalOpen(open);
      if (!open) setSelectedUser(null);
    } else {
      setUsers(
        users.map((u) =>
          u.keycloakUserId === open.keycloakUserId ? open : u
        )
      );
      setIsDetailModalOpen(false);
      setSelectedUser(null);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản lý người dùng</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý thông tin và quyền truy cập của người dùng trong hệ thống
        </p>
      </div>

      {selectedRows.length > 0 && (
        <div className="flex items-center justify-between rounded-md border border-border bg-card p-4">
          <div className="text-sm text-muted-foreground">
            Đã chọn <strong>{selectedRows.length}</strong> mục
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDeleteSelected}
              className="text-sm text-destructive hover:underline"
            >
              Xóa đã chọn
            </button>
          </div>
        </div>
      )}

      <DataTable
        data={users}
        columns={columns}
        keyExtractor={(row) => row.keycloakUserId || row.email}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        customActions={[
          {
            label: "Xem chi tiết",
            onClick: handleViewDetails,
            variant: "ghost",
          },
        ]}
        emptyMessage="Chưa có người dùng nào"
        isLoading={isLoading}
        filterable={true}
        onSort={handleSort}
        onFilter={handleFilterChange}
        pagination={{
          page,
          pageSize,
          total,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
          pageSizeOptions: [5, 10, 20, 50, 100],
        }}
        selectable={true}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        searchable={true}
        searchPlaceholder="Tìm kiếm theo tên, email, số điện thoại..."
        onSearch={handleSearch}
        quickFilters={quickFilters}
        onQuickFilterChange={() => setPage(1)}
        onClearFilters={handleClearFilters}
      />

      <CreateOrUpdateUserModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        userData={selectedUser}
        onSubmit={handleSubmit}
        mode={modalMode}
      />

      {selectedUser && (
        <UserDetailModal
          open={isDetailModalOpen}
          onOpenChange={handleDetailModalClose}
          user={selectedUser}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa người dùng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa người dùng{" "}
              <strong>{selectedUser?.fullName}</strong>? Hành động này không thể
              hoàn tác.
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

export default ManageUserPage;
