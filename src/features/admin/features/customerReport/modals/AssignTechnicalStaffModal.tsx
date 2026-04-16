/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import type { CustomerReport } from "../types/customerReport.types";
import type { CreateTaskPayload } from "@/features/admin/features/task/services/task.service";
import { useTechnicalStaff } from "@/features/admin/features/staff/hooks/useTechnicalStaff";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";

const TASK_TYPE_OPTIONS: { value: CreateTaskPayload["taskType"]; label: string }[] = [
  { value: "REPAIR", label: "Sửa chữa" },
  { value: "INSPECTION", label: "Kiểm tra" },
  { value: "CLEANING", label: "Vệ sinh" },
];

const PRIORITY_OPTIONS: { value: CreateTaskPayload["priority"]; label: string }[] = [
  { value: "LOW", label: "Thấp" },
  { value: "MEDIUM", label: "Trung bình" },
  { value: "HIGH", label: "Cao" },
  { value: "URGENT", label: "Khẩn cấp" },
];

interface AssignTechnicalStaffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: CustomerReport | null;
  /** Gửi một hoặc nhiều task (mỗi nhân viên một task). Khi chọn nhiều nhân viên, gọi với mảng payloads. */
  onSubmit: (payloads: CreateTaskPayload[]) => void | Promise<void>;
}

interface AssignFormData {
  staffIds: string[];
  taskType: CreateTaskPayload["taskType"];
  priority: CreateTaskPayload["priority"];
}

export function AssignTechnicalStaffModal({
  open,
  onOpenChange,
  report,
  onSubmit,
}: AssignTechnicalStaffModalProps) {
  const { staffList, isLoading: staffLoading } = useTechnicalStaff();
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm<AssignFormData>({
    defaultValues: {
      staffIds: [],
      taskType: "REPAIR",
      priority: "HIGH",
    },
  });

  const assignedStaffIds = useMemo(
    () => new Set((report?.assignedStaff ?? []).map((s) => s.staffId)),
    [report?.assignedStaff]
  );

  const availableStaff = useMemo(() => {
    let list = staffList.filter((s) => s.status === "ACTIVE" || !s.status);
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        (s.phone ?? "").toLowerCase().includes(q)
    );
  }, [staffList, searchQuery]);

  useEffect(() => {
    if (open && report) {
      form.reset({
        staffIds: [],
        taskType: "REPAIR",
        priority: "HIGH",
      });
    }
  }, [open, report, form]);

  const selectedIds = form.watch("staffIds") ?? [];

  const handleToggleStaff = (staffId: string, checked: boolean) => {
    const next = checked
      ? [...selectedIds, staffId]
      : selectedIds.filter((id) => id !== staffId);
    form.setValue("staffIds", next, { shouldValidate: true });
  };

  const handleSubmit = async (data: AssignFormData) => {
    if (!report || !data.staffIds.length) return;

    const payloads: CreateTaskPayload[] = data.staffIds.map((assignedToId) => ({
      incidentReportId: report.id,
      assignedToId,
      taskType: data.taskType,
      priority: data.priority,
    }));

    try {
      await onSubmit(payloads);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error assigning staff:", error);
    }
  };

  if (!report) return null;

  const reportLabel = report.code ?? report.reportCode ?? report.id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Phân công nhân viên kỹ thuật</DialogTitle>
          <DialogDescription>
            Chọn một hoặc nhiều nhân viên để tạo task xử lý báo cáo {reportLabel}. Đã phân công rồi vẫn có thể phân công thêm.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6 flex-1 min-h-0">
            <FormField
              control={form.control}
              name="staffIds"
              rules={{
                validate: (v) =>
                  (v?.length ?? 0) > 0 || "Vui lòng chọn ít nhất một nhân viên kỹ thuật",
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhân viên kỹ thuật <span className="text-red-500">*</span></FormLabel>
                  <FormDescription>
                    Chọn một hoặc nhiều nhân viên. Mỗi nhân viên sẽ được tạo một task riêng.
                  </FormDescription>
                  <div className="rounded-md border p-2 space-y-2 max-h-[220px] overflow-y-auto">
                    <Input
                      placeholder="Tìm theo tên, email, SĐT..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 sticky top-0 bg-background z-10"
                    />
                    {staffLoading ? (
                      <div className="py-4 text-center text-sm text-muted-foreground">
                        Đang tải...
                      </div>
                    ) : availableStaff.length === 0 ? (
                      <div className="py-4 text-center text-sm text-muted-foreground">
                        Không có nhân viên kỹ thuật nào
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {availableStaff.map((staff) => {
                          const id = staff.id ?? "";
                          const alreadyAssigned = assignedStaffIds.has(id);
                          const checked = (field.value ?? []).includes(id);
                          return (
                            <label
                              key={id}
                              className={cn(
                                "flex items-center gap-2 py-2 px-2 rounded hover:bg-muted/50 cursor-pointer",
                                alreadyAssigned && "opacity-60"
                              )}
                            >
                              <FormControl>
                                <Checkbox
                                  checked={checked}
                                  disabled={alreadyAssigned}
                                  onCheckedChange={(c) => handleToggleStaff(id, c === true)}
                                />
                              </FormControl>
                              <span className="text-sm">
                                {staff.name}
                                {staff.email ? ` (${staff.email})` : ""}
                                {alreadyAssigned && (
                                  <span className="text-muted-foreground ml-1">— Đã phân công</span>
                                )}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taskType"
              rules={{ required: "Vui lòng chọn loại công việc" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại công việc <span className="text-red-500">*</span></FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại công việc" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TASK_TYPE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              rules={{ required: "Vui lòng chọn độ ưu tiên" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Độ ưu tiên <span className="text-red-500">*</span></FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn độ ưu tiên" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PRIORITY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-auto border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
               disabled={form.formState.isSubmitting}>
                Hủy
              </Button>
              <Button type="submit" disabled={!selectedIds.length}>
                Phân công {selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AssignTechnicalStaffModal;
