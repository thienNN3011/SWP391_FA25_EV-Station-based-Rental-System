"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Car, FileText } from "lucide-react"
import { api } from "@/lib/api"

export default function EndRentalStaff() {
  const [bookingId, setBookingId] = useState("")
  const [booking, setBooking] = useState<any>(null)
  const [vehicleStatus, setVehicleStatus] = useState("")
  const [endOdo, setEndOdo] = useState("")
  const [referenceCode, setReferenceCode] = useState("")
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

 
  const handleFetchBooking = async () => {
    if (!bookingId) return
    setMessage("")
    setLoading(true)
    try {
      const res = await api.post("/bookings/showdetailbooking", { bookingId })
      setBooking(res.data)
      setMessage("Đã tải thông tin booking.")
    } catch (err: any) {
      console.error("Lỗi lấy booking:", err)
      setMessage("Không tìm thấy thông tin booking.")
      setBooking(null)
    } finally {
      setLoading(false)
    }
  }

  
  const handleEndRental = async () => {
    if (!bookingId || !vehicleStatus || !endOdo || !referenceCode) {
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
        referenceCode,
        transactionDate: new Date().toISOString(),
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

  return (
    <div className="max-w-md mx-auto p-6">
      <Card className="border border-secondary/30 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5 text-secondary" />
            Kết thúc hợp đồng
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
            <div className="p-3 border rounded bg-secondary/10 text-sm space-y-1">
              <p><strong>Trạm:</strong> {booking.stationName}</p>
              <p><strong>Xe:</strong> {booking.vehicleName}</p>
              <p><strong>Khách hàng:</strong> {booking.customerName}</p>
              <p><strong>Thời gian thuê:</strong> {booking.startTime} → {booking.endTime}</p>
            </div>
          )}

        
          <div>
            <Label>Tình trạng xe khi trả</Label>
            <Input
              placeholder="VD: Có vết xước nhẹ bên cạnh phải"
              value={vehicleStatus}
              onChange={(e) => setVehicleStatus(e.target.value)}
            />
          </div>

          <div>
            <Label>Số công tơ mét (Odo kết thúc)</Label>
            <Input
              placeholder="Nhập số km hiện tại"
              value={endOdo}
              onChange={(e) => setEndOdo(e.target.value)}
            />
          </div>

          <div>
            <Label>Mã tham chiếu</Label>
            <Input
              placeholder="Nhập mã tham chiếu (reference code)"
              value={referenceCode}
              onChange={(e) => setReferenceCode(e.target.value)}
            />
          </div>

          
          <Button
            onClick={handleEndRental}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            {loading ? "Đang xử lý..." : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Kết thúc hợp đồng
              </>
            )}
          </Button>

     
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
