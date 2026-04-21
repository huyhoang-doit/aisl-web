import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Plus, Pencil, Trash2, MapPin, Navigation, LayoutGrid, Smartphone, Info, Link2, Eye } from "lucide-react";
import CabinetTable from "../../cabinet/components/CabinetTable";
import CabinetDetailModal from "../../cabinet/modals/CabinetDetailModal";
import CreateOrUpdateCabinetModal, { type CabinetFormData } from "../../cabinet/modals/CreateOrUpdateCabinetModal";
import AssignCabinetModal from "./AssignCabinetModal";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
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
import type { Location } from "../../location/types/location.types";
import type { Cabinet } from "../../cabinet/types/cabinet.types";
import { locationService } from "../services/location.service";
import { cabinetService } from "../../cabinet/services/cabinet.service";
import { toast } from "sonner";
import { TechnicalTaskStatus, TechnicalTaskType, TechnicalTaskPriority } from "../../task/types/task.types";
import { ClipboardList, Calendar } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { TaskDetailModal } from "../../task/modals/TaskDetailModal";
import WorkLogTable from "../../task/components/WorkLogTable";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import type { TechWorkLog } from "../../task/types/task.types";
import { taskService } from "../../task/services/task.service";

interface LocationDetailModalProps {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (open: boolean | Location) => void;
  location: Location;
  // eslint-disable-next-line no-unused-vars
  onEdit?: (location: Location) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete?: (location: Location) => void;
  // eslint-disable-next-line no-unused-vars
  onUpdateLocation?: (location: Location) => void;
}

const DEFAULT_PAGE_SIZE = 10;

