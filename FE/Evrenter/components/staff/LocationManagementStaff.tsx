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
import { api } from "@/lib/api"

interface Vehicle {
  modelName: string
  brand: string
  color: string
  status: string
  plateNumber: string
}

interface Station {
  stationName: string
  address: string
  openingHours: string
  vehicles: Vehicle[]
}

export function LocationManagementStaff() {
  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [station, setStation] = useState<Station | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  
  useEffect(() => {
    const fetchStation = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await api.get("/station/me")
        if (res.data.success) {
          setStation(res.data.data)
        } else {
          setError("Không lấy được thông tin trạm.")
        }
      } catch (err) {
        console.error("Lỗi fetch trạm:", err)
        setError("Có lỗi khi kết nối đến server.")
      } finally {
        setLoading(false)
      }
    }
    fetchStation()
  }, [])

  if (loading) return <p className="p-4 text-sm">Đang tải dữ liệu...</p>
  if (error) return <p className="p-4 text-sm text-red-500">{error}</p>
  if (!station) return null

  const filteredVehicles = station.vehicles.filter(
    (v) =>
      v.modelName.toLowerCase().includes(search.toLowerCase()) ||
      v.plateNumber.toLowerCase().includes(search.toLowerCase())
  )

  const [openTime, closeTime] = station.openingHours.split("-")

  return (
    <div className="h-full w-full overflow-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">{station.stationName}</h1>
          <p className="text-muted-foreground">{station.address}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên xe / biển số"
              className="pl-8 w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="size-4 mr-2" /> Thêm xe
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Thông tin trạm</CardTitle>
          <CardDescription>
            <div className="flex items-center gap-2">
              <MapPin className="size-4" /> {station.address}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4" /> {openTime} - {closeTime}
            </div>
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách xe</CardTitle>
          <CardDescription>Các xe hiện có tại trạm</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredVehicles.length === 0 ? (
            <p className="text-sm text-muted-foreground">Chưa có xe nào hoặc không tìm thấy kết quả.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên xe</TableHead>
                  <TableHead>Hãng</TableHead>
                  <TableHead>Màu</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Số biển</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((v) => (
                  <TableRow key={v.plateNumber}>
                    <TableCell>{v.modelName}</TableCell>
                    <TableCell>{v.brand}</TableCell>
                    <TableCell>{v.color}</TableCell>
                    <TableCell>{v.status}</TableCell>
                    <TableCell>{v.plateNumber}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Eye className="size-4" /> Xem
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Edit className="size-4" /> Sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                            <Trash2 className="size-4" /> Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm xe</DialogTitle>
            <DialogDescription>Nhập thông tin để thêm xe mới</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="modelName">Tên xe</Label>
              <Input id="modelName" placeholder="Ví dụ: VinFast VF6" />
            </div>
            <div>
              <Label htmlFor="brand">Hãng</Label>
              <Input id="brand" placeholder="Ví dụ: VinFast" />
            </div>
            <div>
              <Label htmlFor="color">Màu</Label>
              <Input id="color" placeholder="Ví dụ: Đỏ" />
            </div>
            <div>
              <Label htmlFor="plateNumber">Số biển</Label>
              <Input id="plateNumber" placeholder="Ví dụ: SG-AB-1011" />
            </div>
            <div className="md:col-span-2">
              <Label>Trạng thái</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAILABLE">AVAILABLE</SelectItem>
                  <SelectItem value="IN_USE">IN_USE</SelectItem>
                  <SelectItem value="MAINTENANCE">MAINTENANCE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button>Lưu</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
