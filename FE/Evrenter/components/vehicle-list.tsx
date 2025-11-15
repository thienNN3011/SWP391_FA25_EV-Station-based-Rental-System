"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Car } from "lucide-react"
import { useRouter } from "next/navigation"

interface ImageInfo {
  imageUrl: string
  color: string
}

interface Tariff {
  tarriffId: number
  type: string
  price: number
  depositAmount: number
}

interface VehicleModel {
  vehicleId: number
  modelId: number
  name: string
  stationName: string
  plateNumber: string
  color?: string
  brand: string
  batteryCapacity: number
  range: number
  seat: number
  description: string
  imageUrls: ImageInfo[]
  tariffs: Tariff[]
  colors?: string[]
}

interface VehicleListProps {
  stationName: string | null
  onSelectVehicle?: (vehicle: VehicleModel) => void
}

export function VehicleList({ stationName, onSelectVehicle }: VehicleListProps) {
  const [vehicles, setVehicles] = useState<VehicleModel[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedVehicleByModel, setSelectedVehicleByModel] = useState<Record<number, VehicleModel>>({})
  const [bodyPreview, setBodyPreview] = useState<object | null>(null)
  const router = useRouter()


  useEffect(() => {
    if (!stationName) return

    const fetchVehicles = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("http://localhost:8080/EVRental/vehiclemodel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stationName }),
        })
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
        const result = await res.json()
        console.log("Data BE trả về:", result)

        if (result.success && result.data) {
          setVehicles(result.data)
        } else {
          setError("Không có xe nào tại trạm này.")
        }
      } catch (err) {
        console.error(err)
        setError("Lỗi khi tải danh sách xe.")
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [stationName])

 
  const handleColorSelect = (model: VehicleModel, color: string) => {
    const matchedImages = model.imageUrls.filter(
      img => img.color.toLowerCase() === color.toLowerCase()
    )

    const updatedVehicle: VehicleModel = {
      ...model,
      color,
      imageUrls: matchedImages.length > 0 ? matchedImages : model.imageUrls,
    }

    setSelectedVehicleByModel(prev => ({
      ...prev,
      [model.modelId]: updatedVehicle,
    }))
  }

 
  const handleSelect = (modelId: number) => {
    const vehicle = selectedVehicleByModel[modelId]
    if (!vehicle) {
      alert("Vui lòng chọn màu xe trước khi đặt.")
      return
    }

    const payload = {
      stationName: vehicle.stationName,
      modelId: vehicle.modelId,
      color: vehicle.color,
      tariffId: vehicle.tariffs[0]?.tarriffId,
      startTime: "2025-10-31 20:00:00",
      endTime: "2025-11-10 07:00:00",
    }

    console.log("Body gửi lên backend:", payload)
    setBodyPreview(payload)

    fetch("http://localhost:8080/EVRental/vehicles/select", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(data => console.log("Response từ backend:", data))
      .catch(err => console.error("Lỗi gửi lên backend:", err))

    localStorage.setItem("selectedVehicle", JSON.stringify(vehicle))
    onSelectVehicle?.(vehicle)
  }

  
  const modelsMap: Record<number, VehicleModel[]> = {}
  vehicles.forEach(v => {
    if (!modelsMap[v.modelId]) modelsMap[v.modelId] = []
    modelsMap[v.modelId].push(v)
  })

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
            {Object.values(modelsMap).map((modelVehicles, idx) => {
              const firstVehicle = modelVehicles[0]
              const selectedVehicle = selectedVehicleByModel[firstVehicle.modelId] || firstVehicle
              const imgSrc = selectedVehicle.imageUrls?.[0]?.imageUrl || "/no-image.png"

              return (
                <li key={idx} className="border rounded-lg p-3 hover:bg-muted/50 transition-all shadow-sm">
                  <img
                    src={imgSrc}
                    alt={firstVehicle.name}
                    className="w-full h-40 object-cover rounded-md mb-2"
                  />

                  <p className="font-medium text-base">{firstVehicle.name}</p>
                  <p className="text-xs text-muted-foreground">{firstVehicle.brand}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Pin: {firstVehicle.batteryCapacity} kWh | Quãng đường: {firstVehicle.range} km
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Số ghế: {firstVehicle.seat} | {firstVehicle.description}
                  </p>

                
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {firstVehicle.colors?.map(color => {
                      const isSelected =
                        selectedVehicle.color?.toLowerCase() === color.toLowerCase()
                      return (
                        <button
                          key={color}
                          className={`w-6 h-6 rounded-full border transition-all duration-200
                            ${
                              isSelected
                                ? "border-black scale-125 shadow-lg ring-2 ring-offset-1 ring-sky-500"
                                : "border-gray-300 hover:scale-110"
                            }`}
                          style={{ backgroundColor: color.toLowerCase() }}
                          onClick={() => handleColorSelect(firstVehicle, color)}
                          title={color}
                        />
                      )
                    })}
                  </div>

                 
                  <div className="mt-2 border-t pt-2">
                    {selectedVehicle.tariffs.map(t => {
                      const typeVi =
                        t.type.toUpperCase() === "HOURLY"
                          ? "Theo giờ"
                          : t.type.toUpperCase() === "DAILY"
                          ? "Theo ngày"
                          : t.type.toUpperCase() === "MONTHLY"
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
                    onClick={() => handleSelect(firstVehicle.modelId)}
                  >
                    Đặt xe
                  </Button>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
