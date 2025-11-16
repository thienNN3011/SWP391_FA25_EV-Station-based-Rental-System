"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
  const [stations, setStations] = useState<{ stationName: string; address: string; stationId: number }[]>([])
  const [selectedStation, setSelectedStation] = useState<string | null>(null)
  const [selectedStationId, setSelectedStationId] = useState<number | null>(null)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedColorByModel, setSelectedColorByModel] = useState<{ [modelId: number]: string }>({})


  const [showCreateVehicle, setShowCreateVehicle] = useState(false)
  const [newVehicle, setNewVehicle] = useState({
    color: "",
    plateNumber: "",
    modelId: "",
    stationId: ""
  })


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


  const createVehicleModel = async () => {
    try {
      const payload = {
        name: "VinFast F8",
        brand: "VinFast",
        batteryCapacity: 87700,
        range: 471,
        seat: 5,
        description: "SUV điện",
        images: [
          { imageUrl: "https://subspace.com/vf8-red.png", color: "RED" },
          { imageUrl: "https://subspace.com/vf8-blue.png", color: "BLUE" }
        ]
      }

      const res = await api.post("/vehiclemodel/create", payload)
      if (!res.data.success) throw new Error(res.data.message)

      alert("Tạo model thành công!")
      if (selectedStation) loadVehicles(selectedStation)
    } catch (err: any) {
      alert(err.message)
    }
  }


  const createVehicle = async () => {
    if (!newVehicle.color || !newVehicle.modelId || !newVehicle.plateNumber || !newVehicle.stationId) {
      alert("Vui lòng nhập đầy đủ thông tin!")
      return
    }

    try {
      const payload = {
        color: newVehicle.color,               
        modelId: Number(newVehicle.modelId),
        plateNumber: newVehicle.plateNumber.trim(),
        stationId: Number(newVehicle.stationId)
      }

      console.log("📌 Payload gửi BE:", payload)

      const res = await api.post("/vehicles/create", payload)
      if (!res.data.success) throw new Error(res.data.message)

      alert("Tạo xe thành công!")
      setShowCreateVehicle(false)

      if (selectedStation) loadVehicles(selectedStation)

    } catch (err: any) {
      console.error("❌ Lỗi:", err)
      alert(err.message)
    }
  }


  const handleColorSelect = (modelId: number, color: string) => {
    setSelectedColorByModel(prev => ({ ...prev, [modelId]: color }))
  }


  const filtered = vehicles.filter(
    v =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.brand.toLowerCase().includes(search.toLowerCase())
  )


  return (
    <div className="h-full w-full overflow-auto p-4 md:p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Quản lý xe</h1>

        <div className="flex items-center gap-2">

          <Button size="sm" onClick={createVehicleModel}>
            + Tạo Model Xe
          </Button>

          <Button size="sm" variant="secondary" onClick={() => setShowCreateVehicle(true)}>
            + Tạo Xe
          </Button>

          <select
            value={selectedStation ?? ""}
            onChange={e => {
              const stationName = e.target.value
              setSelectedStation(stationName)

              const st = stations.find(s => s.stationName === stationName)
              setSelectedStationId(st?.stationId ?? null)

              if (stationName) loadVehicles(stationName)
            }}
            className="border rounded p-2"
          >
            <option value="">Chọn trạm</option>
            {stations.map(s => (
              <option key={s.stationId} value={s.stationName}>
                {s.stationName}
              </option>
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

  
      {showCreateVehicle && (
        <div className="p-4 border rounded bg-gray-100 space-y-3">
          <h2 className="text-lg font-semibold">Tạo Xe Mới</h2>

          <Input
            placeholder="Màu xe (VD: Red)"
            value={newVehicle.color}
            onChange={e => setNewVehicle({ ...newVehicle, color: e.target.value })}
          />

          <Input
            placeholder="Biển số"
            value={newVehicle.plateNumber}
            onChange={e => setNewVehicle({ ...newVehicle, plateNumber: e.target.value })}
          />

          <Input
            placeholder="Model ID"
            value={newVehicle.modelId}
            onChange={e => setNewVehicle({ ...newVehicle, modelId: e.target.value })}
          />

          <Input
            placeholder="Station ID"
            value={newVehicle.stationId}
            onChange={e => setNewVehicle({ ...newVehicle, stationId: e.target.value })}
          />

          <div className="flex gap-2">
            <Button onClick={createVehicle}>Tạo</Button>
            <Button variant="secondary" onClick={() => setShowCreateVehicle(false)}>
              Hủy
            </Button>
          </div>
        </div>
      )}

     
      {loading && <p>🔄 Đang tải dữ liệu...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
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
                  const selectedColor = selectedColorByModel[v.modelId] || v.colors[0]
                  const img =
                    v.imageUrls.find(i => i.color === selectedColor)?.imageUrl ||
                    v.imageUrls[0]?.imageUrl

                  return (
                    <TableRow key={v.modelId}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <ImageWithFallback
                            src={img}
                            alt={v.name}
                            className="w-16 h-10 object-cover rounded"
                          />
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
