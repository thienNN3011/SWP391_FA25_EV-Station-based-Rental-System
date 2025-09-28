"use client"

import { useState } from "react"
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Battery, Zap, Clock } from "lucide-react"
import type { Vehicle } from "@/lib/types"

// Mock vehicles data
const mockVehicles: Vehicle[] = [
  {
    id: "1",
    model: "VinFast VF 3",
    imageUrl: "/vf3.jpg",
    batteryLevel: 100,
    estimatedRange: 210,
    pricePerHour: 25,
    locationId: "1",
    isAvailable: true,
  },
  {
    id: "2",
    model: "VinFast VF 5",
    imageUrl: "/vf5.jpg",
    batteryLevel: 100,
    estimatedRange: 300,
    pricePerHour: 35,
    locationId: "1",
    isAvailable: true,
  },
  {
    id: "3",
    model: "VinFast VF 6",
    imageUrl: "/vf6-plus.jpg",
    batteryLevel: 100,
    estimatedRange: 460,
    pricePerHour: 52,
    locationId: "1",
    isAvailable: true,
  },
  {
    id: "4",
    model: "VinFast VF 7",
    imageUrl: "/vf7.jpg",
    batteryLevel: 100,
    estimatedRange: 490,
    pricePerHour: 70,
    locationId: "1",
    isAvailable: true,
  },
  {
    id: "5",
    model: "VinFast VF 8",
    imageUrl: "/vf8.jpg",
    batteryLevel: 100,
    estimatedRange: 470,
    pricePerHour: 70,
    locationId: "1",
    isAvailable: true,
  },
  {
    id: "6",
    model: "VinFast VF 9",
    imageUrl: "/vf9.jpg",
    batteryLevel: 100,
    estimatedRange: 580,
    pricePerHour: 110,
    locationId: "1",
    isAvailable: true,
  },
]

export function VehicleList() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const router = useRouter();

  const handleRentNow = (vehicleId: string) => {
    router.push(`/pickup?vehicleId=${vehicleId}`); 
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Các xe có thể thuê</h2>
        <Badge variant="outline">{mockVehicles.filter((v) => v.isAvailable).length} xe có thể thuê</Badge>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {mockVehicles.map((vehicle) => (
          <Card
            key={vehicle.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedVehicle?.id === vehicle.id ? "ring-2 ring-secondary" : ""
            }`}
            onClick={() => setSelectedVehicle(vehicle)}
          >
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="w-24 h-16 bg-muted rounded-lg overflow-hidden">
                  <img
                    src={vehicle.imageUrl || "/placeholder.svg"}
                    alt={vehicle.model}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium">{vehicle.model}</h3>
                    <div className="text-right">
                      <div className="text-lg font-bold text-secondary">${vehicle.pricePerHour}</div>
                      <div className="text-xs text-muted-foreground">per hour</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Battery className="h-4 w-4 text-green-500" />
                      <span>{vehicle.batteryLevel}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4 text-secondary" />
                      <span>{vehicle.estimatedRange} mi</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Clock className="h-4 w-4 mr-1" />
                      Booking
                    </Button>
                    <Button
                      onClick={() => handleRentNow(vehicle.id)}
                      size="sm"
                      className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    >
                      <Zap className="h-4 w-4 mr-1" />
                      Thuê ngay
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
