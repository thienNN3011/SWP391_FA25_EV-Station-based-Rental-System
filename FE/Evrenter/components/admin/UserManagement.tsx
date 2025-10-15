"use client"

import { useState } from "react"
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const customers = [
  { id: "USR001", name: "Nguyễn Văn An", email: "nguyenvanan@email.com", phone: "0987654321", address: "123 Nguyễn Văn Cừ, Q1, TP.HCM", totalOrders: 5, totalSpent: "12.500.000 VNĐ", joinDate: "2024-01-15", lastOrder: "2024-09-20" },
  { id: "USR002", name: "Trần Thị Bình", email: "tranthibinh@email.com", phone: "0976543210", address: "456 Lê Lợi, Q1, TP.HCM", totalOrders: 2, totalSpent: "6.700.000 VNĐ", joinDate: "2024-03-10", lastOrder: "2024-09-18" },
  { id: "USR003", name: "Lê Văn Cường", email: "le.van.cuong@email.com", phone: "0965432109", address: "789 Trần Hưng Đạo, Q5, TP.HCM", totalOrders: 8, totalSpent: "20.100.000 VNĐ", joinDate: "2023-12-05", lastOrder: "2024-09-12" },
  { id: "USR004", name: "Phạm Thị Dung", email: "pham.thi.dung@email.com", phone: "0954321098", address: "101 Võ Thị Sáu, Q3, TP.HCM", totalOrders: 1, totalSpent: "2.800.000 VNĐ", joinDate: "2024-08-01", lastOrder: "2024-08-15" },
  { id: "USR005", name: "Hoàng Văn Em", email: "hoang.van.em@email.com", phone: "0943210987", address: "202 Hai Bà Trưng, Q1, TP.HCM", totalOrders: 12, totalSpent: "35.600.000 VNĐ", joinDate: "2023-10-10", lastOrder: "2024-09-18" },
]

export function UserManagement() {
  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filtered = customers.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="h-full w-full overflow-auto">
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl">Quản lý khách hàng</h1>
            <p className="text-muted-foreground">Thông tin người dùng hệ thống</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
              <Input placeholder="Tìm theo tên/email" className="pl-8 w-64" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <UserPlus className="size-4 mr-2" /> Thêm khách hàng
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách khách hàng</CardTitle>
            <CardDescription>Khách hàng đã đăng ký</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Đơn thuê</TableHead>
                  <TableHead>Tổng chi</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.id}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.phone}</TableCell>
                    <TableCell>{c.totalOrders}</TableCell>
                    <TableCell>{c.totalSpent}</TableCell>
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
              <DialogTitle>Thêm khách hàng</DialogTitle>
              <DialogDescription>Nhập thông tin khách hàng mới</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Họ và tên</Label>
                <Input id="name" placeholder="Nguyễn Văn A" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@example.com" />
              </div>
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" placeholder="0987 654 321" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input id="address" placeholder="Số nhà, đường, phường, quận, thành phố" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
              <Button>Lưu</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

