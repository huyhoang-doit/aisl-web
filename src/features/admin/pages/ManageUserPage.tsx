import { useState, useMemo } from "react";
import {
  DataTable,
  type Column,
  type QuickFilter,
} from "@/shared/components/DataTable";
import {
  CreateOrUpdateUserModal,
  type UserFormData,
} from "../features/user/components/CreateOrUpdateUserModal";
import UserDetailModal from "../features/user/components/UserDetailModal";
import UserRoleComponent from "../features/user/components/UserRoleComponent";
import { useRoles } from "../features/user/hooks/useRoles";
import { getRoleDisplayName } from "@/shared/configs/role";
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
import StatusComponent from "@/shared/components/StatusComponent";
import { normalizeStatus } from "@/shared/components/statusConfig";
import { Eye, Lock, LockOpen } from "lucide-react";
import { authService } from "../../auth/services/auth.service";
import { userService } from "../features/user/services/user.service";
import { useUser } from "../features/user/hooks/useUser";
import type { User } from "../features/user/types/user.types";
import { toast } from "sonner";

const ManageUserPage = () => {
  const { roles } = useRoles();
  const {
    users,
    total,
    isLoading,
    page,
    pageSize,
    setUsers,
    setPage,
    setPageSize,
    refetch,
    handleSearch,
    handleFilter,
    handleClearFilters,
  } = useUser({ defaultPageSize: 10 });

  const roleFilterOptions = useMemo(
    () =>
      roles.filter((r) => r.name !== "admin_client").map((r) => ({
        value: r.name,
        label: getRoleDisplayName(r.name),
      })),
    [roles]
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLockDialogOpen, setIsLockDialogOpen] = useState(false);
  const [isUnlockDialogOpen, setIsUnlockDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [selectedRows, setSelectedRows] = useState<User[]>([]);

  const columns: Column<User>[] = [
    {
      key: "fullName",
      header: "Họ và tên",
      sortable: true,
      accessor: (row) => (
        <div className="font-medium">{row.fullName}</div>
      ),
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
      accessor: (row) => (
        <div className="text-muted-foreground">{row.email}</div>
      ),
    },
    {
      key: "phoneNumber",
      header: "Số điện thoại",
      sortable: true,
      accessor: (row) => row.phoneNumber,
    },
    {
      key: "role",
      header: "Vai trò",
      sortable: true,
      accessor: (row) => <UserRoleComponent user={row} />,
    },
    {
      key: "status",
      header: "Trạng thái",
      sortable: true,
      accessor: (row) => <StatusComponent status={row.status} />,
    },
  ];

  const handleSort = () => {
    setPage(1);
  };

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
        { value: "Hoạt động", label: "Hoạt động" },
        { value: "Không hoạt động", label: "Không hoạt động" },
        { value: "Đã khóa", label: "Đã khóa" },
      ],
    },
    {
      key: "role",
      label: "Vai trò",
      allStringValue: "Tất cả vai trò",
      placeholder: "Chọn vai trò",
      options: roleFilterOptions,
    },
  ];

  const handleCreate = () => {
    setSelectedUser(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEdit = async (user: User) => {
    try {
      const res = await userService.getDetail(user.id);
      setSelectedUser(res.data.user);  
      setModalMode("update");
      setIsDetailModalOpen(false);
      setIsModalOpen(true);
    } catch {
      toast.error("Không tải được thông tin người dùng");
    }
  };

  const handleLock = (user: User) => {
    setSelectedUser(user);
    setIsLockDialogOpen(true);
  };

  const handleUnlock = (user: User) => {
    setSelectedUser(user);
    setIsUnlockDialogOpen(true);
  };

  const handleViewDetails = async (user: User) => {
    try {
      const res = await userService.getDetail(user.id);
      setSelectedUser(res.data.user);
      setIsDetailModalOpen(true);
    } catch {
      toast.error("Không tải được chi tiết người dùng");
    }
  };

  const confirmLock = async () => {
    if (!selectedUser?.keycloakUserId && !selectedUser?.id) return;
    const userId = selectedUser.keycloakUserId || selectedUser.id;

    try {
      await userService.update(userId, { status: "BLOCKED" });
      setIsLockDialogOpen(false);
      setSelectedUser(null);
      refetch();
      toast.success("Khóa tài khoản thành công");
    } catch (error) {
      console.error("Error locking user:", error);
      toast.error("Có lỗi xảy ra khi khóa tài khoản");
    }
  };

  const confirmUnlock = async () => {
    if (!selectedUser?.keycloakUserId && !selectedUser?.id) return;
    const userId = selectedUser.keycloakUserId || selectedUser.id;

    try {
      await userService.update(userId, { status: "ACTIVE" });
      setIsUnlockDialogOpen(false);
      setSelectedUser(null);
      refetch();
      toast.success("Mở khóa tài khoản thành công");
    } catch (error) {
      console.error("Error unlocking user:", error);
      toast.error("Có lỗi xảy ra khi mở khóa tài khoản");
    }
  };

  const handleLockSelected = async () => {
    if (selectedRows.length === 0) return;

    try {
      await Promise.all(
        selectedRows.map((u) =>
          userService.update(u.keycloakUserId || u.id, { status: "BLOCKED" })
        )
      );
      setSelectedRows([]);
      toast.success(`Đã khóa ${selectedRows.length} tài khoản`);
      refetch();
    } catch (error) {
      console.error("Error locking users:", error);
      toast.error("Có lỗi xảy ra khi khóa tài khoản");
    }
  };

  const handleSubmit = async (data: UserFormData) => {
    try {
      if (modalMode === "create") {
        if (!data.password) {
          toast.error("Vui lòng nhập mật khẩu");
          return;
        }
        await authService.createAccout({
          email: data.email,
          password: data.password,
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          role: data.role,
        });
        toast.success("Thêm người dùng thành công");
        refetch();
      } else {
        if (!selectedUser?.keycloakUserId) return;
        await userService.update(selectedUser.keycloakUserId, data);
        toast.success("Cập nhật người dùng thành công");
        refetch();
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
              onClick={handleLockSelected}
              className="text-sm text-destructive hover:underline"
            >
              Khóa đã chọn
            </button>
          </div>
        </div>
      )}

      <DataTable
        data={users}
        columns={columns}
        keyExtractor={(row) => row.keycloakUserId || row.email}
        onEdit={handleEdit}
        onCreate={handleCreate}
        customActions={[
          {
            label: "Xem chi tiết",
            icon: <Eye className="h-4 w-4" />,
            onClick: handleViewDetails,
            variant: "ghost",
          },
          {
            label: "Mở khóa tài khoản",
            icon: <LockOpen className="h-4 w-4" />,
            onClick: handleUnlock,
            variant: "ghost",
            visible: (row) => normalizeStatus(row.status) === "BLOCKED",
          },
          {
            label: "Khóa tài khoản",
            icon: <Lock className="h-4 w-4" />,
            onClick: handleLock,
            variant: "ghost",
            visible: (row) => normalizeStatus(row.status) !== "BLOCKED",
          },
        ]}
        emptyMessage="Chưa có người dùng nào"
        isLoading={isLoading}
        filterable={false}
        onSort={handleSort}
        onFilter={handleFilter}
        pagination={{
          page,
          pageSize,
          total,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
          pageSizeOptions: [5, 10, 20, 50, 100],
        }}
        // selectable={true}
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
          onLock={handleLock}
        />
      )}

      <AlertDialog open={isLockDialogOpen} onOpenChange={setIsLockDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận khóa tài khoản</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn khóa tài khoản{" "}
              <strong>{selectedUser?.fullName}</strong>? Người dùng sẽ không thể
              đăng nhập cho đến khi được mở khóa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmLock}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Khóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isUnlockDialogOpen} onOpenChange={setIsUnlockDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận mở khóa tài khoản</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn mở khóa tài khoản{" "}
              <strong>{selectedUser?.fullName}</strong>? Người dùng sẽ có thể đăng
              nhập lại vào hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmUnlock}>
              Mở khóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageUserPage;
