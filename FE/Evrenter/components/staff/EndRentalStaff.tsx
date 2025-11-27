"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Car, FileText, Search, CheckCircle, MapPin, User, Phone, Calendar, Gauge, Banknote } from "lucide-react"
import { api } from "@/lib/api"

export default function EndRentalStaff() {
  const [bookingId, setBookingId] = useState("")
  const [booking, setBooking] = useState<any>(null)
  const [vehicleStatus, setVehicleStatus] = useState("")
  const [endOdo, setEndOdo] = useState("")

  const [qrCode, setQrCode] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const colorMap: Record<string, string> = {
    red: "Đỏ",
    blue: "Xanh dương",
    white: "Trắng",
    black: "Đen",
    silver: "Bạc",
    gray: "Xám",
    green: "Xanh lá",
    yellow: "Vàng",
    orange: "Cam",
    brown: "Nâu",
  }

  const formatDate = (s: string) => {
    if (!s) return "-"
    const d = new Date(s)
    return d.toLocaleString("vi-VN", { hour12: false })
  }

const calculateRentalDays = (start: string, end: string) => {
  if (!start || !end) return 0

  const parseLocalDateTime = (s: string) => {
    s = s.split(".")[0].replace("T", " ")
    const [datePart, timePart = "00:00:00"] = s.split(" ")
    const [y, m, d] = datePart.split("-").map(Number)
    const [hh, mm, ss] = timePart.split(":").map(Number)
    return new Date(y, m - 1, d, hh, mm, ss || 0)
  }

  const startDate = parseLocalDateTime(start)
  const endDate = parseLocalDateTime(end)

  const diffMs = endDate.getTime() - startDate.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)

  const baseDays = Math.floor(diffHours / 24)
  const extraHours = diffHours % 24

  const rentalDays = extraHours > 6 ? baseDays + 1 : baseDays
  return rentalDays > 0 ? rentalDays : 1
}


const calculateDelayHours = (expected: string, actual: string) => {
  if (!expected || !actual) return 0;

  const parseLocalDateTime = (s: string) => {
    s = s.split(".")[0].replace("T", " ");
    const [datePart, timePart = "00:00:00"] = s.split(" ");
    const [y, m, d] = datePart.split("-").map(Number);
    const [hh, mm, ss] = timePart.split(":").map(Number);
    return new Date(y, m - 1, d, hh, mm, ss || 0);
  };

  const expectedDate = parseLocalDateTime(expected);
  const actualDate = parseLocalDateTime(actual);

  const diffMs = actualDate.getTime() - expectedDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  return diffHours > 0 ? Math.round(diffHours * 100) / 100 : 0; // làm tròn 2 chữ số
};

  const handleViewBooking = async () => {
    if (!bookingId) return
    setMessage("")
    setLoading(true)
    setQrCode(null)

    try {
      const res = await api.post("/bookings/showdetailbooking", { bookingId })
      const bookingInfo = res.data.data

      setBooking({
        ...bookingInfo,
        startTimeRaw: bookingInfo.startTime,
        endTimeRaw: bookingInfo.endTime,
        startTime: formatDate(bookingInfo.startTime),
        endTime: formatDate(bookingInfo.endTime),
        actualStartTime: formatDate(bookingInfo.actualStartTime),
        stoppedData: null, 
      })
    } catch (err: any) {
      console.error("Lỗi xem booking:", err)
      setMessage("Không tìm thấy thông tin booking.")
      setBooking(null)
    } finally {
      setLoading(false)
    }
  }

