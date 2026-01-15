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
import type { LockedAccount } from "../types/lockedAccount.types"

interface UnlockAccountModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  account: LockedAccount | null
  onSubmit: (account: LockedAccount, reason?: string) => void | Promise<void>
}

interface FormData {
  reason?: string
}

export function UnlockAccountModal({
  open,
  onOpenChange,
  account,
  onSubmit,
}: UnlockAccountModalProps) {
  const form = useForm<FormData>({
    defaultValues: {
      reason: "",
    },
  })

  const handleSubmit = async (formData: FormData) => {
    if (!account) return
    
    try {
      await onSubmit(account, formData.reason)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mở khóa tài khoản</DialogTitle>
          <DialogDescription>
            Xác nhận mở khóa tài khoản cho {account?.name}. Bạn có thể nhập lý do mở khóa (tùy chọn).
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lý do mở khóa (tùy chọn)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập lý do mở khóa tài khoản..."
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
              >
                Hủy
              </Button>
              <Button
                type="submit"
              >
                Xác nhận mở khóa
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default UnlockAccountModal
