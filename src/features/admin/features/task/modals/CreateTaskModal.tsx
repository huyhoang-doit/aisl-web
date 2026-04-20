import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Form,
  FormControl,
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
import { TechnicalStaffSelector } from "@/features/admin/features/staff/components/TechnicalStaffSelector";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { CreateTaskPayload } from "../services/task.service";
import { TechnicalTaskPriority, TechnicalTaskType } from "../types/task.types";

type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface CreateTaskFormData {
  incidentReportId: string;
  assignedToId: string;
  taskType: string;
  priority: TaskPriority;
  techNote: string;
}

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateTaskPayload) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function CreateTaskModal({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: CreateTaskModalProps) {
  const assignedByName = useAuthStore((state) => state.user?.username ?? state.user?.email ?? undefined);

  const form = useForm<CreateTaskFormData>({
    defaultValues: {
      incidentReportId: "",
      assignedToId: "",
      taskType: TechnicalTaskType.REPAIR,
      priority: TechnicalTaskPriority.MEDIUM,
      techNote: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      incidentReportId: "",
      assignedToId: "",
      taskType: TechnicalTaskType.REPAIR,
      priority: TechnicalTaskPriority.MEDIUM,
      techNote: "",
    });
  }, [open, form]);

  const handleSubmit = async (formData: CreateTaskFormData) => {
    const incidentReportId = formData.incidentReportId.trim();
    await onSubmit({
      incidentReportId: incidentReportId || undefined,
      assignedToId: formData.assignedToId,
      taskType: formData.taskType,
      priority: formData.priority,
      assignedByName,
      techNote: formData.techNote.trim() || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo task kỹ thuật</DialogTitle>
          <DialogDescription>
            Tạo task và phân công nhân viên kỹ thuật xử lý sự cố
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* <FormField
              control={form.control}
              name="incidentReportId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Incident Report ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập Incident Report ID (không bắt buộc)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="assignedToId"
              rules={{ required: "Vui lòng chọn nhân viên kỹ thuật" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhân viên kỹ thuật <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <TechnicalStaffSelector
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Chọn nhân viên kỹ thuật"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taskType"
              rules={{ required: "Vui lòng chọn loại task" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại task <span className="text-red-500">*</span></FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại task" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={TechnicalTaskType.REPAIR}>Sửa chữa</SelectItem>
                      <SelectItem value={TechnicalTaskType.INSPECTION}>Kiểm tra</SelectItem>
                      <SelectItem value={TechnicalTaskType.SETUP}>Lắp đặt</SelectItem>
                      <SelectItem value={TechnicalTaskType.MAINTENANCE}>Bảo trì</SelectItem>
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
                    value={field.value}
                    onValueChange={(value) => field.onChange(value as TaskPriority)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn độ ưu tiên" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={TechnicalTaskPriority.LOW}>Thấp</SelectItem>
                      <SelectItem value={TechnicalTaskPriority.MEDIUM}>Trung bình</SelectItem>
                      <SelectItem value={TechnicalTaskPriority.HIGH}>Cao</SelectItem>
                      <SelectItem value={TechnicalTaskPriority.URGENT}>Khẩn cấp</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="techNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú kỹ thuật</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Lưu ý kỹ thuật..." rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={form.formState.isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang tạo..." : "Tạo task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTaskModal;
