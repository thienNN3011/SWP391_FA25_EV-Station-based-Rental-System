"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Info } from "lucide-react"
import { useCancelBooking, type Booking } from "@/hooks/use-bookings"
import toast from "react-hot-toast"

interface CancelBookingDialogProps {
  booking: Booking | null
  onClose: () => void
}

const VIETNAM_BANKS = [
  "Vietcombank",
  "VietinBank",
  "BIDV",
  "Agribank",
  "Techcombank",
  "MB Bank",
  "ACB",
  "VPBank",
  "TPBank",
  "Sacombank",
  "HDBank",
  "VIB",
  "SHB",
  "SeABank",
  "OCB",
  "MSB",
  "VietCapitalBank",
  "SCB",
  "BacABank",
  "PVcomBank",
]

export function CancelBookingDialog({ booking, onClose }: CancelBookingDialogProps) {
  const [bankAccount, setBankAccount] = useState("")
  const [bankName, setBankName] = useState("")
  const cancelMutation = useCancelBooking()

  // Calculate refund info
  const refundInfo = useMemo(() => {
    if (!booking) return null

    const now = new Date()
    const startTime = new Date(booking.startTime)
    const minutesUntilStart = (startTime.getTime() - now.getTime()) / 1000 / 60

    // Assuming 30 minutes deadline and 70% refund from config
    const CANCEL_DEADLINE_MINUTES = 30
    const REFUND_RATE = 0.7

    const canRefund = minutesUntilStart >= CANCEL_DEADLINE_MINUTES
    const depositAmount = booking.totalAmount * 0.3 // Assuming 30% deposit
    const refundAmount = canRefund ? depositAmount * REFUND_RATE : 0

    const deadline = new Date(startTime.getTime() - CANCEL_DEADLINE_MINUTES * 60 * 1000)

    return {
      canRefund,
      refundAmount,
      depositAmount,
      minutesUntilStart: Math.floor(minutesUntilStart),
      deadline,
    }
  }, [booking])

  const handleSubmit = async () => {
    if (!booking) return

    // Validation
    const errors: string[] = []

    if (refundInfo?.canRefund) {
      if (!bankAccount.trim()) {
        errors.push("Số tài khoản không được để trống")
      } else if (!/^\d{9,16}$/.test(bankAccount)) {
        errors.push("Số tài khoản phải từ 9-16 chữ số")
      }

      if (!bankName.trim()) {
        errors.push("Vui lòng chọn ngân hàng")
      }
    }

    if (errors.length > 0) {
      toast.error(errors.join(". "))
      return
    }

    // Confirm
    const confirmed = window.confirm(
      refundInfo?.canRefund
        ? `Bạn sẽ nhận được 70% tiền cọc. Xác nhận hủy?`
        : "Bạn sẽ KHÔNG được hoàn tiền vì hủy sau thời gian quy định. Xác nhận hủy?"
    )

    if (!confirmed) return

    // Submit
    cancelMutation.mutate(
      {
        bookingId: booking.bookingId,
        bankAccount: bankAccount || "",
        bankName: bankName || "",
      },
      {
        onSuccess: () => {
          onClose()
          setBankAccount("")
          setBankName("")
        },
      }
    )
  }

  if (!booking || !refundInfo) return null

  return (
    <Dialog open={!!booking} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Hủy đơn thuê #{booking.bookingId}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Refund Policy Alert */}
          <Alert variant={refundInfo.canRefund ? "default" : "destructive"}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Chính sách hoàn tiền</AlertTitle>
            <AlertDescription>
              {refundInfo.canRefund ? (
                <>
                  Bạn sẽ được hoàn <strong>{refundInfo.refundAmount.toLocaleString()}₫</strong> (70% tiền cọc) vì hủy
                  trước{" "}
                  {refundInfo.deadline.toLocaleString("vi-VN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  .
                </>
              ) : (
                <>
                  Bạn <strong>không được hoàn tiền</strong> vì hủy sau thời gian quy định (30 phút trước giờ thuê).
                </>
              )}
            </AlertDescription>
          </Alert>

          {/* Bank Info Form */}
          {refundInfo.canRefund && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="bankAccount">Số tài khoản ngân hàng *</Label>
                <Input
                  id="bankAccount"
                  placeholder="Nhập 9-16 chữ số"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, ""))}
                  maxLength={16}
                />
              </div>

              <div>
                <Label htmlFor="bankName">Ngân hàng *</Label>
                <Select value={bankName} onValueChange={setBankName}>
                  <SelectTrigger id="bankName">
                    <SelectValue placeholder="Chọn ngân hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    {VIETNAM_BANKS.map((bank) => (
                      <SelectItem key={bank} value={bank}>
                        {bank}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Tiền sẽ được chuyển vào tài khoản trong <strong>3-5 ngày làm việc</strong>.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Actions */}
        {/* Actions */}
<div className="flex gap-2 justify-end pt-2">
  <Button variant="outline" onClick={onClose} disabled={cancelMutation.isPending}>
    Quay lại
  </Button>
  
  {/* Chỉ hiện nút Xác nhận hủy khi CÓ ĐƯỢC hoàn tiền */}
  {refundInfo.canRefund && (
    <Button
      variant="destructive"
      onClick={handleSubmit}
      disabled={cancelMutation.isPending || (!bankAccount || !bankName)}
    >
      {cancelMutation.isPending ? "Đang xử lý..." : "Xác nhận hủy"}
    </Button>
  )}
</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

