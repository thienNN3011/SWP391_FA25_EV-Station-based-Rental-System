"use client"

import { useState } from "react"
import { Search, MoreHorizontal, Eye, Edit, Trash2, Filter, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

const orders = [
  { id: "ORD001", customer: "Nguyễn Văn A", vehicle: "VF e34", start: "2024-09-20", end: "2024-09-22", amount: "2.500.000", status: "Đang thuê" },
  { id: "ORD002", customer: "Trần Thị B", vehicle: "VF 8", start: "2024-09-18", end: "2024-09-20", amount: "3.200.000", status: "Hoàn thành" },
  { id: "ORD003", customer: "Lê Văn C", vehicle: "VF 9", start: "2024-09-21", end: "2024-09-23", amount: "4.100.000", status: "Chờ xử lý" },
]

export function OrderManagement() {
  const [search, setSearch] = useState("")

  const filtered = orders.filter((o) => o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="h-full w-full overflow-auto">
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl">Quản lý đơn thuê</h1>
            <p className="text-muted-foreground">Theo dõi và xử lý đơn</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
              <Input placeholder="Tìm theo mã đơn/khách" className="pl-8 w-64" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Button variant="outline">
              <Filter className="size-4 mr-2" /> Bộ lọc
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách đơn thuê</CardTitle>
            <CardDescription>Đơn gần đây</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Phương tiện</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Thành tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.id}</TableCell>
                    <TableCell>{o.customer}</TableCell>
                    <TableCell>{o.vehicle}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4" /> {o.start} → {o.end}
                      </div>
                    </TableCell>
                    <TableCell>{o.amount} VNĐ</TableCell>
                    <TableCell>
                      <Badge variant={o.status === "Hoàn thành" ? "default" : o.status === "Đang thuê" ? "secondary" : "destructive"}>
                        {o.status}
                      </Badge>
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
      </div>
    </div>
  )
}

