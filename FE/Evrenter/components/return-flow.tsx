"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2, Home } from "lucide-react"
import { useRouter } from "next/navigation"

// Hardcoded xe đang thuê
const rentedVehicle = {
  name: "VinFast VF7",
  license: "51F-12345",
  startDate: "2025-09-17 09:00",
  image: "/vf7.jpg",
  estimatedFee: 200000, // VND
}

type ReturnStatus = "pendingReturn" | "readyToPay" | "complete"

export function ReturnFlow() {
  const [status, setStatus] = useState<ReturnStatus>("pendingReturn")
  const [photosUploaded, setPhotosUploaded] = useState(false)
  const router = useRouter()

  // Mô phỏng backend check staff đã upload ảnh xong
  useEffect(() => {
    if (status !== "pendingReturn") return

    const timer = setTimeout(() => {
      setPhotosUploaded(true) // Sau 3s giả lập staff upload xong
    }, 3000)

    return () => clearTimeout(timer)
  }, [status])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trả xe</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* Thông tin xe đang thuê */}
        <div className="flex items-center gap-4 border p-4 rounded-lg bg-muted/10">
          <img src={rentedVehicle.image} alt={rentedVehicle.name} className="w-32 h-20 object-cover rounded-lg"/>
          <div>
            <div className="font-medium text-lg">{rentedVehicle.name}</div>
            <div className="text-sm text-muted-foreground">Biển số: {rentedVehicle.license}</div>
            <div className="text-sm text-muted-foreground">Ngày thuê: {rentedVehicle.startDate}</div>
            <div className="text-sm text-muted-foreground">Phí ước tính: {rentedVehicle.estimatedFee.toLocaleString()} VND</div>
          </div>
        </div>

        {/* Bước đang chờ nhân viên upload ảnh */}
        {status === "pendingReturn" && (
          <div className="text-center">
            {!photosUploaded ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin"/>
                <span>Đang chờ nhân viên upload ảnh...</span>
              </div>
            ) : (
              <Button
                onClick={() => setStatus("readyToPay")}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 mt-2"
              >
                Nhân viên đã upload xong ảnh
              </Button>
            )}
          </div>
        )}

        {/* Bước thanh toán */}
        {status === "readyToPay" && (
          <div className="text-center space-y-2">
            <span>Nhấn xác nhận để thanh toán và hoàn tất trả xe</span>
            <Button
              onClick={() => setStatus("complete")}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 mt-2"
            >
              Xác nhận thanh toán
            </Button>
          </div>
        )}

        {/* Hoàn tất */}
        {status === "complete" && (
          <div className="text-center space-y-2">
            <CheckCircle className="mx-auto h-8 w-8 text-green-500"/>
            <span className="font-medium">Trả xe hoàn tất!</span>
            <Button
              onClick={() => router.push("/")}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 mt-2"
            >
              <Home className="h-4 w-4 mr-2"/>
              Quay lại màn hình chính
            </Button>
          </div>
        )}

      </CardContent>
    </Card>
  )
}
