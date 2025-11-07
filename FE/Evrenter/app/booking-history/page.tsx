"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Car, Clock, MapPin } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import { Header } from "@/components/header"


type Booking = {
  bookingId: number
  vehicleModel: string
  vehicleColor: string
  plateNumber: string
  stationName: string
  stationAddress: string
  startTime: string
  endTime: string
  totalAmount: number
  status: string
}

export default function BookingHistoryPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const res = await api.post("/bookings/showbookingbystatus", { status: "BOOKING" })
      if (res.data.success) {
        const simplified: Booking[] = res.data.data.map((b: any) => ({
          bookingId: b.bookingId,
          vehicleModel: b.vehicle.modelName,
          vehicleColor: b.vehicle.color,
          plateNumber: b.vehicle.plateNumber,
          stationName: b.station.stationName,
          stationAddress: b.station.address,
          startTime: b.startTime,
          endTime: b.endTime,
          totalAmount: b.totalAmount,
          status: b.status,
        }))
        setBookings(simplified)
      } else {
        toast.error("Lỗi backend: " + res.data.message)
      }
    } catch (err: any) {
      console.error(err.response || err.message)
      if (err.response?.status === 403) {
        toast.error("Bạn không có quyền truy cập. Vui lòng đăng nhập lại.")
      } else {
        toast.error("Lỗi khi lấy danh sách booking")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (bookingId: number) => {
    try {
      const res = await api.post("/bookings/cancelbooking", { bookingId })
      if (res.data.success) {
        setBookings((prev) => prev.filter((b) => b.bookingId !== bookingId))
        toast.success("Hủy booking thành công!")
      } else {
        toast.error("Hủy booking thất bại: " + res.data.message)
      }
    } catch (err: any) {
      console.error(err.response || err.message)
      toast.error("Có lỗi xảy ra khi hủy booking")
    }
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: false })

  if (loading) return <div className="text-center p-6">Đang tải danh sách booking...</div>

  return (
    <div className="max-w-4xl mx-auto p-4">
       <Header />
      {/* Toaster */}
      <Toaster position="top-right" />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-secondary" />
            Danh sách booking hiện tại
          </CardTitle>
          <CardDescription>Danh sách các booking mà bạn có thể hủy</CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">Hiện không có booking nào</div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div
                  key={b.bookingId}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <Car className="h-6 w-6 text-secondary" />
                    </div>

                    <div className="space-y-1">
                      <div className="font-medium">
                        {b.vehicleModel} ({b.vehicleColor}) - {b.plateNumber}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {b.stationName}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(b.startTime)} - {formatTime(b.endTime)}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">{b.stationAddress}</div>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="font-medium text-secondary">{b.totalAmount.toLocaleString()}₫</div>
                    <Badge variant="outline" className="text-xs">
                      {b.status}
                    </Badge>
                    <Button size="sm" variant="destructive" onClick={() => handleCancel(b.bookingId)}>
                      Hủy
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
