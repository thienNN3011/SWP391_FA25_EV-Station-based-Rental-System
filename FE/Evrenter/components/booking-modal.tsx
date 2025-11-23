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
    if (selected) {
      const parsedVehicle = JSON.parse(selected)
      console.log("Vehicle from localStorage:", parsedVehicle)
      console.log("Tariffs:", parsedVehicle?.tariffs) // Debug tariffs
      setVehicle(parsedVehicle)
    }
  }, [isOpen])

  // Chỉ lấy tariff theo ngày
  useEffect(() => {
    if (vehicle?.tariffs?.length) {
      const dailyTariffs = vehicle.tariffs.filter(
        (t: any) => t.type.toUpperCase() === "DAILY" || t.type === "day"
      )
      console.log("Daily tariffs:", dailyTariffs)
      if (dailyTariffs.length > 0) {
        console.log("Selected tariff:", dailyTariffs[0]) // Debug selected tariff
        setSelectedTariff(dailyTariffs[0])
      }
    }
  }, [vehicle])
const handleBooking = async () => {
    if (!vehicle || !selectedTariff) {
      setMessage("Vui lòng chọn đầy đủ thông tin")
      return
    }
    setLoading(true)
    setMessage("")

    // Debug: Kiểm tra property của tariff
    console.log("selectedTariff keys:", Object.keys(selectedTariff))
    console.log("selectedTariff values:", selectedTariff)

    // Tìm đúng property name cho tariff ID
    const tariffId = selectedTariff.tarriffId || selectedTariff.tariffId || selectedTariff.id
    console.log("Tariff ID to send:", tariffId)

    const body: any = {
      stationName: vehicle.stationName,
      modelId: vehicle.modelId.toString(),
      color: vehicle.color,
      tariffId: tariffId, // Thay tarriffId thành tariffId (1 chữ f)
      startTime: startTime ? `${startTime}:00` : null,
    }

    if (endTime) {
      body.endTime = `${endTime}:00`
    }

    console.log("Body gửi lên backend:", body)

    try {
      const res = await api.post("/bookings/createbooking", body)
      if (res.status === 200 || res.status === 201) {
        const bookingData = res.data.data
        localStorage.setItem("bookingData", JSON.stringify(bookingData))
        
        // Show booking summary first, let user review before payment
        setBookingSuccess(true)
      } else {
        setMessage("Có lỗi xảy ra, vui lòng thử lại.")
      }
    } catch (err: any) {
      console.error("Booking error:", err)

      const serverMsg =
        err.response?.data?.message || 
        (err.response?.data?.errors?.tariffId?.[0]) 
      setMessage(serverMsg || "Vui lòng chọn đầy đủ thông tin")
    } finally {
      setLoading(false)
    }
  }

  if (!vehicle) return null

  // Lọc chỉ lấy tariff theo ngày
  const dailyTariffs = vehicle.tariffs.filter(
    (t: any) => t.type.toUpperCase() === "DAILY" || t.type === "day"
  )

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
              {/* Chỉ hiển thị nếu có tariff theo ngày */}
              {dailyTariffs.length > 0 ? (
                <div>
                  <Label htmlFor="tariff-select">Chọn gói thuê</Label>
                  <select
                    id="tariff-select"
                    value={selectedTariff?.tarriffId || selectedTariff?.tariffId || selectedTariff?.id || ""}
                    onChange={(e) => {
                      const tariff = dailyTariffs.find(
                        t => (t.tarriffId || t.tariffId || t.id) === parseInt(e.target.value)
                      )
                      console.log("Selected tariff from dropdown:", tariff)
                      setSelectedTariff(tariff)
                    }}
                    className="w-full border rounded p-2 bg-white cursor-pointer"
                  >
                    {dailyTariffs.map(t => (
                      <option key={t.tarriffId || t.tariffId || t.id} value={t.tarriffId || t.tariffId || t.id}>
                        {t.price.toLocaleString()} VND / ngày
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <p className="text-red-500 text-sm">Không có gói thuê theo ngày khả dụng.</p>
              )}

              <div>
                <Label>Bắt đầu nhận xe</Label>
                <Input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value.replace("T", " "))}
                />
              </div>

              <div>
                <Label>Kết thúc thuê xe</Label>
                <Input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value.replace("T", " "))}
                />
              </div>

              <Button
                onClick={handleBooking}
                disabled={loading || dailyTariffs.length === 0}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white"
              >
                <DollarSign className="mr-2 h-4 w-4" />
                {loading ? "Đang xử lý..." : "Xác nhận đặt xe"}
              </Button>

              {message && <p className="text-center text-sm mt-2 text-red-500">{message}</p>}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}