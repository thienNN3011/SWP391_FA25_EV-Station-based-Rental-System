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
function calculateLateReturnPenalty(booking: any): number {
  if (!booking.actualEndTime) return 0;

  const plannedEndTime = new Date(booking.endTime);
  const actualEndTime = new Date(booking.actualEndTime);
  const diffMs = actualEndTime.getTime() - plannedEndTime.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours > 6) {
    return booking.totalAmount * 0.1 * Math.ceil(diffHours / 24); // 10% penalty per late day
  }

  return 0;
}
function getPlannedRentalDays(startTime: string, endTime: string) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end.getTime() - start.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24)); // làm tròn lên
}
function getExpectedReturnDate(startTime: string, endTime: string) {
  const rentalDays = getPlannedRentalDays(startTime, endTime);
  const start = new Date(startTime);
  const t = new Date(start);
  t.setDate(t.getDate() + rentalDays); // ngày trả = ngày nhận + số ngày thuê
  return t;
}



function calculateRentalDays(booking: any): number {
  const actualStartTime = booking.actualStartTime
    ? new Date(booking.actualStartTime)
    : new Date(booking.startTime); // Nếu không có thời gian thực tế nhận xe, dùng thời gian dự kiến

  const plannedEndTime = new Date(booking.endTime);

  const diffMs = plannedEndTime.getTime() - actualStartTime.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24)); // Chuyển đổi từ ms sang ngày
}

// Calculate estimated total based on planned rental duration
function calculateEstimatedTotal(booking: any): number {
  const startTime = new Date(booking.startTime)
  const endTime = new Date(booking.endTime)
  const diffMs = endTime.getTime() - startTime.getTime()
  const diffMinutes = diffMs / (1000 * 60)

  const tariffType = booking.tariff.type.toLowerCase()
  const price = booking.tariff.price

  let units = 0

  switch (tariffType) {
    case "hour":
    case "hourly":
      units = Math.ceil(diffMinutes / 60)
      break
    case "day":
    case "daily":
      units = Math.ceil(diffMinutes / (60 * 24))
      break
    case "week":
    case "weekly":
      units = Math.ceil(diffMinutes / (60 * 24 * 7))
      break
    case "month":
    case "monthly":
      units = Math.ceil(diffMinutes / (60 * 24 * 30))
      break
    default:
      units = 0
  }

  return units * price
}

export function BookingDetailModal({ bookingId, onClose }: BookingDetailModalProps) {
  const { data: booking, isLoading } = useBookingDetail(bookingId)

const formatDateTime = (s: string) => {
  if (!s) return "-"

  // bỏ phần mili giây dài phía sau
  s = s.split(".")[0]

  // thay T bằng khoảng trắng nếu có
  s = s.replace("T", " ")

  const parts = s.split(" ")
  const datePart = parts[0]
  const timePart = parts[1] || "00:00:00"

  const [y, m, d] = datePart.split("-").map(Number)
  const [hh, mm, ss] = timePart.split(":").map(Number)

  const date = new Date(y, m - 1, d, hh, mm, ss || 0)

  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}
function parseLocalDateTime(s: string) {
  s = s.split(".")[0];
  s = s.replace("T", " ");

  const [datePart, timePart = "00:00:00"] = s.split(" ");
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, mm, ss] = timePart.split(":").map(Number);

  return new Date(y, m - 1, d, hh, mm, ss || 0);
}

function getRentalDays(startTime: string, endTime: string) {
  const start = parseLocalDateTime(startTime);
  const end = parseLocalDateTime(endTime);

  const diffMs = end.getTime() - start.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  const baseDays = Math.floor(diffHours / 24);
  const extraHours = diffHours % 24;

  return extraHours > 6 ? baseDays + 1 : baseDays;
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
  <div className="grid grid-cols-3 gap-3 text-center">
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
  <p className="text-sm text-muted-foreground">Số ngày thuê</p>
  <p className="font-medium">
    {getRentalDays(booking.startTime, booking.endTime)} ngày
  </p>
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
        {(() => {
          const type = booking.tariff.type.toLowerCase()
          if (type === "hour" || type === "hourly") return "Theo giờ"
          if (type === "day" || type === "daily") return "Theo ngày"
          if (type === "week" || type === "weekly") return "Theo tuần"
          return "Theo tháng"
        })()}
      </span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground">Đơn giá</span>
      <span className="font-medium">{booking.tariff.price.toLocaleString()}₫</span>
    </div>
    
    {/* Chỉ hiện số ngày thuê thực tế cho RENTING và COMPLETED */}
    {(booking.status === "RENTING" || booking.status === "COMPLETED") && (
      <div className="flex justify-between items-center">
        <span className="text-muted-foreground">Số ngày bạn thuê xe thực tế</span>
        <span className="font-medium">
          {calculateRentalDays(booking)} ngày
        </span>
      </div>
    )}
    
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground">Tổng tiền thuê dự kiến</span>
      <span className="font-medium">
        {(booking.expectedTotalAmount || booking.totalAmount)?.toLocaleString()}₫
      </span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground">Tiền cọc đã thanh toán</span>
      <span className="font-semibold text-green-600">
        - {(booking.depositAmount || booking.tariff?.depositAmount)?.toLocaleString()}₫
      </span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground">Còn lại cần thanh toán</span>
      <span className="font-medium">
        {((booking.expectedTotalAmount || booking.totalAmount) - (booking.depositAmount || booking.tariff?.depositAmount))?.toLocaleString()}₫
      </span>
    </div>
    
    {/* Chỉ hiện tiền phạt và tổng thanh toán cho RENTING và COMPLETED */}
    {(booking.status === "RENTING" || booking.status === "COMPLETED") && (
      <>
        {booking.penaltyAmount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Tiền phạt</span>
            <span className="font-medium text-red-600">
             + {booking.penaltyAmount?.toLocaleString()}₫
            </span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between items-center text-lg">
  <span className="font-semibold">Tổng thanh toán cuối cùng</span>
  <span className="font-bold text-green-600">
    {booking.totalAmount?.toLocaleString()}₫
  </span>
</div>

      </>
    )}
    
    {/* Hiện số tiền hoàn cho đơn đã hủy */}
    {booking.status === "CANCELLED" && booking.refundAmount !== undefined && (
      <>
        <Separator />
        <div className="flex justify-between items-center text-lg">
          <span className="font-semibold">Số tiền đã hoàn</span>
          <span className="font-bold text-green-600">
            {booking.refundAmount?.toLocaleString()}₫
          </span>
        </div>
      </>
    )}

    {booking.status === "RENTING" && (
      <p className="text-sm text-muted-foreground mt-1">
        Lưu ý: Chi phí trên đây chưa phải là chi phí cuối cùng.
      </p>
    )}

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

