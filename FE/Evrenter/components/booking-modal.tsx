"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, MapPin, DollarSign } from "lucide-react"
import { api } from "@/lib/api"

export function BookingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [vehicle, setVehicle] = useState<any>(null)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const selected = localStorage.getItem("selectedVehicle")
    if (selected) setVehicle(JSON.parse(selected))
  }, [isOpen])

  const handleBooking = async () => {
  if (!vehicle) return
  setLoading(true)
  setMessage("")

  const body = {
    stationName: vehicle.stationName,
    modelId: vehicle.modelId.toString(),
    color: vehicle.imageUrl?.[0]?.color || "blue",
    tariffId: vehicle.tariffs?.[0]?.tariffId || 0, 
    startTime: `${startTime}:00`,
    endTime: `${endTime}:00`,
  }

  console.log("Payload gửi đi:", JSON.stringify(body, null, 2))

  try {
    const res = await api.post("/bookings/createbooking", body)

    if (res.status === 200 || res.status === 201) {
      setMessage("Đặt xe thành công!")
    } else {
      setMessage("Có lỗi xảy ra, vui lòng thử lại.")
    }
  } catch (err: any) {
    console.error("Booking error:", err)

    const msg =
      err.response?.data?.message ||
      (err.response?.status === 403
        ? "Bạn không có quyền đặt xe"
        : "Lỗi kết nối đến máy chủ")

    setMessage(msg)
  } finally {
    setLoading(false)
  }
}


  if (!vehicle) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-secondary" />
            Đặt xe của bạn
          </DialogTitle>
        </DialogHeader>

        <Card className="border-secondary/20 bg-secondary/5 mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{vehicle.name}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {vehicle.stationName}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-muted-foreground">
            <p>Hãng: {vehicle.brand}</p>
            <p>Pin: {vehicle.batteryCapacity} kWh | Quãng đường: {vehicle.range} km</p>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <div>
            <Label>Bắt đầu</Label>
            <Input
              type="datetime-local"
              onChange={(e) => setStartTime(e.target.value.replace("T", " "))}
            />
          </div>
          <div>
            <Label>Kết thúc</Label>
            <Input
              type="datetime-local"
              onChange={(e) => setEndTime(e.target.value.replace("T", " "))}
            />
          </div>

          <Button
            onClick={handleBooking}
            disabled={loading}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            {loading ? "Đang xử lý..." : "Xác nhận đặt xe"}
          </Button>

          {message && <p className="text-center text-sm mt-2">{message}</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
