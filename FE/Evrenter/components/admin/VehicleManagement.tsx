"use client"

import { useState } from "react"
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageWithFallback } from "@/components/figma/ImageWithFallback"

const vehicleData = [
  { id: "VH001", licensePlate: "30A-12345", brand: "VinFast", model: "VF e34", year: 2024, type: "SUV điện cỡ nhỏ", color: "Xanh đại dương", status: "available", location: "Chi nhánh Quận 1", pricePerDay: "800.000", mileage: "15.000", fuelType: "Điện", transmission: "Tự động", seats: 5, image: "/placeholder.jpg" },
  { id: "VH002", licensePlate: "30B-67890", brand: "VinFast", model: "VF 8", year: 2024, type: "SUV điện", color: "Trắng Alpina", status: "rented", location: "Chi nhánh Quận 3", pricePerDay: "1.200.000", mileage: "8.500", fuelType: "Điện", transmission: "Tự động", seats: 7, image: "/placeholder.jpg" },
  { id: "VH003", licensePlate: "30C-11111", brand: "VinFast", model: "VF 9", year: 2024, type: "SUV điện cao cấp", color: "Đỏ Ruby", status: "maintenance", location: "Chi nhánh Quận 7", pricePerDay: "1.500.000", mileage: "12.000", fuelType: "Điện", transmission: "Tự động", seats: 7, image: "/placeholder.jpg" },
  { id: "VH004", licensePlate: "30D-22222", brand: "VinFast", model: "VF 5", year: 2024, type: "SUV điện cỡ A", color: "Xám Titan", status: "available", location: "Chi nhánh Quận 5", pricePerDay: "700.000", mileage: "5.000", fuelType: "Điện", transmission: "Tự động", seats: 5, image: "/placeholder.jpg" },
  { id: "VH005", licensePlate: "30E-33333", brand: "VinFast", model: "VF 6", year: 2024, type: "Crossover điện", color: "Xanh ngọc", status: "available", location: "Chi nhánh Quận 2", pricePerDay: "950.000", mileage: "3.200", fuelType: "Điện", transmission: "Tự động", seats: 5, image: "/placeholder.jpg" },
]

export function VehicleManagement() {
  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filtered = vehicleData.filter((v) => v.brand.toLowerCase().includes(search.toLowerCase()) || v.model.toLowerCase().includes(search.toLowerCase()) || v.licensePlate.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="h-full w-full overflow-auto">
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl">Quản lý xe</h1>
            <p className="text-muted-foreground">Danh sách và cấu hình phương tiện</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
              <Input placeholder="Tìm theo biển số/loại" className="pl-8 w-64" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="size-4 mr-2" /> Thêm xe
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách xe</CardTitle>
            <CardDescription>Thông tin chi tiết các xe trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead>Biển số</TableHead>
                  <TableHead>Hãng/Model</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Vị trí</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">{v.id}</TableCell>
                    <TableCell>{v.licensePlate}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <ImageWithFallback src={v.image} alt={v.model} className="w-16 h-10 object-cover rounded" />
                        <div>
                          <div className="font-medium">{v.brand}</div>
                          <div className="text-sm text-muted-foreground">{v.model}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={v.status === "available" ? "default" : v.status === "rented" ? "secondary" : "destructive"}>
                        {v.status === "available" ? "Sẵn sàng" : v.status === "rented" ? "Đang thuê" : "Bảo dưỡng"}
                      </Badge>
                    </TableCell>
                    <TableCell>{v.location}</TableCell>
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
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm phương tiện</DialogTitle>
              <DialogDescription>Nhập thông tin phương tiện mới</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plate">Biển số</Label>
                <Input id="plate" placeholder="30A-12345" />
              </div>
              <div>
                <Label htmlFor="brand">Hãng</Label>
                <Input id="brand" placeholder="VinFast" />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input id="model" placeholder="VF e34" />
              </div>
              <div>
                <Label>Trạng thái</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Sẵn sàng</SelectItem>
                    <SelectItem value="rented">Đang thuê</SelectItem>
                    <SelectItem value="maintenance">Bảo dưỡng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
              <Button>
                <Settings className="size-4 mr-2" /> Lưu
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

