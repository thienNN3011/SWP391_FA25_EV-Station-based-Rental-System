"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Zap, Car } from "lucide-react"

interface Location {
  id: string
  name: string
  address: string
  availableVehicles: number
}

// Mock dữ liệu các trạm xe
const mockLocations: Location[] = [
  {
    id: "1",
    name: "Trạm Thủ Đức",
    address: "Khu vực trung tâm TP. Thủ Đức",
    availableVehicles: 8,
  },
  {
    id: "2",
    name: "Trạm Quận 9",
    address: "Khu Công Nghệ Cao, Quận 9, TP HCM",
    availableVehicles: 12,
  },
  {
    id: "3",
    name: "Trạm Quận 1",
    address: "Nguyễn Huệ, Quận 1, TP.HCM",
    availableVehicles: 5,
  },
  {
    id: "4",
    name: "Trạm Bình Thạnh",
    address: "Điện Biên Phủ, Quận Bình Thạnh",
    availableVehicles: 15,
  },
  {
    id: "5",
    name: "Trạm Quận 3",
    address: "Cách Mạng Tháng 8, Quận 3, TP.HCM",
    availableVehicles: 10,
  },
]

export function MapView() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-secondary" />
          Địa điểm thuê xe
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 flex flex-col flex-1">
        {/* Danh sách trạm */}
        <div className="flex-1 overflow-y-auto relative">
          {/* Hình nền tượng trưng */}
          <div className="absolute inset-0 bg-[url('/city-map-with-electric-charging-stations.jpg')] bg-cover bg-center opacity-20"></div>

          <div className="relative z-10 p-4 space-y-3">
            {mockLocations.map((location) => (
              <div
                key={location.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedLocation?.id === location.id
                    ? "bg-secondary/10 border-secondary shadow-md"
                    : "bg-card border-border hover:bg-muted/50"
                }`}
                onClick={() => setSelectedLocation(location)}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium text-sm">{location.name}</h3>
                    <p className="text-xs text-muted-foreground">{location.address}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    <Car className="h-3 w-3 mr-1" />
                    {location.availableVehicles}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedLocation && (
          <div className="p-4 border-t bg-muted/30">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{selectedLocation.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedLocation.availableVehicles} xe khả dụng
                </p>
              </div>
              <Button
                size="sm"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                <Zap className="h-4 w-4 mr-1" />
                Xem chi tiết
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
