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
  const [transactionDate, setTransactionDate] = useState<string>(new Date().toISOString().slice(0, 16)) 

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
        startTime: formatDate(bookingInfo.startTime),
        endTime: formatDate(bookingInfo.endTime),
        actualStartTime: formatDate(bookingInfo.actualStartTime),
        stoppedData: null, // chưa dừng thuê
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

      setBooking((prev: any) => prev ? {
        ...prev,
        stoppedData: {
          endTime: formatDate(stopData.endTime),
          actualEndTime: formatDate(stopData.actualEndTime),
          extraFee: stopData.extraFee.toLocaleString(),
          totalAmount: stopData.totalAmount.toLocaleString(),
        }
      } : null)

      setMessage("Đã xác nhận kết thúc thuê, kiểm tra thông tin rồi mới nhấn 'Kết thúc hợp đồng'.")
    } catch (err: any) {
      console.error("Lỗi stop renting:", err)
      setMessage("Không thể xác nhận kết thúc thuê. Vui lòng thử lại.")
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
        transactionDate,
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
          <div>
            <Label>Mã Booking</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Nhập Booking ID"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
              />
              <Button onClick={handleViewBooking} disabled={loading}>
                Xem
              </Button>
              <Button onClick={handleConfirmStopRenting} disabled={loading || !booking}>
                Xác nhận kết thúc thuê
              </Button>
            </div>
          </div>

          {/* Thông tin booking */}
          {booking && (
            <div className="p-3 border rounded bg-secondary/10 text-sm space-y-1">
              <p><strong>Trạm:</strong> {booking.station?.stationName}</p>
              <p><strong>Địa chỉ:</strong> {booking.station?.address}</p>
              <p>
                <strong>Xe:</strong> {booking.vehicle?.brand} {booking.vehicle?.modelName} (
                {colorMap[booking.vehicle?.color?.trim().toLowerCase()] || booking.vehicle?.color})
              </p>
              <p><strong>Biển số:</strong> {booking.vehicle?.plateNumber}</p>
              <p><strong>Khách hàng:</strong> {booking.user?.fullName}</p>
              <p><strong>SĐT:</strong> {booking.user?.phone}</p>
              <p><strong>Thời gian thuê dự định:</strong> {booking.startTime} → {booking.endTime}</p>
              <p><strong>Thời gian bắt đầu thực tế:</strong> {booking.actualStartTime}</p>
              <p><strong>Tình trạng xe trước khi nhận:</strong> {booking.beforeRentingStatus}</p>
              <p><strong>Odo lúc nhận xe:</strong> {booking.startOdo} Km</p>
              <p><strong>Tiền đặt cọc:</strong> {booking.tariff?.depositAmount?.toLocaleString()} VND</p>

              {/* Thông tin dừng thuê */}
              {booking.stoppedData && (
                <div className="p-3 border rounded bg-yellow-50 mt-2 space-y-1">
                  <p><strong>Thời gian trả dự kiến:</strong> {booking.stoppedData.endTime}</p>
                  <p><strong>Thời gian trả thực tế:</strong> {booking.stoppedData.actualEndTime}</p>
                  <p><strong>Phí phụ thu:</strong> {booking.stoppedData.extraFee} VND</p>
                  <p><strong>Tổng thanh toán:</strong> {booking.stoppedData.totalAmount} VND</p>
                </div>
              )}
            </div>
          )}

          {/* Thông tin trả xe */}
          <div>
            <Label>Tình trạng xe khi trả</Label>
            <Input
              placeholder="VD: Có vết xước nhẹ bên phải"
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
            <Label>Mã thanh toán</Label>
            <Input
              placeholder="Nhập mã thanh toán"
              value={referenceCode}
              onChange={(e) => setReferenceCode(e.target.value)}
            />
          </div>

          <div>
            <Label>Thời gian hoàn trả tiền đặt cọc</Label>
            <Input
              type="datetime-local"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
            />
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
