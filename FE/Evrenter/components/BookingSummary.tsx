"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, Car, MapPin, DollarSign } from "lucide-react"

export default function BookingSummary() {
  const [booking, setBooking] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const data = localStorage.getItem("bookingData")
    if (data) {
      setBooking(JSON.parse(data))
    } else {
      router.push("/")
    }
  }, [router])

  if (!booking) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-500 text-lg">Đang tải thông tin đặt xe...</p>
      </div>
    )
  }

  const info = booking.bookingResponse
  const paymentUrl = booking.paymentUrl

  const handlePayment = () => {
    if (paymentUrl) window.location.href = paymentUrl
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-5xl shadow-2xl border border-gray-200 rounded-3xl">
        {/* Header */}
        <CardHeader className="text-center bg-gradient-to-r from-sky-100 to-sky-200 rounded-t-3xl p-8">
  <CardTitle className="text-4xl font-bold text-sky-600 flex items-center justify-center gap-3">
    <CheckCircle className="h-8 w-8 text-green-500" />
    Đăng ký thuê xe!
  </CardTitle>
  <CardDescription className="text-gray-700 mt-3 text-lg space-y-2 flex flex-col items-center">
    <span>Vui lòng kiểm tra thông tin và tiến hành thanh toán đặt cọc.</span>
    <span>
      Chúng tôi chỉ hoàn lại{' '}
      <span className="font-bold text-red-500">70%</span> số tiền cọc khi bạn không còn nhu cầu thuê xe hoặc đặt sai thông tin.
    </span>
  </CardDescription>
</CardHeader>


        {/* Content */}
        <CardContent className="space-y-6 p-6">
          {/* Vehicle Info */}
          <div className="border rounded-xl p-5 bg-white shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Car className="h-6 w-6 text-sky-500" />
              Thông tin xe
            </h3>
            <p><strong>Tên xe:</strong> {info.vehicle.modelName}</p>
            <p><strong>Hãng:</strong> {info.vehicle.brand}</p>
            <p><strong>Màu:</strong> {info.vehicle.color}</p>
            <p><strong>Biển số:</strong> {info.vehicle.plateNumber}</p>
          </div>

          {/* Station Info */}
          <div className="border rounded-xl p-5 bg-white shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-sky-500" />
              Trạm cho thuê
            </h3>
            <p><strong>Tên trạm:</strong> {info.station.stationName}</p>
            <p><strong>Địa chỉ:</strong> {info.station.address}</p>
            <p><strong>Giờ mở cửa:</strong> {info.station.openingHours}</p>
          </div>

          {/* Rental Info */}
          <div className="border rounded-xl p-5 bg-white shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-sky-500" />
              Gói thuê
            </h3>
            <p><strong>Loại:</strong> {(() => {
              const type = info.tariff.type.toLowerCase()
              if (type === "hour" || type === "hourly") return "Theo giờ"
              if (type === "day" || type === "daily") return "Theo ngày"
              if (type === "week" || type === "weekly") return "Theo tuần"
              return "Theo tháng"
            })()}</p>
            <p><strong>Giá thuê:</strong> {info.tariff.price.toLocaleString()} VND</p>
            <p><strong>Tiền cọc:</strong> {info.tariff.depositAmount.toLocaleString()} VND</p>
            <p><strong>Thời gian thuê:</strong></p>
            <ul className="ml-5 list-disc text-gray-700">
              <li><strong>Bắt đầu:</strong> {new Date(info.startTime).toLocaleString()}</li>
              <li>
  <strong>Số ngày thuê:</strong>{" "}
  {(() => {
    const start = new Date(info.startTime);
    const end = new Date(info.endTime);
    const diff = end.getTime() - start.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return `${days} ngày`;
  })()}
</li>

            </ul>
          </div>

          {/* Payment Section */}
          <div className="border rounded-xl p-6 bg-gradient-to-r from-sky-50 to-blue-50 shadow-md text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-3 flex items-center justify-center gap-2">
              <DollarSign className="h-6 w-6 text-sky-500" />
              Thanh toán đặt cọc
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Tiền cọc: <strong className="text-lg text-sky-600">{info.tariff.depositAmount.toLocaleString()} VND</strong>
            </p>
            <Button
              onClick={handlePayment}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <DollarSign className="h-5 w-5" />
              Thanh toán ngay
            </Button>
            <p className="text-xs text-gray-500 mt-3">
              Bạn sẽ được chuyển đến trang thanh toán VNPay an toàn
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Quay lại trang chủ
            </Button>
            <Button
              onClick={handlePayment}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold"
            >
              Tiến hành thanh toán
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
