"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { Car, FileText, Calendar, DollarSign, User } from "lucide-react"

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

        <CardContent className="space-y-6">
         
          <div>
            <Label>Mã Booking</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Nhập Booking ID"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
              />
              <Button onClick={handleFetchBooking} disabled={loading}>
                Xem
              </Button>
            </div>
          </div>

          
          {booking && (
            <div className="p-4 border rounded bg-secondary/10 space-y-3 text-sm">
              <h2 className="font-semibold text-base flex items-center gap-2">
                <User className="size-4 text-primary" /> Thông tin khách hàng
              </h2>
              <p><strong>Họ tên:</strong> {booking.user.fullName}</p>
              <p><strong>Số điện thoại:</strong> {booking.user.phone}</p>

              <div className="flex gap-4 mt-2">
                <div>
                  <p className="font-semibold text-sm mb-1">CCCD</p>
                    <a href={booking.user.idCardPhoto} target="_blank" rel="noopener noreferrer">
                  <img
                    src={booking.user.idCardPhoto}
                    alt="CCCD"
                    className="w-16 h-10 object-cover rounded bg-muted hover:scale-105 transition"
                  />
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">GPLX</p>
                    <a href={booking.user.driveLicensePhoto} target="_blank" rel="noopener noreferrer">
                  <img
                    src={booking.user.driveLicensePhoto}
                    alt="GPLX"
                    className="w-16 h-10 object-cover rounded bg-muted hover:scale-105 transition"
                  />
                  </a>
                </div>
              </div>

              <hr className="my-2" />

              <h2 className="font-semibold text-base flex items-center gap-2">
                <Car className="size-4 text-blue-500" /> Thông tin xe
              </h2>
              <p><strong>Xe:</strong> {booking.vehicle.modelName} ({booking.vehicle.brand})</p>
              <p><strong>Màu:</strong> {booking.vehicle.color}</p>
              <p><strong>Biển số:</strong> {booking.vehicle.plateNumber}</p>
            

              <hr className="my-2" />

              <h2 className="font-semibold text-base flex items-center gap-2">
                <Calendar className="size-4 text-green-500" /> Thông tin thuê
              </h2>
              <p>
  <strong>Thời gian thuê:</strong>{" "}
  {formatDateTime(booking.startTime)} → {formatDateTime(booking.endTime)}
</p>

           
             

              <hr className="my-2" />

              <h2 className="font-semibold text-base flex items-center gap-2">
                <DollarSign className="size-4 text-amber-500" /> Gói thuê & Trạm
              </h2>
           
              <p><strong>Giá thuê:</strong> {booking.tariff.price.toLocaleString()} VND</p>
              {booking.tariff.depositAmount > 0 && (
  <p>
    <strong>Tiền cọc:</strong>{" "}
    {booking.tariff.depositAmount.toLocaleString()} VND
    <span className="text-green-600 font-semibold ml-1">đã thanh toán</span>
  </p>
)} 
              <p><strong>Trạm:</strong> {booking.station.stationName}</p>
        
            
            </div>
          )}

        
          <div>
            <Label>Tình trạng xe khi nhận</Label>
            <Input
              placeholder="VD: Bình thường, không có hư hỏng"
              value={vehicleStatus}
              onChange={(e) => setVehicleStatus(e.target.value)}
            />
          </div>

          <div>
            <Label>Số công tơ mét (Odo bắt đầu)</Label>
            <Input
              placeholder="Nhập số km hiện tại"
              value={startOdo}
              onChange={(e) => setStartOdo(e.target.value)}
            />
          </div>

          
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
