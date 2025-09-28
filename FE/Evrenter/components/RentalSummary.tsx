"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Car, Clock, Battery, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"

export function RentalSummary() {
  const router = useRouter()

  const handleConfirmReturn = () => {
    // Điều hướng sang màn hình tiến trình trả xe
    router.push("/return-flow")
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Card className="border-secondary/20 bg-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Tesla Model 3</span>
            <Badge variant="default">Đang thuê</Badge>
          </CardTitle>
          <CardDescription>Thông tin xe bạn đang thuê</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Trạm Quận 3</span>
            </div>
            <div className="flex items-center gap-2">
              <Battery className="h-4 w-4 text-green-500" />
              <span>78% pin</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-muted-foreground" />
              <span>127 km đã đi</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Bắt đầu: 9:00 AM</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button
              onClick={handleConfirmReturn}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              Xác nhận trả xe
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
