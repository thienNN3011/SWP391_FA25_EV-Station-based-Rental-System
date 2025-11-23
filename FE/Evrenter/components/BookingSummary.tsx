"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, Car, MapPin, DollarSign, QrCode } from "lucide-react"

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
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Đang tải thông tin đặt xe...</p>
      </div>
    )
  }

  const info = booking.bookingResponse
  const qr = booking.qr
  const paymentUrl = booking.paymentUrl

  const handlePayment = () => {
    if (paymentUrl) {
      window.location.href = paymentUrl
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-3xl shadow-lg border border-gray-200">
        <CardHeader className="text-center bg-sky-100 rounded-t-lg p-6">
          <CardTitle className="text-2xl font-bold text-sky-600 flex items-center justify-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            Xác nhận thông tin Booking!
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Vui lòng kiểm tra thông tin dưới đây và tiến hành thanh toán đặt cọc.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          {/* Vehicle Info */}
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Car className="h-5 w-5 text-sky-500" />
              Thông tin xe
            </h3>
            <p><strong>Tên xe:</strong> {info.vehicle.modelName}</p>
            <p><strong>Hãng:</strong> {info.vehicle.brand}</p>
            <p><strong>Màu:</strong> {info.vehicle.color}</p>
            <p><strong>Biển số:</strong> {info.vehicle.plateNumber}</p>
          </div>

          {/* Station Info */}
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-sky-500" />
              Trạm cho thuê
            </h3>
            <p><strong>Tên trạm:</strong> {info.station.stationName}</p>
            <p><strong>Địa chỉ:</strong> {info.station.address}</p>
            <p><strong>Giờ mở cửa:</strong> {info.station.openingHours}</p>
          </div>

          {/* Rental Package Info */}
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-sky-500" />
              Gói thuê
            </h3>
            <p><strong>Loại:</strong> {info.tariff.type === "hour" ? "Theo giờ" : info.tariff.type === "day" ? "Theo ngày" : "Theo tháng"}</p>
            <p><strong>Giá thuê:</strong> {info.tariff.price.toLocaleString()} VND</p>
            <p><strong>Tiền cọc:</strong> {info.tariff.depositAmount.toLocaleString()} VND</p>
            <p><strong>Thời gian thuê:</strong></p>
            <ul className="ml-4 list-disc text-gray-700">
              <li><strong>Bắt đầu:</strong> {new Date(info.startTime).toLocaleString()}</li>
              <li><strong>Kết thúc:</strong> {new Date(info.endTime).toLocaleString()}</li>
            </ul>
          </div>

          {/* Payment Section */}
          <div className="border rounded-lg p-6 bg-gradient-to-br from-sky-50 to-blue-50 shadow-sm text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center justify-center gap-2">
              <DollarSign className="h-5 w-5 text-sky-500" />
              Thanh toán đặt cọc
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Tiền cọc: <strong className="text-lg text-sky-600">{info.tariff.depositAmount.toLocaleString()} VND</strong>
            </p>
            <Button
              onClick={handlePayment}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3"
            >
              <DollarSign className="mr-2 h-5 w-5" />
              Thanh toán ngay qua VNPay
            </Button>
            <p className="text-xs text-gray-500 mt-3">
              Bạn sẽ được chuyển đến trang thanh toán VNPay an toàn
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại trang chủ
            </Button>
            <Button
              onClick={handlePayment}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            >
              Tiến hành thanh toán
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}