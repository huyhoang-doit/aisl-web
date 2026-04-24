import { useMemo, useState } from "react";
import {
  DataTable,
  type Column,
  type QuickFilter,
} from "@/shared/components/DataTable";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { CheckCircle2, Eye, XCircle } from "lucide-react";
import { toast } from "sonner";
import {
  getStaffApplicationStatus,
  StaffApplicationStatus,
  type StaffApplication,
} from "../features/staffApplication/types/staffApplication.types";
import { useStaffApplication } from "../features/staffApplication/hooks/useStaffApplication";
import { staffApplicationService } from "../features/staffApplication/services/staffApplication.service";
import StaffApplicationDetailModal from "../features/staffApplication/components/StaffApplicationDetailModal";
import RoleSelector from "../features/user/components/RoleSelector";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

const statusBadge = (status: StaffApplication["status"]) => {
  const value = getStaffApplicationStatus(status);
  if (value === StaffApplicationStatus.APPROVED) {
    return <Badge variant="default">Đã duyệt</Badge>;
  }
  if (value === StaffApplicationStatus.REJECTED) {
    return <Badge variant="destructive">Đã từ chối</Badge>;
  }
  return <Badge variant="secondary">Chờ duyệt</Badge>;
};

const ManageStaffApplication = () => {
  const {
    applications,
    total,
    isLoading,
    isApproving,
    isRejecting,
    page,
    pageSize,
    setPage,
    setPageSize,
    handleSearch,
    handleFilter,
    handleClearFilters,
    approve,
    reject,
  } = useStaffApplication();

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<StaffApplication | null>(null);
  const [approveForm, setApproveForm] = useState<{
    roleId: string;
    reviewNote: string;
  }>({
    roleId: "",
    reviewNote: "",
  });
  const [rejectForm, setRejectForm] = useState<{
    reviewNote: string;
  }>({
    reviewNote: "",
  });

  const columns: Column<StaffApplication>[] = [
    {
      key: "legalName",
      header: "Họ tên",
      sortable: true,
      accessor: (row) => <div className="font-medium">{row.legalName || "—"}</div>,
    },
    {
      key: "role",
      header: "Vai trò ứng tuyển",
      sortable: true,
      accessor: (row) => row.role || "—",
    },
    {
      key: "licensePlate",
      header: "Biển số xe",
      sortable: true,
      accessor: (row) => (
        <div className="font-mono text-sm">{row.licensePlate || "—"}</div>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      sortable: true,
      accessor: (row) => statusBadge(row.status),
    },
    {
      key: "createdAt",
      header: "Ngày tạo",
      sortable: true,
      accessor: (row) =>
        row.createdAt ? new Date(row.createdAt).toLocaleDateString("vi-VN") : "—",
    },
  ];

  const quickFilters: QuickFilter[] = useMemo(
    () => [
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
          { value: "Chờ duyệt", label: "Chờ duyệt" },
          { value: "Đã duyệt", label: "Đã duyệt" },
          { value: "Đã từ chối", label: "Đã từ chối" },
        ],
      },
    ],
    []
  );

  const handleViewDetails = async (application: StaffApplication) => {
    try {
      const detail = await staffApplicationService.getById(application.id);
      setSelectedApplication(detail.data);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("Error loading staff application detail:", error);
      toast.error("Không tải được chi tiết đơn ứng tuyển");
    }
  };

  const handleOpenApproveDialog = (application: StaffApplication) => {
    setSelectedApplication(application);
    setApproveForm({
      roleId: "",
      reviewNote: "",
    });
    setIsApproveDialogOpen(true);
  };
  
  const handleOpenRejectDialog = (application: StaffApplication) => {
    setSelectedApplication(application);
    setRejectForm({
      reviewNote: "",
    });
    setIsRejectDialogOpen(true);
  };

  const confirmApprove = async () => {
    if (!selectedApplication?.id) return;
    if (!approveForm.roleId) {
      toast.error("Vui lòng chọn vai trò cho nhân viên");
      return;
    }
  
    try {
      await approve(selectedApplication.id, {
        roleId: approveForm.roleId,
        reviewNote: approveForm.reviewNote,
      });
      setIsApproveDialogOpen(false);
      setSelectedApplication(null);
    } catch (error) {
      console.error("Approve staff application failed:", error);
    }
  };
  
  const confirmReject = async () => {
    if (!selectedApplication?.id) return;
    if (!rejectForm.reviewNote.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }
  
    try {
      await reject(selectedApplication.id, {
        reviewNote: rejectForm.reviewNote,
      });
      setIsRejectDialogOpen(false);
      setSelectedApplication(null);
    } catch (error) {
      console.error("Reject staff application failed:", error);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản lý đơn đăng ký nhân viên</h1>
        <p className="text-muted-foreground mt-2">
          Xem, duyệt hoặc từ chối các đơn đăng ký nhân viên trong hệ thống.
        </p>
      </div>

      <DataTable
        data={applications}
        columns={columns}
        keyExtractor={(row) => row.id}
        customActions={[
          {
            label: "Xem chi tiết",
            icon: <Eye className="h-4 w-4" />,
            onClick: handleViewDetails,
            variant: "ghost",
          },
          {
            label: "Duyệt đơn",
            icon: <CheckCircle2 className="h-4 w-4" />,
            onClick: handleOpenApproveDialog,
            variant: "ghost",
            className: "text-green-600 hover:text-green-700",
            visible: (row) =>
              getStaffApplicationStatus(row.status) === StaffApplicationStatus.PENDING,
          },
          {
            label: "Từ chối đơn",
            icon: <XCircle className="h-4 w-4" />,
            onClick: handleOpenRejectDialog,
            variant: "ghost",
            className: "text-red-600 hover:text-red-700",
            visible: (row) =>
              getStaffApplicationStatus(row.status) === StaffApplicationStatus.PENDING,
          },
        ]}
        emptyMessage="Chưa có đơn đăng ký nhân viên"
        isLoading={isLoading}
        searchable
        searchPlaceholder="Tìm kiếm theo họ tên, vai trò, biển số..."
        onSearch={handleSearch}
        onFilter={handleFilter}
        quickFilters={quickFilters}
        onQuickFilterChange={() => setPage(1)}
        onClearFilters={handleClearFilters}
        pagination={{
          page,
          pageSize,
          total,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
          pageSizeOptions: [5, 10, 20, 50, 100],
        }}
      />

      <StaffApplicationDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        application={selectedApplication}
        onApprove={(app) => {
          setSelectedApplication(app);
          setIsDetailModalOpen(false);
          setIsApproveDialogOpen(true);
        }}
        onReject={(app) => {
          setSelectedApplication(app);
          setIsDetailModalOpen(false);
          setIsRejectDialogOpen(true);
        }}
      />

      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Duyệt đơn đăng ký nhân viên</DialogTitle>
            <DialogDescription>
              Vui lòng chọn vai trò và nhập ghi chú để duyệt đơn của{" "}
              <strong>{selectedApplication?.legalName}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="role">Vai trò gán cho nhân viên</Label>
              <RoleSelector
                value={approveForm.roleId}
                onValueChange={(val) => setApproveForm({ ...approveForm, roleId: val })}
                placeholder="Chọn vai trò (ví dụ: COURIER)"
              />
              <p className="text-[12px] text-muted-foreground">
                Nhân viên ứng tuyển cho vị trí: <span className="font-semibold">{selectedApplication?.role}</span>
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="note">Ghi chú (tùy chọn)</Label>
              <Textarea
                id="note"
                placeholder="Nhập ghi chú cho nhân viên..."
                value={approveForm.reviewNote}
                onChange={(e) => setApproveForm({ ...approveForm, reviewNote: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>Hủy</Button>
            <Button onClick={confirmApprove} disabled={isApproving}>
              {isApproving ? "Đang xử lý..." : "Xác nhận duyệt"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Từ chối đơn đăng ký</DialogTitle>
            <DialogDescription>
              Nhập lý do từ chối đơn của <strong>{selectedApplication?.legalName}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reject-note">Lý do từ chối</Label>
              <Textarea
                id="reject-note"
                placeholder="Ví dụ: Hình ảnh xe không rõ ràng..."
                value={rejectForm.reviewNote}
                onChange={(e) => setRejectForm({ reviewNote: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>Hủy</Button>
            <Button variant="destructive" onClick={confirmReject} disabled={isRejecting}>
              {isRejecting ? "Đang xử lý..." : "Xác nhận từ chối"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageStaffApplication;