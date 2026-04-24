import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form"
import { Textarea } from "@/shared/components/ui/textarea"
import type { CourierApplication } from "../types/courierRequest.types"

interface ApproveCourierRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  application: CourierApplication | null
  onSubmit: (application: CourierApplication, action: "approve" | "reject", reviewNote: string) => void | Promise<void>
  action: "approve" | "reject"
}

interface FormData {
  reviewNote: string
}

export function ApproveCourierRequestModal({
  open,
  onOpenChange,
  application,
  onSubmit,
  action,
}: ApproveCourierRequestModalProps) {
  const form = useForm<FormData>({
    defaultValues: {
      reviewNote: "",
    },
  })

  const handleSubmit = async (formData: FormData) => {
    if (!application) return

    try {
      await onSubmit(application, action, formData.reviewNote ?? "")
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const isReject = action === "reject"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isReject ? "Từ chối đơn đăng ký" : "Duyệt đơn đăng ký"}
          </DialogTitle>
          <DialogDescription>
            {isReject
              ? "Vui lòng nhập ghi chú (lý do từ chối) cho đơn đăng ký người chuyển phát."
              : `Xác nhận duyệt đơn đăng ký cho ${application?.legalName ?? "người nộp đơn"}. Ghi chú (tùy chọn).`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="reviewNote"
              rules={
                isReject
                  ? {
                      required: "Ghi chú / lý do từ chối là bắt buộc",
                      minLength: {
                        value: 1,
                        message: "Vui lòng nhập ghi chú",
                      },
                    }
                  : undefined
              }
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isReject ? "Ghi chú / Lý do từ chối *" : "Ghi chú (tùy chọn)"}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={isReject ? "Nhập lý do từ chối..." : "Nhập ghi chú (nếu có)..."}
                      {...field}
                      rows={4}
                    />
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
               disabled={form.formState.isSubmitting}>
                Hủy
              </Button>
              <Button
                type="submit"
                variant={isReject ? "destructive" : "default"}
               disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isReject ? "Từ chối" : "Xác nhận duyệt"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ApproveCourierRequestModal
