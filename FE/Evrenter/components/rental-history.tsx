import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Car, Clock, MapPin } from "lucide-react"
import type { RentalHistory as RentalHistoryType } from "@/lib/types"

// Mock rental history data
const mockRentalHistory: RentalHistoryType[] = [
  {
    id: "1",
    vehicleModel: "VinFast VF 7",
    startDate: "2024-01-15T00:00:00Z",
    endDate: "2024-01-15T05:00:00Z",
    duration: 5,
    cost: 350,
    location: "Khu Công Nghệ Cao",
  },
  
]

export function RentalHistory() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5 text-secondary" />
          Lịch sử thuê xe
        </CardTitle>
        <CardDescription>Danh sách xe điện gần đây thuê</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockRentalHistory.map((rental) => (
            <div
              key={rental.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Car className="h-6 w-6 text-secondary" />
                </div>

                <div className="space-y-1">
                  <div className="font-medium">{rental.vehicleModel}</div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {rental.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {rental.duration}h
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(rental.startDate)} • {formatTime(rental.startDate)} - {formatTime(rental.endDate)}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-medium text-secondary">${rental.cost}</div>
                <Badge variant="outline" className="text-xs">
                  Hoàn tất
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button variant="outline">Xem toàn bộ danh sách</Button>
        </div>
      </CardContent>
    </Card>
  )
}
