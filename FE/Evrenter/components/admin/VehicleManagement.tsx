"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ImageWithFallback } from "@/components/figma/ImageWithFallback"
import { api } from "@/lib/api"

interface VehicleModel {
  modelId: number
  stationName: string
  name: string
  brand: string
  batteryCapacity: number
  range: number
  seat: number
  description: string
  imageUrls: { imageUrl: string; color: string }[]
  tariffs: { tariffId: number; type: string; price: number; depositAmount: number }[]
  colors: string[]
}

export function VehicleManagement() {
  const [vehicles, setVehicles] = useState<VehicleModel[]>([])
  const [stations, setStations] = useState<{ stationName: string; address: string }[]>([])
  const [selectedStation, setSelectedStation] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedColorByModel, setSelectedColorByModel] = useState<{ [modelId: number]: string }>({})

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await api.get("/showactivestation")
        if (res.data.success) setStations(res.data.data ?? [])
      } catch (err) {
        console.error(err)
        setError("Không thể tải danh sách trạm")
      }
    }
    fetchStations()
  }, [])

  const loadVehicles = async (stationName: string) => {
    try {
      setLoading(true)
      setError("")
      const res = await api.post("/vehiclemodel", { stationName })
      if (res.data.success) setVehicles(res.data.data ?? [])
      else setError(res.data.message ?? "Lỗi khi tải xe")
    } catch (err: any) {
      console.error(err)
      setError(err.message ?? "Lỗi server")
    } finally {
      setLoading(false)
    }
  }

  const handleColorSelect = (modelId: number, color: string) => {
    setSelectedColorByModel(prev => ({ ...prev, [modelId]: color }))
  }

  const filtered = vehicles.filter(
    v =>
      (v.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (v.brand ?? "").toLowerCase().includes(search.toLowerCase())
  )

  const toUiStatus = (s: string) => {
    switch (s) {
      case "AVAILABLE":
        return { label: "Sẵn sàng", variant: "default" as const }
      case "BOOKED":
      case "IN_USE":
        return { label: "Đang thuê", variant: "secondary" as const }
      case "MAINTENANCE":
      case "INACTIVE":
        return { label: "Bảo dưỡng", variant: "destructive" as const }
      default:
        return { label: s, variant: "secondary" as const }
    }
  }

  return (
    <div className="h-full w-full overflow-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Quản lý xe</h1>

        <div className="flex items-center gap-2">
          <select
            value={selectedStation ?? ""}
            onChange={e => {
              const station = e.target.value
              setSelectedStation(station)
              if (station) loadVehicles(station)
            }}
            className="border rounded p-2"
          >
            <option value="">Chọn trạm</option>
            {stations.map(s => (
              <option key={s.stationName} value={s.stationName}>{s.stationName}</option>
            ))}
          </select>

          <div className="relative">
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo loại/hãng"
              className="pl-8 w-64"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading && <p>🔄 Đang tải dữ liệu...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>Danh sách xe</CardTitle>
          <CardDescription>Thông tin chi tiết xe</CardDescription>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hình/Model</TableHead>
                <TableHead>Màu</TableHead>
                <TableHead>Hãng</TableHead>
                <TableHead>Trạm</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length > 0 ? (
                filtered.map(v => {
                  const selectedColor = selectedColorByModel[v.modelId] || v.colors[0] || "#ccc"
                  const img = v.imageUrls.find(img => img.color === selectedColor)?.imageUrl || v.imageUrls[0]?.imageUrl
                  return (
                    <TableRow key={v.modelId}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <ImageWithFallback src={img || "/placeholder.jpg"} alt={v.name} className="w-16 h-10 object-cover rounded" />
                          <div>{v.name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="flex gap-2">
                        {v.colors.map(c => (
                          <button
                            key={c}
                            className={`w-6 h-6 rounded-full border ${selectedColor === c ? "border-black" : "border-gray-300"}`}
                            style={{ backgroundColor: c.toLowerCase() }}
                            onClick={() => handleColorSelect(v.modelId, c)}
                            title={c}
                          />
                        ))}
                      </TableCell>
                      <TableCell>{v.brand}</TableCell>
                      <TableCell>{v.stationName}</TableCell>
                      <TableCell className="text-right flex gap-2">
                        <Button size="sm">Sửa</Button>
                        <Button size="sm" variant="destructive">Xóa</Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                    Không có dữ liệu xe
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
