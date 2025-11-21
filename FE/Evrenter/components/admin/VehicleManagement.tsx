"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ImageWithFallback } from "@/components/figma/ImageWithFallback"
import { api } from "@/lib/api"
import { supabase } from "@/lib/supabaseClient"

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
  const [showCreateModel, setShowCreateModel] = useState(false)
  const [newModel, setNewModel] = useState({
  name: "",
  brand: "",
  batteryCapacity: "",
  range: "",
  seat: "",
  description: "",
  images: [] as { file: File; color: string }[]
})
const uploadImageToSupabase = async (file: File) => {
  const fileName = `vehicles/${Date.now()}_${file.name}` 

  const { data, error } = await supabase.storage
    .from("uploads")          
    .upload(fileName, file)   

  if (error) throw error

  const { data: url } = supabase.storage
    .from("uploads")
    .getPublicUrl(fileName)

  return url.publicUrl
}




  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await api.get("/station/showall")
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
    if (!newModel.name || !newModel.brand) {
      alert("Vui lòng nhập tên & hãng xe!")
      return
    }

   
    const uploadedImages = []

    for (const img of newModel.images) {
      const url = await uploadImageToSupabase(img.file)

      uploadedImages.push({
        imageUrl: url,
        color: img.color.toUpperCase()
      })
    }

    
    const payload = {
      name: newModel.name,
      brand: newModel.brand,
      batteryCapacity: Number(newModel.batteryCapacity),
      range: Number(newModel.range),
      seat: Number(newModel.seat),
      description: newModel.description,
      images: uploadedImages
    }

    const res = await api.post("/vehiclemodel/create", payload)

    if (!res.data.success) throw new Error(res.data.message)

    alert(`Tạo model xe thành công!\nModel ID: ${res.data.data.modelId}`)

    setShowCreateModel(false)

    if (selectedStation) loadVehicles(selectedStation)

  } catch (err: any) {
    console.error(err)
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

          <Button size="sm" onClick={() => setShowCreateModel(true)}>
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
  {showCreateModel && (
  <div className="p-4 border rounded bg-gray-100 space-y-3">
    <h2 className="text-lg font-semibold">Tạo Model Xe</h2>

    <Input placeholder="Tên model" value={newModel.name}
      onChange={e => setNewModel({ ...newModel, name: e.target.value })}
    />

    <Input placeholder="Hãng xe" value={newModel.brand}
      onChange={e => setNewModel({ ...newModel, brand: e.target.value })}
    />

    <Input placeholder="Dung lượng pin (mAh)" value={newModel.batteryCapacity}
      onChange={e => setNewModel({ ...newModel, batteryCapacity: e.target.value })}
    />

    <Input placeholder="Tầm hoạt động (km)" value={newModel.range}
      onChange={e => setNewModel({ ...newModel, range: e.target.value })}
    />

    <Input placeholder="Số ghế" value={newModel.seat}
      onChange={e => setNewModel({ ...newModel, seat: e.target.value })}
    />

    <Input placeholder="Mô tả" value={newModel.description}
      onChange={e => setNewModel({ ...newModel, description: e.target.value })}
    />

    {/* Upload ảnh */}
    <div className="space-y-2">
      <p className="font-medium">Ảnh + màu sắc</p>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (!file) return

          const color = prompt("Nhập màu ảnh (VD: RED, BLUE, WHITE):") || "UNKNOWN"

          setNewModel({
            ...newModel,
            images: [...newModel.images, { file, color }]
          })
        }}
      />

      {/* Hiển thị preview */}
      <div className="flex gap-2">
        {newModel.images.map((img, idx) => (
          <div key={idx} className="text-sm">
            <span className="block w-20 truncate">{img.file.name}</span>
            <span className="text-gray-500">{img.color}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="flex gap-2">
      <Button onClick={createVehicleModel}>Tạo Model</Button>
      <Button variant="secondary" onClick={() => setShowCreateModel(false)}>
        Hủy
      </Button>
    </div>
  </div>
)}
  
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
