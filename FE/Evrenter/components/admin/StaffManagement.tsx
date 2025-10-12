"use client"

import { useState } from "react"
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const staff = [
  { id: "STF001", name: "Nguyễn Minh Khang", role: "Quản lý chi nhánh", branch: "Quận 1", phone: "0912345678", email: "khang@rentcar.com" },
  { id: "STF002", name: "Trần Thị Hạnh", role: "Nhân viên kinh doanh", branch: "Quận 3", phone: "0923456789", email: "hanh@rentcar.com" },
  { id: "STF003", name: "Lê Quốc Bảo", role: "Kỹ thuật viên", branch: "Quận 7", phone: "0934567890", email: "bao@rentcar.com" },
]

export function StaffManagement() {
  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filtered = staff.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.role.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="h-full w-full overflow-auto">
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl">Quản lý nhân viên</h1>
            <p className="text-muted-foreground">Danh sách và phân quyền</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
              <Input placeholder="Tìm theo tên/chức vụ" className="pl-8 w-64" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="size-4 mr-2" /> Thêm nhân viên
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách nhân viên</CardTitle>
            <CardDescription>Quản lý tài khoản và phân quyền</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>Chức vụ</TableHead>
                  <TableHead>Chi nhánh</TableHead>
                  <TableHead>Liên hệ</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.id}</TableCell>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.role}</TableCell>
                    <TableCell>{s.branch}</TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm text-muted-foreground">
                        <span>{s.phone}</span>
                        <span>{s.email}</span>
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
              <DialogTitle>Thêm nhân viên</DialogTitle>
              <DialogDescription>Nhập thông tin nhân viên mới</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Họ và tên</Label>
                <Input id="name" placeholder="Ví dụ: Nguyễn Văn A" />
              </div>
              <div>
                <Label htmlFor="role">Chức vụ</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chức vụ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager">Quản lý</SelectItem>
                    <SelectItem value="staff">Nhân viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="branch">Chi nhánh</Label>
                <Input id="branch" placeholder="Ví dụ: Quận 1" />
              </div>
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" placeholder="0912 345 678" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@example.com" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
              <Button>
                <ShieldCheck className="size-4 mr-2" /> Lưu
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

