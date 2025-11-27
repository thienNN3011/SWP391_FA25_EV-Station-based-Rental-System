"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { Car, FileText, Calendar, DollarSign, User, MapPin, Phone, Search } from "lucide-react"

export default function StartRentalStaff() {
  const [bookingId, setBookingId] = useState("")
  const [booking, setBooking] = useState<any>(null)
  const [vehicleStatus, setVehicleStatus] = useState("")
  const [startOdo, setStartOdo] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString)
    const d = date.getDate().toString().padStart(2, "0")
    const m = (date.getMonth() + 1).toString().padStart(2, "0")
    const y = date.getFullYear()
    const hh = date.getHours().toString().padStart(2, "0")
    const mm = date.getMinutes().toString().padStart(2, "0")
    return `${d}/${m}/${y} – ${hh}:${mm}`
  }

  const calculateRentalDays = (start: string, end: string) => {
    if (!start || !end) return 0
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffMs = endDate.getTime() - startDate.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    const baseDays = Math.floor(diffHours / 24)
    const extraHours = diffHours % 24
    const rentalDays = extraHours > 6 ? baseDays + 1 : baseDays
    return rentalDays > 0 ? rentalDays : 1
  }

  const colorMap: Record<string, string> = {
    red: "Đỏ", blue: "Xanh dương", white: "Trắng", black: "Đen",
    silver: "Bạc", gray: "Xám", green: "Xanh lá", yellow: "Vàng",
    orange: "Cam", brown: "Nâu",
  }

  const handleFetchBooking = async () => {
    if (!bookingId) return
    setMessage("")
    setLoading(true)
    try {
      const res = await api.post("/bookings/showdetailbooking", { bookingId })
      setBooking(res.data.data)
      setMessage("Đã tải thông tin đặt xe.")
    } catch (err: any) {
      console.error("Lỗi lấy booking:", err)
      setMessage("Không tìm thấy thông tin booking.")
    } finally {
      setLoading(false)
    }
  }

  
  const handleStartRental = async () => {
    if (!bookingId || !vehicleStatus || !startOdo) {
      setMessage("Vui lòng nhập đầy đủ thông tin trước khi xác nhận.")
      return
    }

    setLoading(true)
    setMessage("")
    try {
      const res = await api.post("/bookings/startrental", {
        bookingId,
        vehicleStatus,
        startOdo,
      })

      if (res.status === 200 || res.status === 201) {
        setMessage(" Nhận xe thành công! Hợp đồng đã được gửi qua email.")
      } else {
        setMessage("Có lỗi xảy ra khi nhận xe.")
      }
    } catch (err: any) {
      console.error("Start rental error:", err)
      setMessage(
        err.response?.data?.message ||
          "Kiểm tra lại dữ liệu nhập vào. Vui lòng thử lại."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="border border-secondary/30 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5 text-secondary" />
            Gửi hợp đồng
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
              <Button onClick={handleFetchBooking} disabled={loading} variant="outline" className="gap-2">
                <Search className="w-4 h-4" />
                Xem
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
                <p className="text-sm text-muted-foreground mt-1">
                  Biển số: <span className="font-mono font-semibold">{booking.vehicle?.plateNumber}</span>
                </p>
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
                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-green-500" />
                    <span className="font-medium">Thông tin khách hàng</span>
                  </div>
                  <div className="flex items-center gap-6 mb-3">
                    <span>{booking.user?.fullName}</span>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      <span>{booking.user?.phone}</span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">CCCD</p>
                      <a href={booking.user?.idCardPhoto} target="_blank" rel="noopener noreferrer">
                        <img
                          src={booking.user?.idCardPhoto}
                          alt="CCCD"
                          className="w-20 h-12 object-cover rounded border hover:scale-105 transition"
                        />
                      </a>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">GPLX</p>
                      <a href={booking.user?.driveLicensePhoto} target="_blank" rel="noopener noreferrer">
                        <img
                          src={booking.user?.driveLicensePhoto}
                          alt="GPLX"
                          className="w-20 h-12 object-cover rounded border hover:scale-105 transition"
                        />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Thời gian thuê */}
                <div className="grid grid-cols-2 gap-4 p-3 bg-white dark:bg-slate-800 rounded-lg border">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-purple-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Thời gian nhận xe</p>
                      <p className="font-medium">{formatDateTime(booking.startTime)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Số ngày thuê</p>
                    <p className="font-semibold text-black-600">
                      {calculateRentalDays(booking.startTime, booking.endTime)} ngày
                    </p>
                  </div>
                </div>

                {/* Chi phí */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-lg border">
                    <DollarSign className="w-4 h-4 text-amber-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Giá thuê/ngày</p>
                      <p className="font-semibold">{booking.tariff?.price?.toLocaleString()} VND</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-lg border">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Tiền cọc</p>
                      <p className="font-semibold text-green-600">
                        {booking.tariff?.depositAmount?.toLocaleString()} VND ✓
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form nhập thông tin */}
          <div className="space-y-4 p-4 rounded-lg border bg-slate-50 dark:bg-slate-900">
            <h3 className="font-semibold text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Thông tin nhận xe
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label className="text-sm">Tình trạng xe khi nhận</Label>
                <Input
                  placeholder="VD: Bình thường, không có hư hỏng"
                  value={vehicleStatus}
                  onChange={(e) => setVehicleStatus(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="col-span-2">
                <Label className="text-sm">Số công tơ mét (Odo bắt đầu)</Label>
                <Input
                  placeholder="Nhập số km hiện tại"
                  value={startOdo}
                  onChange={(e) => setStartOdo(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Nút gửi hợp đồng */}
          <Button
            onClick={handleStartRental}
            disabled={loading}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white"
          >
            {loading ? "Đang xử lý..." : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Gửi hợp đồng
              </>
            )}
          </Button>

          {message && (
            <p className="text-center text-sm mt-2 text-muted-foreground">
              {message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
