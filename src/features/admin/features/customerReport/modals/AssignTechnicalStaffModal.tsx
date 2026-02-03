import { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useForm } from "react-hook-form";
import type { CustomerReport } from "../types/customerReport.types";
import type { Staff } from "@/features/admin/features/staff/types/staff.types";
import type { CreateTaskPayload } from "../services/maintenanceTask.service";

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
  technicalStaffList: Staff[];
  onSubmit: (payload: CreateTaskPayload) => void | Promise<void>;
}

interface AssignFormData {
  staffId: string;
  taskType: CreateTaskPayload["taskType"];
  priority: CreateTaskPayload["priority"];
}

export function AssignTechnicalStaffModal({
  open,
  onOpenChange,
  report,
  technicalStaffList,
  onSubmit,
}: AssignTechnicalStaffModalProps) {
  const form = useForm<AssignFormData>({
    defaultValues: {
      staffId: "",
      taskType: "REPAIR",
      priority: "HIGH",
    },
  });

  useEffect(() => {
    if (open && report) {
      form.reset({
        staffId: report.assignedTo || "",
        taskType: "REPAIR",
        priority: "HIGH",
      });
    }
  }, [open, report, form]);

  const handleSubmit = async (data: AssignFormData) => {
    if (!report || !data.staffId) return;

    try {
      await onSubmit({
        incidentReportId: report.id,
        assignedToId: data.staffId,
        taskType: data.taskType,
        priority: data.priority,
      });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error assigning staff:", error);
    }
  };

  if (!report) return null;

  // Filter only active staff
  const availableStaff = technicalStaffList.filter(
    (staff) => staff.status === "active" || !staff.status
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-3xl">
        <DialogHeader>
          <DialogTitle>Phân công nhân viên kỹ thuật</DialogTitle>
          <DialogDescription>
            Chọn nhân viên kỹ thuật để xử lý báo cáo {report.reportCode}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="staffId"
              rules={{
                required: "Vui lòng chọn nhân viên kỹ thuật",
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhân viên kỹ thuật *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn nhân viên kỹ thuật" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableStaff.length === 0 ? (
                        <SelectItem value="__empty__" disabled>
                          Không có nhân viên kỹ thuật nào
                        </SelectItem>
                      ) : (
                        availableStaff.map((staff) => (
                          <SelectItem key={staff.id} value={staff.id || ""}>
                            {staff.name} {staff.email && `(${staff.email})`}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Chọn nhân viên kỹ thuật sẽ xử lý báo cáo này
                  </FormDescription>
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
                  <FormLabel>Loại công việc *</FormLabel>
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
                  <FormLabel>Độ ưu tiên *</FormLabel>
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={availableStaff.length === 0}
              >
                Phân công
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AssignTechnicalStaffModal;
