import { useForm } from "react-hook-form"
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
import type { CourierRequest } from "../types/courierRequest.types"

interface ApproveCourierRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: CourierRequest | null
  onSubmit: (request: CourierRequest, action: "approve" | "reject", reason?: string) => void | Promise<void>
  action: "approve" | "reject"
}

interface FormData {
  reason?: string
}

export function ApproveCourierRequestModal({
  open,
  onOpenChange,
  request,
  onSubmit,
  action,
}: ApproveCourierRequestModalProps) {
  const form = useForm<FormData>({
    defaultValues: {
      reason: "",
    },
  })

  const handleSubmit = async (formData: FormData) => {
    if (!request) return
    
    try {
      await onSubmit(request, action, formData.reason)
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
            {isReject ? "Từ chối yêu cầu" : "Duyệt yêu cầu"}
          </DialogTitle>
          <DialogDescription>
            {isReject
              ? "Vui lòng nhập lý do từ chối yêu cầu đăng ký làm người chuyển phát."
              : "Xác nhận duyệt yêu cầu đăng ký làm người chuyển phát cho " + request?.name}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {isReject && (
              <FormField
                control={form.control}
                name="reason"
                rules={{
                  required: "Lý do từ chối là bắt buộc",
                  minLength: {
                    value: 10,
                    message: "Lý do từ chối phải có ít nhất 10 ký tự",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lý do từ chối *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập lý do từ chối yêu cầu..."
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
                variant={isReject ? "destructive" : "default"}
              >
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
