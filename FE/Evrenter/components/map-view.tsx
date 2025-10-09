"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Zap, Car } from "lucide-react"

interface Station {
  stationName: string
  address: string
  openingHours: string
}

interface MapViewProps {
  onSelectStation?: (stationName: string) => void
}

export function MapView({ onSelectStation }: MapViewProps) {
  const [stations, setStations] = useState<Station[]>([])
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch("http://localhost:8080/EVRental/showactivestation")
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const result = await response.json()
        if (result.success && result.data) {
          setStations(result.data)
        } else {
          setError("Không thể tải dữ liệu trạm.")
        }
      } catch (err) {
        console.error("Lỗi tải trạm:", err)
        setError("Lỗi khi kết nối đến máy chủ.")
      } finally {
        setLoading(false)
      }
    }
    fetchStations()
  }, [])

  const handleSelect = (station: Station) => {
    setSelectedStation(station)
    console.log("Trạm được chọn:", station.stationName)
  }

  const handleViewDetails = () => {
    if (selectedStation) {
      console.log("Gửi tên trạm lên cha:", selectedStation.stationName)
      onSelectStation?.(selectedStation.stationName)
    } else {
      console.warn("Chưa chọn trạm nào!")
    }
  }

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-secondary" />
          Địa điểm thuê xe
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 flex flex-col flex-1">
        {loading && <p className="text-center mt-4 text-sm text-muted-foreground">Đang tải dữ liệu...</p>}
        {error && <p className="text-center mt-4 text-sm text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-[url('/city-map-with-electric-charging-stations.jpg')] bg-cover bg-center opacity-20"></div>
            <div className="relative z-10 p-4 space-y-3 max-h-[320px] overflow-y-auto rounded-lg">
              {stations.map((station, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedStation?.stationName === station.stationName
                      ? "bg-secondary/10 border-secondary shadow-md"
                      : "bg-card border-border hover:bg-muted/50"
                  }`}
                  onClick={() => handleSelect(station)}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium text-sm">{station.stationName}</h3>
                      <p className="text-xs text-muted-foreground">{station.address}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      <Car className="h-3 w-3 mr-1" />
                      {station.openingHours}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedStation && (
          <div className="p-4 border-t bg-muted/30">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{selectedStation.stationName}</h4>
                <p className="text-sm text-muted-foreground">{selectedStation.address}</p>
                <p className="text-xs text-muted-foreground">
                  Giờ mở cửa: {selectedStation.openingHours}
                </p>
              </div>
              <Button
                size="sm"
                onClick={handleViewDetails} // ✅ gọi hàm mới
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
