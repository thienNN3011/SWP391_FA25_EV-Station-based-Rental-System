
"use client"

import { useEffect, useState } from "react"
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2, MapPin, Phone, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import {
  getAllStations,
  createStation,
  updateStation,
  deleteStation,
  getActiveStations,
  getVehicleModelsByStation,
  getVehicleModelDetail,
  StationResponse,
  StationCreatePayload,
  StationUpdatePayload,
  VehicleModelResponse,
  VehicleModelDetailResponse,
} from "@/lib/adminApi"
import { api } from "@/lib/api"

export function LocationManagement() {
  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [stations, setStations] = useState<StationResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // edit/create
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<Partial<StationCreatePayload & { status?: string }>>({
    stationName: "",
    address: "",
    openingHours: "07:00-21:00",
    status: "ACTIVE",
  })

  // vehicle models in station
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false)
  const [selectedStation, setSelectedStation] = useState<StationResponse | null>(null)
  const [vehicleModels, setVehicleModels] = useState<VehicleModelResponse[]>([])
  const [loadingVehicles, setLoadingVehicles] = useState(false)
  
  // vehicle model detail
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [vehicleDetail, setVehicleDetail] = useState<VehicleModelDetailResponse | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  useEffect(() => {
    loadStations()
  }, [])

  async function loadStations() {
    setLoading(true)
    setError(null)
    try {
      const data = await getActiveStations()
      setStations(data)
    } catch (e) {
      console.error("Load stations error:", e)
      setError("Không thể tải trạm từ API: " + (e as any)?.response?.data?.message || (e as Error).message)
      setStations([])
    } finally {
      setLoading(false)
    }
  }

  function openCreateDialog() {
    setEditingId(null)
    setForm({ stationName: "", address: "", openingHours: "07:00-21:00", status: "ACTIVE" })
    setIsDialogOpen(true)
  }

  function openEditDialog(s: StationResponse) {
    setEditingId(s.stationId)
    setForm({ stationName: s.stationName, address: s.address, openingHours: s.openingHours, status: s.status })
    setIsDialogOpen(true)
  }

