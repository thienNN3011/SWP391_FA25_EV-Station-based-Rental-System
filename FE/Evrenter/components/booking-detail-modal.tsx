"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useBookingDetail } from "@/hooks/use-bookings"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, MapPin, Clock, DollarSign, FileText, AlertCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface BookingDetailModalProps {
  bookingId: number | null
  onClose: () => void
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
  UNCONFIRMED: "bg-red-500 text-white",
}

export function BookingDetailModal({ bookingId, onClose }: BookingDetailModalProps) {
  const { data: booking, isLoading } = useBookingDetail(bookingId)

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

  return (
    <Dialog open={!!bookingId} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between pr-8">
            <span>Chi tiết đơn thuê #{bookingId}</span>
            {booking && (
              <Badge className={STATUS_COLORS[booking.status] || "bg-gray-300"}>
                {STATUS_LABELS[booking.status] || booking.status}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : booking ? (
          <div className="space-y-6">
            {/* Vehicle Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Car className="h-5 w-5" />
                  Thông tin xe
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Mẫu xe</p>
                    <p className="font-medium">{booking.vehicle.modelName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Biển số</p>
                    <p className="font-medium">{booking.vehicle.plateNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Màu sắc</p>
                    <p className="font-medium">{booking.vehicle.color}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Trạng thái xe</p>
                    <p className="font-medium">{booking.vehicle.status}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Station Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5" />
                  Trạm thuê
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="font-medium">{booking.station.stationName}</p>
                  <p className="text-sm text-muted-foreground">{booking.station.address}</p>
                </div>
              </CardContent>
            </Card>

            {/* Rental Period */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5" />
                  Thời gian thuê
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Dự kiến nhận xe</p>
                    <p className="font-medium">{formatDateTime(booking.startTime)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dự kiến trả xe</p>
                    <p className="font-medium">{formatDateTime(booking.endTime)}</p>
                  </div>
                </div>
                
                {booking.actualStartTime && (
                  <>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Thực tế nhận xe</p>
                        <p className="font-medium">{formatDateTime(booking.actualStartTime)}</p>
                      </div>
                      {booking.actualEndTime && (
                        <div>
                          <p className="text-sm text-muted-foreground">Thực tế trả xe</p>
                          <p className="font-medium">{formatDateTime(booking.actualEndTime)}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="h-5 w-5" />
                  Chi phí
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Gói thuê</span>
                  <span className="font-medium">
                    {booking.tariff.type === "hour" ? "Theo giờ" : booking.tariff.type === "day" ? "Theo ngày" : "Theo tháng"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Đơn giá</span>
                  <span className="font-medium">{booking.tariff.price.toLocaleString()}₫</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold">Tổng cộng</span>
                  <span className="font-bold text-primary">{booking.totalAmount.toLocaleString()}₫</span>
                </div>
              </CardContent>
            </Card>

            {/* Odometer */}
            {(booking.startOdo || booking.endOdo) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5" />
                    Số km
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    {booking.startOdo && (
                      <div>
                        <p className="text-sm text-muted-foreground">Km bắt đầu</p>
                        <p className="font-medium">{booking.startOdo.toLocaleString()} km</p>
                      </div>
                    )}
                    {booking.endOdo && (
                      <div>
                        <p className="text-sm text-muted-foreground">Km kết thúc</p>
                        <p className="font-medium">{booking.endOdo.toLocaleString()} km</p>
                      </div>
                    )}
                  </div>
                  {booking.startOdo && booking.endOdo && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">Tổng km đã đi</p>
                      <p className="font-medium text-lg">{(booking.endOdo - booking.startOdo).toLocaleString()} km</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Bank Info (if cancelled) */}
            {booking.status === "CANCELLED" && booking.bankAccount && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertCircle className="h-5 w-5" />
                    Thông tin hoàn tiền
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Ngân hàng</p>
                    <p className="font-medium">{booking.bankName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Số tài khoản</p>
                    <p className="font-medium">{booking.bankAccount}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Không tìm thấy thông tin booking
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

