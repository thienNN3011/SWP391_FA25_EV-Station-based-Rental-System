"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, User, CheckCircle, Loader2 } from "lucide-react"

interface DigitalCheckinProps {
  onComplete: () => void
}

export function DigitalCheckin({ onComplete }: DigitalCheckinProps) {
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckin = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)
    setIsCheckedIn(true)

    // Auto-proceed after showing success
    setTimeout(() => {
      onComplete()
    }, 1500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-secondary" />
          Check-in
        </CardTitle>
        <CardDescription>Xác nhận thời gian và danh tính của bạn để bắt đầu quá trình thuê xe</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium">Văn A</div>
              <div className="text-sm text-muted-foreground">abc@egmail.com</div>
            </div>
            <Badge variant="default" className="ml-auto">
              Đã xác thực
            </Badge>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium">Quận 9</div>
              <div className="text-sm text-muted-foreground">Khu công nghệ cao</div>
            </div>
            <Badge variant="secondary" className="ml-auto">
              At Location
            </Badge>
          </div>
        </div>

        {/* Check-in Status */}
        {!isCheckedIn ? (
          <div className="space-y-4">
            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="text-sm">
                <strong>Sẵn sàng check-in?</strong> Thao tác này sẽ thông báo cho hệ thống của chúng tôi rằng bạn đã đến và sẵn sàng
bắt đầu quá trình thuê xe.
              </p>
            </div>

            <Button
              onClick={handleCheckin}
              disabled={isLoading}
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking In...
                </>
              ) : (
                <>
                  <Clock className="mr-2 h-4 w-4" />
                  Check In Now
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Check-in thành công!</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Bạn đã check-in vào lúc {new Date().toLocaleTimeString()}. Chuẩn bị bước tiếp theo...
              </p>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Kiểm tra kỹ thông tin cá nhân và thông tin xe bạn muốn thuê</p>
        </div>
      </CardContent>
    </Card>
  )
}