async function handleSave() {
  if (!form.stationName || !form.address || !form.openingHours) {
    alert("Vui lòng nhập tên, địa chỉ và giờ hoạt động.")
    return
  }

  try {
    if (editingId) {
      // Edit trạm
      const payload: StationUpdatePayload = {
        stationName: form.stationName!,
        address: form.address!,
        openingHours: form.openingHours!,
        status: (form.status as "ACTIVE" | "INACTIVE") ?? undefined,
      }
      const updated = await updateStation(editingId, payload)
      setStations((prev) => prev.map((p) => (p.stationId === editingId ? updated : p)))
      alert("Cập nhật trạm thành công: " + updated.stationName)
    } else {
      // Tạo mới trạm bằng axios
      const payload = {
        stationName: form.stationName!,
        address: form.address!,
        openingHours: form.openingHours!,
      }
      const { data } = await api.post("/station/create", payload)
      if (!data.success) throw new Error(data.message || "Tạo trạm thất bại")
      
      setStations((prev) => [data.data, ...prev])
      alert("Tạo trạm thành công: " + data.data.stationName)
    }

    setIsDialogOpen(false)
  } catch (e) {
    alert("Lỗi khi lưu trạm: " + (e as Error).message)
  }
}



  async function handleDelete(id: number) {
    if (!confirm("Xác nhận xóa trạm này?")) return
    try {
      await deleteStation(id)
      setStations((prev) => prev.filter((s) => s.stationId !== id))
    } catch (e) {
      alert("Xóa thất bại: " + (e as Error).message)
    }
  }

  async function handleViewStation(station: StationResponse) {
    setSelectedStation(station)
    setIsVehicleDialogOpen(true)
    setLoadingVehicles(true)
    try {
      const models = await getVehicleModelsByStation(station.stationName)
      setVehicleModels(models)
    } catch (e) {
      alert("Không thể tải danh sách xe: " + (e as Error).message)
      setVehicleModels([])
    } finally {
      setLoadingVehicles(false)
    }
  }

  async function handleViewModelDetail(model: VehicleModelResponse) {
    if (!selectedStation) return
    setIsDetailDialogOpen(true)
    setLoadingDetail(true)
    try {
      const detail = await getVehicleModelDetail(model.modelId, selectedStation.stationName)
      setVehicleDetail(detail)
    } catch (e) {
      alert("Không thể tải chi tiết xe: " + (e as Error).message)
      setVehicleDetail(null)
    } finally {
      setLoadingDetail(false)
    }
  }

  const filtered = stations.filter((l) =>
    (l.stationName ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (l.address ?? "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="h-full w-full overflow-auto">
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl">Quản lý điểm thuê</h1>
            <p className="text-muted-foreground">Danh sách chi nhánh và thông tin chi tiết</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
              <Input placeholder="Tìm theo tên/địa chỉ" className="pl-8 w-64" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Button onClick={openCreateDialog}>
              <Plus className="size-4 mr-2" /> Thêm điểm thuê
            </Button>
            <Button variant="outline" onClick={loadStations}>Tải lại</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách điểm thuê</CardTitle>
            <CardDescription>Các chi nhánh hiện có</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? <div>Đang tải...</div> : null}
            {error ? <div className="text-sm text-red-600 mb-2">{error}</div> : null}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead>Tên chi nhánh</TableHead>
                  <TableHead>Địa chỉ</TableHead>
                  <TableHead>Giờ hoạt động</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((loc, idx) => (
                  <TableRow key={loc.stationId ?? loc.stationName}>
                    <TableCell className="font-medium">{loc.stationId ?? idx + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-primary" />
                        {loc.stationName}
                      </div>
                    </TableCell>
                    <TableCell>{loc.address}</TableCell>
                    <TableCell>{loc.openingHours}</TableCell>
                    <TableCell>{loc.status ?? 'ACTIVE'}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleViewStation(loc)}>
                            <Eye className="size-4" /> Xem xe trong trạm
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2" onClick={() => openEditDialog(loc)}>
                            <Edit className="size-4" /> Sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2 text-red-600" onClick={() => handleDelete(loc.stationId ?? idx + 1)}>
                            <Trash2 className="size-4" /> Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Dialog thêm/sửa trạm */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Sửa điểm thuê" : "Thêm điểm thuê"}</DialogTitle>
              <DialogDescription>Nhập thông tin để {editingId ? "cập nhật" : "tạo"} điểm thuê</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Tên chi nhánh</Label>
                <Input id="name" placeholder="Ví dụ: Chi nhánh Quận 1" value={form.stationName ?? ""} onChange={(e) => setForm((s) => ({ ...s, stationName: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="status">Trạng thái</Label>
                <Select value={form.status} onValueChange={(v) => setForm((s) => ({ ...s, status: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                    <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Textarea id="address" placeholder="Số nhà, đường, phường, quận, thành phố" value={form.address ?? ""} onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="openingHours">Giờ hoạt động</Label>
                <Input id="openingHours" placeholder="07:00-21:00" value={form.openingHours ?? ""} onChange={(e) => setForm((s) => ({ ...s, openingHours: e.target.value }))} />
              </div>
              <div />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleSave}>Lưu</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog xe trong trạm */}
        <Dialog open={isVehicleDialogOpen} onOpenChange={setIsVehicleDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Các loại xe tại {selectedStation?.stationName}</DialogTitle>
              <DialogDescription>Danh sách các mẫu xe có sẵn tại trạm này</DialogDescription>
            </DialogHeader>
            <div className="max-h-[500px] overflow-y-auto">
              {loadingVehicles ? (
                <div className="text-center py-4">Đang tải...</div>
              ) : vehicleModels.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">Không có xe nào tại trạm này</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã mẫu</TableHead>
                      <TableHead>Tên xe</TableHead>
                      <TableHead>Hãng</TableHead>
                      <TableHead>Giá/giờ</TableHead>
                      <TableHead>Giá/ngày</TableHead>
                      <TableHead>Số xe khả dụng</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehicleModels.map((model) => (
                      <TableRow key={model.modelId}>
                        <TableCell className="font-medium">{model.modelId}</TableCell>
                        <TableCell>{model.modelName}</TableCell>
                        <TableCell>{model.brand}</TableCell>
                        <TableCell>{model.pricePerHour?.toLocaleString() ?? 'N/A'} VNĐ</TableCell>
                        <TableCell>{model.pricePerDay?.toLocaleString() ?? 'N/A'} VNĐ</TableCell>
                        <TableCell>{model.availableCount ?? 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleViewModelDetail(model)}>
                            <Eye className="size-4 mr-1" /> Chi tiết
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={() => setIsVehicleDialogOpen(false)}>
                Đóng
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog chi tiết xe */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Chi tiết mẫu xe</DialogTitle>
              <DialogDescription>Thông tin chi tiết về mẫu xe và các xe khả dụng</DialogDescription>
            </DialogHeader>
            <div className="max-h-[600px] overflow-y-auto space-y-4">
              {loadingDetail ? (
                <div className="text-center py-4">Đang tải...</div>
              ) : vehicleDetail ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>{vehicleDetail.modelName}</CardTitle>
                      <CardDescription>Hãng: {vehicleDetail.brand}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {vehicleDetail.description && (
                        <div>
                          <Label className="text-sm font-semibold">Mô tả:</Label>
                          <p className="text-sm text-muted-foreground">{vehicleDetail.description}</p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-semibold">Giá thuê/giờ:</Label>
                          <p className="text-sm">{vehicleDetail.pricePerHour?.toLocaleString() ?? 'N/A'} VNĐ</p>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold">Giá thuê/ngày:</Label>
                          <p className="text-sm">{vehicleDetail.pricePerDay?.toLocaleString() ?? 'N/A'} VNĐ</p>
                        </div>
                      </div>
                      {vehicleDetail.specifications && (
                        <div>
                          <Label className="text-sm font-semibold">Thông số kỹ thuật:</Label>
                          <p className="text-sm text-muted-foreground">{vehicleDetail.specifications}</p>
                        </div>
                      )}
                      {vehicleDetail.features && vehicleDetail.features.length > 0 && (
                        <div>
                          <Label className="text-sm font-semibold">Tính năng:</Label>
                          <ul className="list-disc list-inside text-sm text-muted-foreground">
                            {vehicleDetail.features.map((f, i) => (
                              <li key={i}>{f}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {vehicleDetail.availableVehicles && vehicleDetail.availableVehicles.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Các xe khả dụng ({vehicleDetail.availableVehicles.length})</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Mã xe</TableHead>
                              <TableHead>Biển số</TableHead>
                              <TableHead>Màu</TableHead>
                              <TableHead>Trạng thái</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {vehicleDetail.availableVehicles.map((v) => (
                              <TableRow key={v.vehicleId}>
                                <TableCell className="font-medium">{v.vehicleId}</TableCell>
                                <TableCell>{v.plateNumber}</TableCell>
                                <TableCell>{v.color}</TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    v.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {v.status}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <div className="text-center py-4 text-muted-foreground">Không có dữ liệu</div>
              )}
            </div>
            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                Đóng
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
