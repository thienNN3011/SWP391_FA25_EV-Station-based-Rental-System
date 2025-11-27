"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useBookingDetail } from "@/hooks/use-bookings"
import {
  CreditCard,
  Car,
  MapPin,
  Calendar,
  Receipt,
  Clock,
  Hash,
  Banknote,
  CheckCircle2,
  CircleDot,
  ExternalLink,
} from "lucide-react"

// Transaction interface
export interface Transaction {
  paymentId: number
  bookingId: number
  paymentType: string
  amount: number
  referenceCode: string
  transactionDate: string
  method: string
}

interface TransactionDetailModalProps {
  transaction: Transaction | null
  allTransactions?: Transaction[] // Để hiển thị lịch sử thanh toán của booking
  onClose: () => void
  onViewBookingDetail?: (bookingId: number) => void
}

// Labels và colors
const PAYMENT_TYPE_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  DEPOSIT: { label: "Tiền cọc", color: "bg-yellow-400 text-black", icon: "💰" },
  FINAL_PAYMENT: { label: "Thanh toán cuối", color: "bg-green-500 text-white", icon: "✅" },
  REFUND_DEPOSIT: { label: "Hoàn tiền cọc", color: "bg-red-500 text-white", icon: "↩️" },
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  VN_PAY: "VNPay",
  VIETCOMBANK: "Vietcombank",
}

const STATUS_LABELS: Record<string, string> = {
  BOOKING: "Đã hoàn tất cọc",
  UNCONFIRMED: "Chưa xác nhận",
  RENTING: "Đang thuê",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
  NO_SHOW: "Không đến",
}

const STATUS_COLORS: Record<string, string> = {
  BOOKING: "bg-yellow-400 text-black",
  RENTING: "bg-blue-500 text-white",
  COMPLETED: "bg-green-600 text-white",
  CANCELLED: "bg-red-500 text-white",
  NO_SHOW: "bg-red-500 text-white",
  UNCONFIRMED: "bg-orange-500 text-white",
}

// Helper functions
const formatDateTime = (dateString: string) => {
  if (!dateString) return "-"
  const date = new Date(dateString)
  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const formatCurrency = (amount: number) => {
  return amount.toLocaleString("vi-VN") + " VND"
}

const formatDate = (dateString: string) => {
  if (!dateString) return "-"
  const date = new Date(dateString)
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  })
}

export function TransactionDetailModal({
  transaction,
  allTransactions = [],
  onClose,
  onViewBookingDetail,
}: TransactionDetailModalProps) {
  // Fetch booking detail when transaction is selected
  const { data: booking, isLoading: isLoadingBooking } = useBookingDetail(
    transaction?.bookingId ?? null
  )

  // Filter transactions related to this booking
  const bookingTransactions = allTransactions
    .filter((t) => t.bookingId === transaction?.bookingId)
    .sort((a, b) => new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime())

  if (!transaction) return null

  const paymentTypeInfo = PAYMENT_TYPE_LABELS[transaction.paymentType] || {
    label: transaction.paymentType,
    color: "bg-gray-400",
    icon: "💳",
  }

  return (
    <Dialog open={!!transaction} onOpenChange={() => onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-primary" />
            <span>Chi tiết giao dịch #{transaction.paymentId}</span>
            <Badge className={paymentTypeInfo.color}>{paymentTypeInfo.label}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Transaction Info Card */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Receipt className="h-4 w-4 text-primary" />
                Thông tin giao dịch
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Hash className="h-3 w-3" /> Mã giao dịch
                  </p>
                  <p className="font-semibold">#{transaction.paymentId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Ngày giao dịch
                  </p>
                  <p className="font-medium">{formatDateTime(transaction.transactionDate)}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Banknote className="h-3 w-3" /> Số tiền
                  </p>
                  <p
                    className={`text-xl font-bold ${
                      transaction.paymentType === "REFUND_DEPOSIT"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {transaction.paymentType === "REFUND_DEPOSIT" ? "-" : "+"}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <CreditCard className="h-3 w-3" /> Phương thức
                  </p>
                  <p className="font-medium">
                    {PAYMENT_METHOD_LABELS[transaction.method] || transaction.method}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Mã tham chiếu</p>
                <p className="font-mono text-sm bg-muted px-2 py-1 rounded">
                  {transaction.referenceCode}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Booking Info Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-primary" />
                  Thông tin đơn thuê liên quan
                </span>
                {booking && (
                  <Badge className={STATUS_COLORS[booking.status] || "bg-gray-400"}>
                    {STATUS_LABELS[booking.status] || booking.status}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingBooking ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : booking ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Hash className="h-3 w-3" />
                    <span>Mã đơn thuê: </span>
                    <span className="font-semibold text-foreground">#{booking.bookingId}</span>
                  </div>

                  <Separator />

                  {/* Vehicle Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-start gap-2">
                      <Car className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Xe</p>
                        <p className="font-medium">{booking.vehicle?.modelName}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.vehicle?.plateNumber} • {booking.vehicle?.color}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Trạm</p>
                        <p className="font-medium">{booking.station?.stationName}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Thời gian</p>
                        <p className="font-medium text-sm">
                          {formatDate(booking.startTime)} → {formatDate(booking.endTime)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Cost Summary */}
                  <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tiền cọc</span>
                      <span>{formatCurrency(booking.tariff?.depositAmount || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tổng tiền thuê</span>
                      <span>{formatCurrency(booking.totalAmount || 0)}</span>
                    </div>
                    {booking.penaltyAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Phí phạt</span>
                        <span className="text-red-600">
                          +{formatCurrency(booking.penaltyAmount)}
                        </span>
                      </div>
                    )}
                  </div>

                  {onViewBookingDetail && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => onViewBookingDetail(booking.bookingId)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Xem chi tiết đơn thuê
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  Không tìm thấy thông tin đơn thuê
                </p>
              )}
            </CardContent>
          </Card>

          {/* Payment History of this Booking */}
          {bookingTransactions.length > 1 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Receipt className="h-4 w-4 text-primary" />
                  Lịch sử thanh toán của đơn này
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bookingTransactions.map((t) => {
                    const isCurrentTransaction = t.paymentId === transaction.paymentId
                    const typeInfo = PAYMENT_TYPE_LABELS[t.paymentType] || {
                      label: t.paymentType,
                      color: "bg-gray-400",
                    }

                    return (
                      <div
                        key={t.paymentId}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                          isCurrentTransaction
                            ? "bg-primary/10 border border-primary/30"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        {isCurrentTransaction ? (
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                        ) : (
                          <CircleDot className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{typeInfo.label}</span>
                            {isCurrentTransaction && (
                              <Badge variant="outline" className="text-xs">
                                Đang xem
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatDateTime(t.transactionDate)}
                          </p>
                        </div>

                        <div
                          className={`font-semibold text-sm ${
                            t.paymentType === "REFUND_DEPOSIT" ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {t.paymentType === "REFUND_DEPOSIT" ? "-" : "+"}
                          {formatCurrency(t.amount)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