const LocationDetailModal: React.FC<LocationDetailModalProps> = ({
  open,
  onOpenChange,
  location,
  onEdit,
  onDelete,
}) => {
  const [cabinets, setCabinets] = useState<Cabinet[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCabinetModalOpen, setIsCabinetModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isCabinetDetailModalOpen, setIsCabinetDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCabinet, setSelectedCabinet] = useState<Cabinet | null>(null);
  const [cabinetModalMode, setCabinetModalMode] = useState<"create" | "update">("create");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);
  
  // Work logs state
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
  const [taskWorkLogs, setTaskWorkLogs] = useState<Record<string, TechWorkLog[]>>({});
  const [loadingWorkLogs, setLoadingWorkLogs] = useState<Record<string, boolean>>({});

  const handleToggleWorkLogs = async (taskId: string) => {
    const isExpanded = !!expandedTasks[taskId];
    setExpandedTasks(prev => ({ ...prev, [taskId]: !isExpanded }));

    // If expanding and logs not loaded, fetch them
    if (!isExpanded && !taskWorkLogs[taskId]) {
      try {
        setLoadingWorkLogs(prev => ({ ...prev, [taskId]: true }));
        const response = await taskService.getWorkLogsByTaskId(taskId);
        setTaskWorkLogs(prev => ({ ...prev, [taskId]: response.data.workLogs || [] }));
      } catch (error) {
        console.error("Error loading work logs:", error);
        toast.error("Không tải được báo cáo công việc");
      } finally {
        setLoadingWorkLogs(prev => ({ ...prev, [taskId]: false }));
      }
    }
  };

  const loadCabinets = useCallback(async () => {
    if (!open || !location.id) return;
    try {
      setIsLoading(true);
      const response = await locationService.getCabinetLocation(location.id, {
        page,
        limit: pageSize,
        ...(searchQuery.trim() ? { search: searchQuery.trim() } : {}),
      });
      setCabinets(response.data.cabinets ?? []);
      setTotal(response.data.pagination?.total ?? 0);
    } catch (error) {
      console.error("Error loading cabinets:", error);
      toast.error("Không tải được danh sách cabinet");
      setCabinets([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [open, location.id, page, pageSize, searchQuery]);

  useEffect(() => {
    loadCabinets();
  }, [loadCabinets]);

  const handleClose = () => {
    if (typeof onOpenChange === "function") {
      onOpenChange(false);
    }
  };

  const handleCreateCabinet = () => {
    setSelectedCabinet(null);
    setCabinetModalMode("create");
    setIsCabinetModalOpen(true);
  };

  const handleEditCabinet = (cabinet: Cabinet) => {
    setSelectedCabinet(cabinet);
    setCabinetModalMode("update");
    setIsCabinetModalOpen(true);
  };

  const handleDeleteCabinet = (cabinet: Cabinet) => {
    setSelectedCabinet(cabinet);
    setIsDeleteDialogOpen(true);
  };

  const handleUnassignCabinet = async (cabinet: Cabinet) => {
    try {
      await locationService.unassignCabinet(location.id, cabinet.id);
      toast.success("Đã gỡ cụm tủ khỏi địa điểm");
      loadCabinets();
    } catch (error) {
      console.error("Error unassigning cabinet:", error);
      toast.error("Không gỡ được cụm tủ");
    }
  };

  const confirmDeleteCabinet = async () => {
    if (!selectedCabinet?.id) return;
    try {
      await cabinetService.delete(selectedCabinet.id);
      toast.success("Đã xóa cabinet");
      setIsDeleteDialogOpen(false);
      setSelectedCabinet(null);
      loadCabinets();
    } catch (error) {
      console.error("Error deleting cabinet:", error);
      toast.error("Không xóa được cabinet");
    }
  };

  const handleCabinetSubmit = async (data: CabinetFormData) => {
    try {
      if (cabinetModalMode === "create") {
        await cabinetService.create({
          ...data,
          locationId: location.id,
        });
        toast.success("Đã thêm cabinet");
      } else if (selectedCabinet?.id) {
        await cabinetService.update(selectedCabinet.id, {
          ...data,
          locationId: data.locationId || location.id,
        });
        toast.success("Đã cập nhật cabinet");
      }
      setIsCabinetModalOpen(false);
      setSelectedCabinet(null);
      loadCabinets();
    } catch (error) {
      console.error("Error saving cabinet:", error);
      toast.error(cabinetModalMode === "create" ? "Không tạo được cabinet" : "Không cập nhật được cabinet");
      throw error;
    }
  };

  const handleViewCabinetDetails = (cabinet: Cabinet) => {
    setSelectedCabinet(cabinet);
    setIsCabinetDetailModalOpen(true);
  };

  const handleEditLocation = () => {
    if (onEdit) {
      onEdit(location);
      handleClose();
    }
  };

  const handleDeleteLocation = () => {
    if (onDelete) {
      onDelete(location);
      handleClose();
    }
  };

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  }, []);

  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q);
    setPage(1);
  }, []);

  const paginationConfig = useMemo(
    () => ({
      page,
      pageSize,
      total,
      onPageChange: handlePageChange,
      onPageSizeChange: handlePageSizeChange,
      pageSizeOptions: [5, 10, 20] as number[],
    }),
    [page, pageSize, total, handlePageChange, handlePageSizeChange]
  );

  const TASK_TYPE_LABELS: Record<string, string> = {
    [TechnicalTaskType.REPAIR]: "Sửa chữa",
    [TechnicalTaskType.INSPECTION]: "Kiểm tra",
    [TechnicalTaskType.SETUP]: "Lắp đặt",
    [TechnicalTaskType.MAINTENANCE]: "Bảo trì",
  };

  const TASK_STATUS_LABELS: Record<string, string> = {
    [TechnicalTaskStatus.OPEN]: "Mở",
    [TechnicalTaskStatus.ASSIGNED]: "Đã giao",
    [TechnicalTaskStatus.IN_PROGRESS]: "Đang xử lý",
    [TechnicalTaskStatus.COMPLETED]: "Hoàn thành",
    [TechnicalTaskStatus.RESOLVED]: "Đã xác nhận",
    [TechnicalTaskStatus.CANCELLED]: "Đã hủy",
    [TechnicalTaskStatus.OVERDUE]: "Quá hạn",
  };

  const TASK_STATUS_BADGE_CLASS: Record<string, string> = {
    [TechnicalTaskStatus.OPEN]: "bg-slate-100 text-slate-800 border-slate-300",
    [TechnicalTaskStatus.ASSIGNED]: "bg-indigo-100 text-indigo-800 border-indigo-300",
    [TechnicalTaskStatus.IN_PROGRESS]: "bg-amber-100 text-amber-800 border-amber-300",
    [TechnicalTaskStatus.COMPLETED]: "bg-emerald-100 text-emerald-800 border-emerald-300",
    [TechnicalTaskStatus.RESOLVED]: "bg-teal-100 text-teal-800 border-teal-300",
    [TechnicalTaskStatus.CANCELLED]: "bg-rose-100 text-rose-800 border-rose-300",
    [TechnicalTaskStatus.OVERDUE]: "bg-orange-100 text-orange-800 border-orange-300",
  };

  const handleViewTaskDetail = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsTaskDetailModalOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-xl font-bold">{location.name}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 mt-2">
                  <MapPin className="h-4 w-4" />
                  <span>{location.address}</span>
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2 mr-5">
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditLocation}
                    className="gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    Sửa địa điểm
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteLocation}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Xóa địa điểm
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Left side: Coordinates & Description */}
            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Navigation className="h-4 w-4" />
                  <span className="font-semibold">Tọa độ:</span>
                  <span className="font-mono">
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-muted-foreground">Trạng thái:</span>
                  <Badge variant={location.isActive ? "success" : "destructive"}>
                    {location.isActive ? "Hoạt động" : "Không hoạt động"}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-muted-foreground">
                  <Info className="h-4 w-4" />
                  <span>Mô tả</span>
                </div>
                <div className="rounded-md border border-border bg-muted/30 p-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {location.description || "Không có mô tả cho địa điểm này."}
                  </p>
                </div>
              </div>
            </div>

            {/* Right side: Planned Quantities */}
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-4">
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-primary/10 p-3 text-primary">
                      <LayoutGrid className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Cabinet dự kiến</p>
                      <h4 className="text-2xl font-bold">{location.plannedCabinetQuantity}</h4>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-blue-500/10 p-3 text-blue-500">
                      <Smartphone className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Locker dự kiến</p>
                      <h4 className="text-2xl font-bold">{location.plannedLockerQuantity}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-2" />

          {/* Ongoing Tasks Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Công việc đang thực hiện</h3>
              {location.tasks && location.tasks.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {location.tasks.length}
                </Badge>
              )}
            </div>

            {!location.tasks || location.tasks.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-8 text-center bg-muted/20">
                <p className="text-sm text-muted-foreground">Hiện không có công việc nào đang xử lý tại địa điểm này.</p>
              </div>
            ) : (
              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[40px]"></TableHead>
                      <TableHead className="w-[100px]">Mã task</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Ưu tiên</TableHead>
                      <TableHead>Người phụ trách</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {location.tasks.map((task) => (
                      <React.Fragment key={task.id}>
                        <TableRow className="hover:bg-muted/30">
                          <TableCell className="p-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleToggleWorkLogs(task.id)}
                            >
                              {expandedTasks[task.id] ? (
                                <ChevronUp className="h-4 w-4 text-primary" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell className="font-mono text-xs font-medium">{task.code}</TableCell>
                          <TableCell>
                            <span className="text-sm">{TASK_TYPE_LABELS[task.taskType] || task.taskType}</span>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                task.priority === TechnicalTaskPriority.HIGH || task.priority === TechnicalTaskPriority.URGENT 
                                  ? "destructive" 
                                  : task.priority === TechnicalTaskPriority.MEDIUM 
                                    ? "default" 
                                    : "secondary"
                              }
                              className="text-[10px] px-1.5 py-0"
                            >
                              {task.priority || "-"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{task.assignedToName || "-"}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`text-[10px] ${TASK_STATUS_BADGE_CLASS[task.status] || ""}`}>
                              {TASK_STATUS_LABELS[task.status] || task.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {task.createdAt ? new Date(task.createdAt).toLocaleDateString("vi-VN") : "-"}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                             <div className="flex items-center justify-end gap-1">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 gap-1.5 text-[11px] px-2 py-0"
                                onClick={() => handleToggleWorkLogs(task.id)}
                              >
                                <FileText className="h-3.5 w-3.5" />
                                Xem báo cáo
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => handleViewTaskDetail(task.id)}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">Xem chi tiết</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        
                        {/* Expanded Work Logs Row */}
                        {expandedTasks[task.id] && (
                          <TableRow className="bg-muted/10 border-b border-border/50">
                            <TableCell colSpan={8} className="p-4 pb-6">
                              <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                                <div className="flex items-center justify-between mb-3 px-1">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                    <h4 className="text-sm font-semibold">Báo cáo công việc - {task.code}</h4>
                                  </div>
                                  {loadingWorkLogs[task.id] && (
                                     <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                       <div className="h-3 w-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                       Đang tải...
                                     </div>
                                  )}
                                </div>
                                <WorkLogTable workLogs={taskWorkLogs[task.id] || []} />
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <Separator className="my-2" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Danh sách Cabinet</h3>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsAssignModalOpen(true)}
                  className="gap-2 border-primary text-primary hover:bg-primary/5"
                >
                  <Link2 className="h-4 w-4" />
                  Gán cụm tủ
                </Button>
                <Button size="sm" onClick={handleCreateCabinet} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Thêm cabinet mới
                </Button>
              </div>
            </div>

            <CabinetTable
              cabinets={cabinets}
              onEdit={handleEditCabinet}
              onDelete={handleDeleteCabinet}
              onUnassign={handleUnassignCabinet}
              onViewDetails={handleViewCabinetDetails}
              isLoading={isLoading}
              pagination={paginationConfig}
              searchable
              searchPlaceholder="Tìm theo tên cabinet..."
              onSearch={handleSearch}
            />
          </div>
        </DialogContent>
      </Dialog>

      <CreateOrUpdateCabinetModal
        open={isCabinetModalOpen}
        onOpenChange={setIsCabinetModalOpen}
        cabinetData={selectedCabinet}
        onSubmit={handleCabinetSubmit}
        mode={cabinetModalMode}
        defaultLocationId={location.id}
      />

      <AssignCabinetModal
        open={isAssignModalOpen}
        onOpenChange={setIsAssignModalOpen}
        location={location}
        onSuccess={loadCabinets}
      />

      {selectedCabinet && (
        <CabinetDetailModal
          open={isCabinetDetailModalOpen}
          onOpenChange={(v) => setIsCabinetDetailModalOpen(typeof v === "boolean" ? v : false)}
          cabinet={selectedCabinet}
          onEdit={handleEditCabinet}
          onDelete={handleDeleteCabinet}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa cabinet</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa cabinet{" "}
              <strong>{selectedCabinet?.name}</strong>? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteCabinet}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <TaskDetailModal
        open={isTaskDetailModalOpen}
        onOpenChange={setIsTaskDetailModalOpen}
        taskId={selectedTaskId}
      />
    </>
  );
};

export default LocationDetailModal;
