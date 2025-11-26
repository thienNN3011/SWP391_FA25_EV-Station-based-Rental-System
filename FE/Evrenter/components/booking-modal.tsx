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

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  vehicle: any
}

export function BookingModal({ isOpen, onClose, vehicle }: BookingModalProps) {
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [endTime, setEndTime] = useState<Date | null>(null)
  const [duration, setDuration] = useState(1)   
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
    if (vehicle?.tariffs?.length) {
      const dailyTariffs = vehicle.tariffs.filter(
        (t: any) => t.type.toUpperCase() === "DAILY" || t.type === "day"
      )
      if (dailyTariffs.length > 0) setSelectedTariff(dailyTariffs[0])
    }
  }, [vehicle])

  useEffect(() => {
    if (startTime && duration) {
      const t = new Date(startTime)
       t.setDate(t.getDate() + duration)
      setEndTime(t)
    }
  }, [startTime, duration])

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
  console.log("Booking body:", body);
  const res = await api.post("/bookings/createbooking", body);
  console.log("Booking response:", res); 

  if (res.status === 200 || res.status === 201) {
    localStorage.setItem("bookingData", JSON.stringify(res.data.data));
    setBookingSuccess(true);
  } else {
    setMessage("Có lỗi xảy ra, vui lòng thử lại.");
  }
} catch (err: any) {
  console.error("Booking error:", err); 
  const serverMsg =
    err.response?.data?.message ||
    (err.response?.data?.errors?.tariffId?.[0]);
  setMessage(serverMsg || "Vui lòng chọn đầy đủ thông tin");
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
                <p>Kiểm tra kĩ các thông tin trước khi xác nhận và đặt cọc</p>
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
                <p>Màu: {vehicle.color}</p>
                <p>Pin: {vehicle.batteryCapacity} kWh | Quãng đường: {vehicle.range} km</p>
              </CardContent>
            </Card>

            <div className="space-y-3">
              
              {/* Chọn số ngày */}
              <div>
                <Label>Số ngày thuê</Label>
                <select
                  className="w-full border rounded p-2 bg-white cursor-pointer"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                >
                  {[1, 3, 5, 7].map((d) => (
                    <option key={d} value={d}>
                      {d} ngày
                    </option>
                  ))}
                </select>
              </div>

              {/* Chọn thời gian bắt đầu */}
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

              {/* End time — AUTO CALCULATED, DISABLED */}
              <div>
                <Label>Kết thúc thuê xe (tự động)</Label>
                <div className="relative w-full opacity-70">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Calendar className="h-5 w-5" />
                  </span>
                  <DatePicker
                    selected={endTime}
                    onChange={() => {}}
                    disabled
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd/MM/yyyy HH:mm"
                    className="w-full border rounded p-2 pl-10"
                  />
                </div>
              </div>

              <Button
                onClick={handleBooking}
                disabled={loading}
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
