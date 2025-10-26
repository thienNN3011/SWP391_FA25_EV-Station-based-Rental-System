"use client"
import { useEffect, useMemo, useState } from "react"
import { Search, MoreHorizontal, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ImageWithFallback } from "@/components/figma/ImageWithFallback"
import { getAllVehicles, VehicleResponse, createVehicle, updateVehicle, deleteVehicle } from "@/lib/adminApi"

export function VehicleManagement() {
  const [search, setSearch] = useState("")
  const [rows, setRows] = useState<VehicleResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ modelId: '', stationId: '', color: '', plateNumber: '' })

  const loadVehicles = async () => {
    setLoading(true)
    try {
      const data = await getAllVehicles()
      setRows(data)
    } catch (e: any) {
      setError(e?.message ?? 'Lỗi tải danh sách xe')
    } finally {
      setLoading(false)
    }
 }

 useEffect(() => { loadVehicles() }, [])

  const filtered = useMemo(() => rows.filter(v =>
    v.brand.toLowerCase().includes(search.toLowerCase()) ||
    v.modelName.toLowerCase().includes(search.toLowerCase()) ||
    v.plateNumber.toLowerCase().includes(search.toLowerCase())
  ), [rows, search])

  const toUiStatus = (s: string) => {
    switch (s) {
      case 'AVAILABLE': return { label: 'Sẵn sàng', variant: 'default' as const }
      case 'BOOKED':
      case 'IN_USE': return { label: 'Đang thuê', variant: 'secondary' as const }
      case 'MAINTENANCE':
      case 'INACTIVE': return { label: 'Bảo dưỡng', variant: 'destructive' as const }
      default: return { label: s, variant: 'secondary' as const }
    }
  }
  const handleCreate = async () => {
    const modelId = parseInt(String(form.modelId), 10)
    const stationId = parseInt(String(form.stationId), 10)
    const color = (form.color ?? '').trim()
    const plateNumber = (form.plateNumber ?? '').trim()

    if (isNaN(modelId) || modelId <= 0) return alert('ModelId sai hoặc bỏ trống')
    if (isNaN(stationId) || stationId <= 0) return alert('StationId sai hoặc bỏ trống')
    if (!plateNumber) return alert('Biển số không được để trống')

    setSubmitting(true)
    try {
      await createVehicle({ modelId, stationId, color, plateNumber })
      await loadVehicles()
      setShowCreateForm(false)
      setForm({ modelId: '', stationId: '', color: '', plateNumber: '' })
    } catch (e: any) {
      alert(e?.message ?? 'Tạo xe thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-6">Đang tải...</div>
  if (error) return <div className="p-6 text-red-500">{error}</div>

  return (
    <div className="h-full w-full overflow-auto">
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl">Quản lý xe</h1>

          </div>
          <div className="flex items-center gap-3">
              <button
              className="btn btn-primary px-4 py-2 border-2 border-blue-500 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 hover:border-blue-600 transition"
              onClick={() => setShowCreateForm(s => !s)}
            >
              {showCreateForm ? 'Đóng' : 'Thêm xe'}
            </button>

            <div className="relative">
              <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
              <Input placeholder="Tìm theo biển số/loại" className="pl-8 w-64" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
        </div>

        {showCreateForm && (
          <Card>
            <CardHeader>
              <CardTitle>Thêm xe mới</CardTitle>
              <CardDescription>Điền thông tin cơ bản của xe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">ModelId</label>
                  <Input type="number" value={form.modelId} onChange={(e) => setForm(f => ({ ...f, modelId: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">StationId</label>
                  <Input type="number" value={form.stationId} onChange={(e) => setForm(f => ({ ...f, stationId: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Màu</label>
                  <Input value={form.color} onChange={(e) => setForm(f => ({ ...f, color: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Biển số</label>
                  <Input value={form.plateNumber} onChange={(e) => setForm(f => ({ ...f, plateNumber: e.target.value }))} />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <button className="btn btn-primary px-4 py-2 border-2 border-blue-500 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 hover:border-blue-600 transition" onClick={handleCreate} disabled={submitting}>
                  {submitting ? 'Đang lưu...' : 'Lưu'}
                </button>
                <button className="btn px-4 py-2 border-2 border-blue-500 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 hover:border-blue-600 transition" onClick={() => { setShowCreateForm(false); setForm({ modelId: '', stationId: '', color: '', plateNumber: '' }) }} disabled={submitting}>
                  Hủy
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Danh sách xe</CardTitle>
            <CardDescription>Thông tin chi tiết xe</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Biển số</TableHead>
                  <TableHead>Hãng/Model</TableHead>
                  <TableHead>Màu</TableHead>
                  <TableHead>Trạm</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((v) => {
                  const st = toUiStatus(v.status)
                  return (
                    <TableRow key={v.vehicleId}>
                      <TableCell className="font-medium">{v.plateNumber}</TableCell>
                          <TableCell>
  <div className="flex items-center gap-3">
    <img
      src={
        v.imageUrl?.[0]?.imageUrl
          ? `http://localhost:8080/EVRental/${v.imageUrl[0].imageUrl.split("\\").pop()}`
          : "/placeholder.jpg"
      }
      alt={v.modelName || v.brand}
      className="w-16 h-10 object-cover rounded"
    />
    <div>
      <div className="font-medium">{v.brand}</div>
      <div className="text-sm text-muted-foreground">{v.modelName}</div>
    </div>
  </div>
</TableCell>

                      <TableCell>{v.color}</TableCell>
                      <TableCell>{v.stationName}</TableCell>
                      <TableCell><Badge variant={st.variant}>{st.label}</Badge></TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
                        <button
                          className="btn btn-secondary"
                          onClick={async () => {
                            // edit via prompts (prefill with current values)
                            const modelId = Number(prompt('ModelId (số):', String(v.modelId)) ?? '')
                            if (!modelId) return
                            const stationId = Number(prompt('StationId (số):', String(v.stationId)) ?? '')
                            if (!stationId) return
                            const color = prompt('Màu:', v.color) ?? ''
                            const plateNumber = prompt('Biển số:', v.plateNumber) ?? ''
                            const status = prompt('Trạng thái (AVAILABLE|BOOKED|IN_USE|MAINTENANCE|INACTIVE):', v.status) ?? v.status
                            try {
                              await updateVehicle(v.vehicleId, { modelId, stationId, color, plateNumber, status: status as any })
                              await loadVehicles()
                            } catch (e:any) {
                              alert(e?.message ?? 'Cập nhật thất bại')
                            }
                          }}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn-destructive"
                          onClick={async () => {
                            if (!confirm('Xác nhận xóa xe này?')) return
                            try {
                              await deleteVehicle(v.vehicleId)
                              setRows(prev => prev.filter(r => r.vehicleId !== v.vehicleId))
                            } catch (e:any) {
                              alert(e?.message ?? 'Xóa thất bại')
                            }
                          }}
                        >
                          Xóa
                        </button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}