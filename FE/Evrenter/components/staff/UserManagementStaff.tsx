"use client"
import { SimpleDropdown } from "@/components/ui/simple-dropdown"

import { useState, useRef, useEffect } from "react"
import {Search,MoreHorizontal,UserPlus} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {Card,CardContent,CardDescription,CardHeader,CardTitle} from "@/components/ui/card"
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table"
import {Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle,} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"


const usersData = [
  {
    id: "USR001",
    fullName: "Nguyễn Văn An",
    phone: "0987654321",
    email: "nguyenvanan@email.com",
    cccd: "079123456789",
    driverLicense: "DL123456789",
    cccdImage: "",
    licenseImage: "",
    status: "ACTIVE",
  },
  {
    id: "USR002",
    fullName: "Trần Thị Bình",
    phone: "0976543210",
    email: "tranthibinh@email.com",
    cccd: "079987654321",
    driverLicense: "DL987654321",
    cccdImage: "",
    licenseImage: "",
    status: "PENDING",
  },
]

export function UserManagementStaff() {
  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [users, setUsers] = useState(usersData)

  const filtered = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search)
  )

  const renderStatus = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-500/20 text-green-700">Active</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-500/20 text-yellow-700">Pending</Badge>
      case "BLOCKED":
        return <Badge className="bg-red-500/20 text-red-700">Blocked</Badge>
      default:
        return null
    }
  }

  const handleActivate = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "ACTIVE" } : u))
    )
  }

  const handleDeactivate = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "BLOCKED" } : u))
    )
  }

  return (
    <div className="h-full w-full">
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Quản lý người dùng</h1>
            <p className="text-muted-foreground">
              Danh sách tài khoản khách hàng
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên / email / SĐT"
                className="pl-8 w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <UserPlus className="size-4 mr-2" /> Thêm người dùng
            </Button>
          </div>
        </div>


        <Card>
          <CardHeader>
            <CardTitle>Danh sách người dùng</CardTitle>
            <CardDescription>
              Thông tin chi tiết của khách hàng đã đăng ký
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ và Tên</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Số CMND/CCCD</TableHead>
                  <TableHead>Số GPLX</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ảnh CMND/CCCD</TableHead>
                  <TableHead>Ảnh GPLX</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.fullName}</TableCell>
                    <TableCell>{u.phone}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.cccd}</TableCell>
                    <TableCell>{u.driverLicense}</TableCell>
                    <TableCell>{renderStatus(u.status)}</TableCell>
                    <TableCell>
                      <img
                        src={u.cccdImage}
                        alt="CCCD"
                        className="w-16 h-10 object-cover rounded bg-muted"
                      />
                    </TableCell>
                    <TableCell>
                      <img
                        src={u.licenseImage}
                        alt="GPLX"
                        className="w-16 h-10 object-cover rounded bg-muted"
                      />
                    </TableCell>
                    <TableCell className="text-right">
  <SimpleDropdown
    onActivate={() => handleActivate(u.id)}
    onDeactivate={() => handleDeactivate(u.id)}
  />
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
              <DialogTitle>Thêm người dùng mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin chi tiết của người dùng
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input id="fullName" placeholder="Nguyễn Văn A" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@example.com" />
              </div>
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" placeholder="0987 654 321" />
              </div>
              <div>
                <Label htmlFor="cccd">Số CMND/CCCD</Label>
                <Input id="cccd" placeholder="079xxxxxxx" />
              </div>
              <div>
                <Label htmlFor="driverLicense">Số GPLX</Label>
                <Input id="driverLicense" placeholder="DLxxxxxxx" />
              </div>
              <div>
                <Label htmlFor="cccdImage">Ảnh CMND/CCCD</Label>
                <Input id="cccdImage" type="file" accept="image/*" />
              </div>
              <div>
                <Label htmlFor="licenseImage">Ảnh GPLX</Label>
                <Input id="licenseImage" type="file" accept="image/*" />
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
