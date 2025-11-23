"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Car } from "lucide-react"
import { BookingModal } from "@/components/booking-modal"

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
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleModel | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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

    // Đảm bảo vehicle có đầy đủ tariffs trước khi lưu
    const vehicleWithTariffs = {
      ...vehicle,
      tariffs: vehicle.tariffs || []
    }

    setSelectedVehicle(vehicleWithTariffs)
    setIsModalOpen(true)
    localStorage.setItem("selectedVehicle", JSON.stringify(vehicleWithTariffs))
    onSelectVehicle?.(vehicleWithTariffs)
  }

  const handleCloseModal = () => {
    setSelectedVehicle(null)
    setIsModalOpen(false)
  }

  const modelsMap: Record<number, VehicleModel[]> = {}
  vehicles.forEach(v => {
    if (!modelsMap[v.modelId]) modelsMap[v.modelId] = []
    modelsMap[v.modelId].push(v)
  })

  return (
    <>
      <Card className="flex flex-col shadow-lg border border-gray-200">
        <CardHeader className="bg-sky-100 p-4 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-sky-600 text-xl font-bold">
            <Car className="h-6 w-6 text-sky-500" />
            Danh sách mẫu xe
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4">
          {!stationName && (
            <p className="text-sm text-muted-foreground text-center">
              Vui lòng chọn một trạm để xem danh sách xe.
            </p>
          )}
          {loading && (
            <p className="text-sm text-muted-foreground text-center">
              Đang tải dữ liệu...
            </p>
          )}
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          {!loading && !error && vehicles.length > 0 && (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.values(modelsMap).map((modelVehicles, idx) => {
                const firstVehicle = modelVehicles[0]
                const selectedVehicleInList = selectedVehicleByModel[firstVehicle.modelId] || firstVehicle
                const imgSrc = selectedVehicleInList.imageUrls?.[0]?.imageUrl || "/no-image.png"

                return (
                  <li
                    key={idx}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-all shadow-sm"
                  >
                    <img
                      src={imgSrc}
                      alt={firstVehicle.name}
                      className="w-full h-40 object-cover rounded-md mb-4"
                    />

                    <h3 className="font-semibold text-lg text-gray-800">
                      {firstVehicle.name}
                    </h3>
                    <p className="text-sm text-gray-600">{firstVehicle.brand}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Pin: {firstVehicle.batteryCapacity} kWh | Quãng đường: {firstVehicle.range} km
                    </p>
                    <p className="text-sm text-gray-600">
                      Số ghế: {firstVehicle.seat} | {firstVehicle.description}
                    </p>

                    <div className="flex gap-2 mt-3 flex-wrap">
                      {firstVehicle.colors?.map(color => {
                        const isSelected =
                          selectedVehicleInList.color?.toLowerCase() === color.toLowerCase()
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

                    <div className="mt-3">
                      {firstVehicle.tariffs
                        .filter(t => t.type.toUpperCase() === "DAILY")
                        .map(t => (
                          <Badge
                            key={t.tarriffId}
                            className="text-xs bg-sky-500 text-white mr-2"
                          >
                            Theo ngày: {t.price.toLocaleString()} VND
                          </Badge>
                        ))}
                    </div>

                    <Button
                      className="w-full mt-4 bg-sky-500 hover:bg-sky-600 text-white"
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

      {/* Booking Modal */}
      {selectedVehicle && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          vehicle={selectedVehicle}
        />
      )}
    </>
  )
}