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

interface AssignTechnicalStaffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: CustomerReport | null;
  technicalStaffList: Staff[];
  onSubmit: (reportId: string, staffId: string) => void | Promise<void>;
}

interface AssignFormData {
  staffId: string;
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
    },
  });

  useEffect(() => {
    if (open && report) {
      form.reset({
        staffId: report.assignedTo || "",
      });
    }
  }, [open, report, form]);

  const handleSubmit = async (data: AssignFormData) => {
    if (!report || !data.staffId) return;

    try {
      await onSubmit(report.id, data.staffId);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error assigning staff:", error);
    }
  };

  if (!report) return null;

  // Filter only active staff
  const availableStaff = technicalStaffList.filter(
    (staff) => staff.status === "active"
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
