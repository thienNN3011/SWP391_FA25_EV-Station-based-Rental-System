"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { Car, FileText, Mail } from "lucide-react"

export default function StartRentalStaff() {
  const [bookingId, setBookingId] = useState("")
  const [booking, setBooking] = useState<any>(null)
  const [vehicleStatus, setVehicleStatus] = useState("")
  const [startOdo, setStartOdo] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  
  const handleFetchBooking = async () => {
    if (!bookingId) return
    setMessage("")
    setLoading(true)
    try {
      const res = await api.post("/bookings/showdetailbooking", { bookingId })
      setBooking(res.data)
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
      const body = {
        bookingId,
        vehicleStatus,
        startOdo,
      }

      const res = await api.post("/bookings/startrental", body)
      if (res.status === 200 || res.status === 201) {
        setMessage("Nhận xe thành công! Hợp đồng đã được gửi qua email.")
      } else {
        setMessage("Có lỗi xảy ra khi nhận xe.")
      }
    } catch (err: any) {
      console.error("Start rental error:", err)
      setMessage(
        err.response?.data?.message ||
          "Không thể gửi yêu cầu nhận xe. Vui lòng thử lại."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <Card className="border border-secondary/30 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5 text-secondary" />
            Nhận xe & Gửi hợp đồng
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
       
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
            <div className="p-3 border rounded bg-secondary/10 text-sm">
              <p><strong>Trạm:</strong> {booking.stationName}</p>
              <p><strong>Xe:</strong> {booking.vehicleName}</p>
              <p><strong>Khách hàng:</strong> {booking.customerName}</p>
              <p><strong>Thời gian thuê:</strong> {booking.startTime} → {booking.endTime}</p>
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
                Nhận xe & Gửi hợp đồng
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