const handleConfirmStopRenting = async () => {
  if (!bookingId) return
  setLoading(true)
  setMessage("")
  setQrCode(null)

  try {
    const stopRes = await api.post("/bookings/stoprentingtime", { bookingId })
    const stopData = stopRes.data.data

   setBooking((prev: any) =>
  prev
    ? {
        ...prev,
        stoppedData: {
          endTime: formatDate(stopData.endTime),
          actualEndTime: formatDate(stopData.actualEndTime),
          delayHours: calculateDelayHours(stopData.endTime, stopData.actualEndTime),
          expectedTotalAmount: stopData.expectedTotalAmount?.toLocaleString() || (prev.tariff?.price * calculateRentalDays(prev.startTimeRaw, prev.endTimeRaw))?.toLocaleString(),
          depositAmount: (stopData.depositAmount || prev.tariff?.depositAmount)?.toLocaleString(),
          penaltyAmount: stopData.penaltyAmount || stopData.extraFee || 0,
          totalAmount: stopData.totalAmount?.toLocaleString(),
        },
      }
    : null
);

    setMessage("Đã xác nhận kết thúc thuê, kiểm tra thông tin rồi mới nhấn 'Kết thúc hợp đồng'.")
  } catch (err: any) {
    console.error("Lỗi stop renting:", err)
    setMessage("Không thể xác nhận kết thúc thuê. Vui lòng thử lại.")
  } finally {
    setLoading(false)
  }
}


  const handleEndRental = async () => {
    if (!bookingId || !vehicleStatus || !endOdo) {
      setMessage("Vui lòng nhập đầy đủ thông tin trước khi kết thúc hợp đồng.")
      return
    }

    setLoading(true)
    setMessage("")
    setQrCode(null)

    try {
      const body = {
        bookingId,
        vehicleStatus,
        endOdo,
      }

      const res = await api.post("/bookings/endrental", body)
      if (res.status === 200 || res.status === 201) {
        setMessage("Quét mã dưới đây để thanh toán!")
        setQrCode(res.data.data.qr)
      } else {
        setMessage("Có lỗi xảy ra khi kết thúc hợp đồng.")
      }
    } catch (err: any) {
      console.error("End rental error:", err)
      setMessage(
        err.response?.data?.message ||
        "Không thể gửi yêu cầu kết thúc hợp đồng. Vui lòng thử lại."
      )
    } finally {
      setLoading(false)
    }
  }
 const calculateExpectedPayment = (price: number | undefined, deposit: number | undefined, start: string, end: string) => {
  if (!price || !start || !end) return 0;
  const days = calculateRentalDays(start, end);
  const total = price * days;
  return total - (deposit || 0);
};


  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="border border-secondary/30 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5 text-secondary" />
            Kết thúc hợp đồng
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Nhập Booking ID */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Mã Booking</Label>
            <div className="flex gap-3">
              <Input
                placeholder="Nhập Booking ID"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleViewBooking} disabled={loading} variant="outline" className="gap-2">
                <Search className="w-4 h-4" />
                Xem
              </Button>
              <Button onClick={handleConfirmStopRenting} disabled={loading || !booking} className="gap-2 bg-orange-500 hover:bg-orange-600">
                <CheckCircle className="w-4 h-4" />
                Xác nhận kết thúc
              </Button>
            </div>
          </div>

          {/* Thông tin booking */}
          {booking && (
            <div className="rounded-lg border bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
              {/* Header thông tin xe */}
              <div className="bg-primary/10 px-4 py-3 border-b">
                <div className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-lg">
                    {booking.vehicle?.brand} {booking.vehicle?.modelName}
                  </span>
                  <span className="text-muted-foreground">
                    ({colorMap[booking.vehicle?.color?.trim().toLowerCase()] || booking.vehicle?.color})
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Biển số: <span className="font-mono font-semibold">{booking.vehicle?.plateNumber}</span></p>
              </div>

              <div className="p-4 space-y-4">
                {/* Thông tin trạm */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">{booking.station?.stationName}</p>
                    <p className="text-sm text-muted-foreground">{booking.station?.address}</p>
                  </div>
                </div>

                {/* Thông tin khách hàng */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-green-500" />
                    <span>{booking.user?.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-green-500" />
                    <span>{booking.user?.phone}</span>
                  </div>
                </div>

                {/* Thời gian thuê */}
                <div className="grid grid-cols-2 gap-4 p-3 bg-white dark:bg-slate-800 rounded-lg border">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-purple-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Thời gian thuê dự định</p>
                      <p className="font-medium">{booking.startTime}</p>
                      <p className="text-black-500 text-primary font-semibold">
Số ngày thuê: {calculateRentalDays(booking.startTimeRaw, booking.endTimeRaw)}
</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-indigo-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Bắt đầu thực tế</p>
                      <p className="font-medium">{booking.actualStartTime}</p>
                    </div>
                  </div>
                </div>

                {/* Thông tin xe */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-lg border">
                    <Gauge className="w-4 h-4 text-amber-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Odo lúc nhận</p>
                      <p className="font-semibold">{booking.startOdo} Km</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-lg border">
                    <Banknote className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Tiền đặt cọc</p>
                      <p className="font-semibold">{booking.tariff?.depositAmount?.toLocaleString()} VND</p>
                    </div>
                  </div>
                </div>

                {/* Tình trạng xe */}
                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1">Tình trạng xe trước khi nhận</p>
                  <p className="text-sm">{booking.beforeRentingStatus || "Không có ghi chú"}</p>
                </div>

                {/* Thông tin dừng thuê */}
                {booking.stoppedData && (
                  <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 space-y-3">
                    <p className="font-semibold text-amber-700 dark:text-amber-400 mb-2">📋 Thông tin kết thúc thuê</p>
                    
                    {/* Thời gian */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Thời gian trả dự kiến</p>
                        <p className="font-medium">{booking.stoppedData.endTime}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Thời gian trả thực tế</p>
                        <p className="font-medium">{booking.stoppedData.actualEndTime}</p>
                      </div>
                      {booking.stoppedData.delayHours > 0 && (
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Trễ trả xe</p>
                          <p className="font-semibold text-red-500">{booking.stoppedData.delayHours} giờ</p>
                        </div>
                      )}
                    </div>

                    {/* Chi phí */}
                    <div className="border-t pt-3 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tổng tiền thuê dự kiến</span>
                        <span className="font-medium">{booking.stoppedData.expectedTotalAmount} VND</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tiền cọc đã thanh toán</span>
                        <span className="font-medium text-green-600">- {booking.stoppedData.depositAmount} VND</span>
                      </div>
                      {booking.stoppedData.penaltyAmount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tiền phạt trễ</span>
                          <span className="font-semibold text-red-500">+ {booking.stoppedData.penaltyAmount} VND</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">Tổng thanh toán cuối cùng</span>
                        <span className="font-bold text-lg text-green-600">{booking.stoppedData.totalAmount} VND</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Thông tin trả xe */}
          <div className="space-y-4 p-4 rounded-lg border bg-slate-50 dark:bg-slate-900">
            <h3 className="font-semibold text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Thông tin trả xe
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label className="text-sm">Tình trạng xe khi trả</Label>
                <Input
                  placeholder="VD: Có vết xước nhẹ bên phải"
                  value={vehicleStatus}
                  onChange={(e) => setVehicleStatus(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm">Số công tơ mét (Odo kết thúc)</Label>
                <Input
                  placeholder="Nhập số km hiện tại"
                  value={endOdo}
                  onChange={(e) => setEndOdo(e.target.value)}
                  className="mt-1"
                />
              </div>

        

            </div>
          </div>

          {/* Nút kết thúc hợp đồng ở cuối form */}
          {booking?.stoppedData && (
            <Button
              onClick={handleEndRental}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white mt-4"
            >
              {loading ? "Đang xử lý..." : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Kết thúc hợp đồng
                </>
              )}
            </Button>
          )}

          {/* Thông báo và QR */}
          {message && (
            <p className="text-center text-sm mt-2 text-muted-foreground">
              {message}
            </p>
          )}

          {qrCode && (
            <div className="mt-4 text-center">
              <p className="mb-2 font-medium">Mã QR thanh toán:</p>
              <img
                src={qrCode}
                alt="QR code"
                className="mx-auto w-48 h-48 border rounded"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
