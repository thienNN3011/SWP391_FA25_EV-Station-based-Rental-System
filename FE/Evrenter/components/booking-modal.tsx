"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Zap, MapPin, DollarSign } from "lucide-react"
import { api } from "@/lib/api"
import BookingSummary from "@/components/BookingSummary"

export function BookingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [vehicle, setVehicle] = useState<any>(null)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [selectedTariff, setSelectedTariff] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [message, setMessage] = useState("")


  useEffect(() => {
    const selected = localStorage.getItem("selectedVehicle")
    if (selected) setVehicle(JSON.parse(selected))
  }, [isOpen])

  useEffect(() => {
    if (vehicle?.tariffs?.length) setSelectedTariff(vehicle.tariffs[0])
  }, [vehicle])

const handleBooking = async () => {
  if (!vehicle || !selectedTariff) return
  setLoading(true)
  setMessage("")

  const body: any = {
    stationName: vehicle.stationName,
    modelId: vehicle.modelId.toString(),
    color: vehicle.color,
    tariffId: selectedTariff.tariffId,
    startTime: startTime ? `${startTime}:00` : null,
  }

  if (endTime) {
    body.endTime = `${endTime}:00`
  }

  console.log("Body gửi lên backend:", body)

  try {
    const res = await api.post("/bookings/createbooking", body)
    if (res.status === 200 || res.status === 201) {
      localStorage.setItem("bookingData", JSON.stringify(res.data.data))
      setBookingSuccess(true)
    } else {
      setMessage("Có lỗi xảy ra, vui lòng thử lại.")
    }
  } catch (err: any) {
    console.error("Booking error:", err)

    const serverMsg =
      err.response?.data?.message || 
      (err.response?.data?.errors?.endTime?.[0]) 
    setMessage(serverMsg || "Vui lòng chọn đầy đủ thông tin")
  } finally {
    setLoading(false)
  }
}


  if (!vehicle) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {bookingSuccess ? (
          <BookingSummary />
        ) : (
          <>
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
                <p>
                  Pin: {vehicle.batteryCapacity} kWh | Quãng đường: {vehicle.range} km
                </p>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <div>
                <Label>Chọn loại giá</Label>
                <select
                  className="w-full border rounded p-2"
                  value={selectedTariff?.tariffId}
                  onChange={(e) => {
                    const tariff = vehicle.tariffs.find(
                      (t: any) => t.tariffId === Number(e.target.value)
                    )
                    setSelectedTariff(tariff)
                  }}
                >
                  {vehicle.tariffs.map((t: any) => (
                    <option key={t.tariffId} value={t.tariffId}>
                      {t.type === "hour"
                        ? "Giờ"
                        : t.type === "day"
                        ? "Ngày"
                        : "Tháng"}{" "}
                      - {t.price.toLocaleString()} VND
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Bắt đầu nhận xe</Label>
                <Input
                  type="datetime-local"
                  onChange={(e) => setStartTime(e.target.value.replace("T", " "))}
                />
              </div>

              <div>
                <Label>Kết thúc thuê xe</Label>
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
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
