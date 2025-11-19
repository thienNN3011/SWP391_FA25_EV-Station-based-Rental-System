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

const STATUS_TABS = [
  { key: "ALL", label: "Tất cả" },
  { key: "BOOKING", label: "Đã hoàn tất cọc" },
  { key: "UNCONFIRMED", label: "Chưa xác nhận" },
  { key: "RENTING", label: "Đang thuê" },
  { key: "COMPLETED", label: "Hoàn thành" },
  { key: "CANCELLED", label: "Đã hủy" },
  { key: "NO_SHOW", label: "Không đến" },
]

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

export default function BookingHistoryPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState("ALL")

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const res = await api.post("/bookings/showbookingbystatus", { bookingStatus: "ALL" })

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
      toast.error("Vui lòng đăng nhập lại.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (bookingId: number) => {
    try {
      const res = await api.post("/bookings/cancelbooking", { bookingId })
      if (res.data.success) {
        setBookings((prev) => prev.map((b) => b.bookingId === bookingId ? { ...b, status: "CANCELLED" } : b))
        toast.success("Hủy booking thành công!")
      } else {
        toast.error("Hủy booking thất bại: " + res.data.message)
      }
    } catch {
      toast.error("Có lỗi xảy ra khi hủy booking")
    }
  }

  const filtered = bookings.filter((b) => (tab === "ALL" ? true : b.status === tab))

  const statusColor = (s: string) => {
    switch (s) {
      case "BOOKING": return "bg-yellow-400 text-black"
      case "RENTING": return "bg-blue-500 text-white"
      case "COMPLETED": return "bg-green-600 text-white"
      case "CANCELLED": 
      case "NO_SHOW": 
      case "UNCONFIRMED": return "bg-red-500 text-white"
      default: return "bg-gray-300 text-black"
    }
  }

  if (loading) return <div className="text-center p-6">Đang tải đơn...</div>

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Header />
      <Toaster position="top-right" />

     
      <div className="flex gap-2 overflow-x-auto py-3 mb-4">
        {STATUS_TABS.map((t) => (
          <Button
            key={t.key}
            variant={tab === t.key ? "default" : "outline"}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-secondary" />
            Lịch sử đơn thuê xe
          </CardTitle>
          <CardDescription>Xem lại tất cả đơn bạn đã đặt</CardDescription>
        </CardHeader>

        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              Không có đơn trong mục này
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((b) => (
                <div
                  key={b.bookingId}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <Car className="h-6 w-6 text-secondary" />
                    </div>

                    <div className="space-y-1">
                      <div className="font-medium">
                        {b.vehicleModel} (
                          {colorMap[b.vehicleColor?.trim().toLowerCase()] || b.vehicleColor}
                        ) - {b.plateNumber}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {b.stationName}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(b.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                          {" - "}
                          {new Date(b.endTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">{b.stationAddress}</div>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="font-medium text-secondary">{b.totalAmount.toLocaleString()}₫</div>

                    <Badge className={`${statusColor(b.status)} text-xs`}>
                      {STATUS_TABS.find(t => t.key === b.status)?.label ?? b.status}
                    </Badge>

                    {b.status === "BOOKING" && (
                      <Button size="sm" variant="destructive" onClick={() => handleCancel(b.bookingId)}>
                        Hủy
                      </Button>
                    )}
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
