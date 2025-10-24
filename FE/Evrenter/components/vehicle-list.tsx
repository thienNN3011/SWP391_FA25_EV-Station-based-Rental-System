"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Car } from "lucide-react"
import { useRouter } from "next/navigation"

interface VehicleModel {
  modelId: number
  stationName: string
  name: string
  brand: string
  batteryCapacity: number
  range: number
  seat: number
  description: string
  imageUrl: { imageUrl: string; color: string }[]
  tariffs: { tarriffId: number; type: string; price: number; depositAmount: number }[]
}

interface VehicleListProps {
  stationName: string | null
  onSelectVehicle?: (vehicle: VehicleModel) => void
}

export function VehicleList({ stationName, onSelectVehicle  }: VehicleListProps) {
  const [vehicles, setVehicles] = useState<VehicleModel[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!stationName) return

    const fetchVehicles = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("http://localhost:8080/EVRental/vehiclemodel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stationName }),
        })

        if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
        const result = await response.json()
        console.log("👉 Data BE trả về:", result)

        if (result.success && result.data) {
          setVehicles(result.data)
        } else {
          setError("Không có xe nào tại trạm này.")
        }
      } catch (err) {
        setError("Lỗi khi tải danh sách xe.")
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [stationName])


  const handleSelect = (vehicle: VehicleModel) => {
    localStorage.setItem("selectedVehicle", JSON.stringify(vehicle))
    if (onSelectVehicle) onSelectVehicle(vehicle)
  }


  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5 text-secondary" />
          Danh sách mẫu xe
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto">
        {!stationName && <p className="text-sm text-muted-foreground">Vui lòng chọn một trạm.</p>}
        {loading && <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {!loading && !error && vehicles.length > 0 && (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicles.map((v, i) => (
              <li
                key={i}
                className="border rounded-lg p-3 hover:bg-muted/50 transition-all shadow-sm"
              >
                <img
                  src={`http://localhost:8080/EVRental/${v.imageUrl?.[0]?.imageUrl.split("\\").pop()}`}
                  alt={v.name}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />

                <p className="font-medium text-base">{v.name}</p>
                <p className="text-xs text-muted-foreground">{v.brand}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Pin: {v.batteryCapacity} kWh | Quãng đường: {v.range} km
                </p>
                <p className="text-xs text-muted-foreground">
                  Số ghế: {v.seat} | {v.description}
                </p>

                <div className="mt-2 border-t pt-2">
                  {v.tariffs.map((t) => {
                    const typeVi =
                      t.type === "HOURLY"
                        ? "Theo giờ"
                        : t.type === "DAILY"
                        ? "Theo ngày"
                        : t.type === "MONTHLY"
                        ? "Theo tháng"
                        : t.type
                    return (
                      <p key={t.tarriffId} className="text-xs">
                        {typeVi}: {t.price.toLocaleString()} VND
                      </p>
                    )
                  })}
                </div>

               
                <Button
                  className="w-full mt-3 bg-sky-500 hover:bg-sky-800 text-white"
                  onClick={() => handleSelect(v)}
                >
                  Đặt xe
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
