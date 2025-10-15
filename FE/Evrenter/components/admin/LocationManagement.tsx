"use client"

import { useState } from "react"
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

const locationData = [
  { id: "LOC001", name: "Chi nhánh Quận 1", address: "123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM", phone: "028-1234-5678", email: "quan1@rentcar.com", manager: "Nguyễn Văn Minh", vehicleCount: 25, staffCount: 8, openTime: "07:00", closeTime: "22:00", area: "120m²" },
  { id: "LOC002", name: "Chi nhánh Quận 3", address: "456 Võ Văn Tần, Phường 6, Quận 3, TP.HCM", phone: "028-2345-6789", email: "quan3@rentcar.com", manager: "Trần Thị Lan", vehicleCount: 20, staffCount: 6, openTime: "07:00", closeTime: "21:00", area: "100m²" },
  { id: "LOC003", name: "Chi nhánh Quận 7", address: "789 Nguyễn Thị Thập, Phường Tân Phong, Quận 7, TP.HCM", phone: "028-3456-7890", email: "quan7@rentcar.com", manager: "Lê Văn Tuấn", vehicleCount: 30, staffCount: 10, openTime: "08:00", closeTime: "22:00", area: "150m²" },
]

export function LocationManagement() {
  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filtered = locationData.filter((l) => l.name.toLowerCase().includes(search.toLowerCase()) || l.address.toLowerCase().includes(search.toLowerCase()))

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
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="size-4 mr-2" /> Thêm điểm thuê
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách điểm thuê</CardTitle>
            <CardDescription>Các chi nhánh hiện có</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead>Tên chi nhánh</TableHead>
                  <TableHead>Địa chỉ</TableHead>
                  <TableHead>Liên hệ</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((loc) => (
                  <TableRow key={loc.id}>
                    <TableCell className="font-medium">{loc.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-primary" />
                        {loc.name}
                      </div>
                    </TableCell>
                    <TableCell>{loc.address}</TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <Phone className="size-4" /> {loc.phone}
                        </span>
                        <span>{loc.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="size-4" /> {loc.openTime} - {loc.closeTime}
                        </span>
                      </div>
                    </TableCell>
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
              <DialogTitle>Thêm điểm thuê</DialogTitle>
              <DialogDescription>Nhập thông tin để tạo điểm thuê mới</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Tên chi nhánh</Label>
                <Input id="name" placeholder="Ví dụ: Chi nhánh Quận 1" />
              </div>
              <div>
                <Label htmlFor="manager">Quản lý</Label>
                <Input id="manager" placeholder="Ví dụ: Nguyễn Văn A" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Textarea id="address" placeholder="Số nhà, đường, phường, quận, thành phố" />
              </div>
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" placeholder="Ví dụ: 028-1234-5678" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Ví dụ: chi-nhanh@rentcar.com" />
              </div>
              <div>
                <Label>Giờ mở cửa</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giờ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="07:00">07:00</SelectItem>
                    <SelectItem value="08:00">08:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Giờ đóng cửa</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giờ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="21:00">21:00</SelectItem>
                    <SelectItem value="22:00">22:00</SelectItem>
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
    </div>
  )
}

