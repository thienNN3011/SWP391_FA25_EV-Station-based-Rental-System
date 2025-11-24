"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Zap, MapPin, DollarSign, Calendar } from "lucide-react"
import { api } from "@/lib/api"
import BookingSummary from "@/components/BookingSummary"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

export function BookingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [vehicle, setVehicle] = useState<any>(null)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [endTime, setEndTime] = useState<Date | null>(null)
  const [selectedTariff, setSelectedTariff] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [message, setMessage] = useState("")

  function formatDateForBackend(date: Date | null) {
    if (!date) return null
    const yyyy = date.getFullYear()
    const MM = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDate()).padStart(2, "0")
    const hh = String(date.getHours()).padStart(2, "0")
    const mm = String(date.getMinutes()).padStart(2, "0")
    const ss = String(date.getSeconds()).padStart(2, "0")
    return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`
  }

  useEffect(() => {
    const selected = localStorage.getItem("selectedVehicle")
    if (selected) {
      const parsedVehicle = JSON.parse(selected)
      setVehicle(parsedVehicle)
    }
  }, [isOpen])

  useEffect(() => {
    if (vehicle?.tariffs?.length) {
      const dailyTariffs = vehicle.tariffs.filter(
        (t: any) => t.type.toUpperCase() === "DAILY" || t.type === "day"
      )
      if (dailyTariffs.length > 0) setSelectedTariff(dailyTariffs[0])
    }
  }, [vehicle])

  const handleBooking = async () => {
    if (!vehicle || !selectedTariff) {
      setMessage("Vui lòng chọn đầy đủ thông tin")
      return
    }
    setLoading(true)
    setMessage("")

    const body = {
      stationName: vehicle.stationName,
      modelId: vehicle.modelId.toString(),
      color: vehicle.color,
      tariffId: selectedTariff?.tariffId || selectedTariff?.id,
      startTime: formatDateForBackend(startTime),
      endTime: formatDateForBackend(endTime),
    }

    try {
      const res = await api.post("/bookings/createbooking", body)
      if (res.status === 200 || res.status === 201) {
        localStorage.setItem("bookingData", JSON.stringify(res.data.data))
        setBookingSuccess(true)
      } else {
        setMessage("Có lỗi xảy ra, vui lòng thử lại.")
      }
    } catch (err: any) {
      const serverMsg =
        err.response?.data?.message ||
        (err.response?.data?.errors?.tariffId?.[0])
      setMessage(serverMsg || "Vui lòng chọn đầy đủ thông tin")
    } finally {
      setLoading(false)
    }
  }

  if (!vehicle) return null

  const dailyTariffs = vehicle.tariffs.filter(
    (t: any) => t.type.toUpperCase() === "DAILY" || t.type === "day"
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full sm:w-full">
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
                <p>Pin: {vehicle.batteryCapacity} kWh | Quãng đường: {vehicle.range} km</p>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {/* Tariff */}
              {dailyTariffs.length > 0 ? (
                <div>
                  <Label htmlFor="tariff-select">Chọn gói thuê</Label>
                  <select
                    id="tariff-select"
                    value={selectedTariff?.tariffId || selectedTariff?.id || ""}
                    onChange={(e) => {
                      const tariff = dailyTariffs.find(
                        (t: any) => (t.tariffId || t.id) === parseInt(e.target.value)
                      )
                      setSelectedTariff(tariff)
                    }}
                    className="w-full border rounded p-2 bg-white cursor-pointer"
                  >
                    {dailyTariffs.map((t: any) => (
                      <option key={t.tariffId || t.id} value={t.tariffId || t.id}>
                        {t.price.toLocaleString()} VND / ngày
                      </option>
                    ))}
                  </select>
                  {selectedTariff?.depositAmount != null && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Tiền cọc cần thanh toán:{" "}
                      <span className="font-semibold text-secondary">
                        {Number(selectedTariff.depositAmount).toLocaleString()} VND
                      </span>
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-red-500 text-sm">Không có gói thuê theo ngày khả dụng.</p>
              )}

              {/* Start time */}
              <div>
                <Label>Bắt đầu nhận xe</Label>
                <div className="relative w-full">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Calendar className="h-5 w-5" />
                  </span>
                  <DatePicker
                    selected={startTime}
                    onChange={(date: Date | null) => setStartTime(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd/MM/yyyy HH:mm"
                    placeholderText="Chọn ngày giờ nhận xe"
                    className="w-full border rounded p-2 pl-10 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
              </div>

              {/* End time */}
              <div>
                <Label>Kết thúc thuê xe</Label>
                <div className="relative w-full">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Calendar className="h-5 w-5" />
                  </span>
                  <DatePicker
                    selected={endTime}
                    onChange={(date: Date | null) => setEndTime(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd/MM/yyyy HH:mm"
                    placeholderText="Chọn ngày giờ trả xe"
                    className="w-full border rounded p-2 pl-10 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
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
