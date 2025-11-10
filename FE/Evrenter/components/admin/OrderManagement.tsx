"use client"

import { useState, useEffect } from "react"
import { Search, MoreHorizontal, Eye, Edit, Trash2, Filter, Calendar, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"

export function OrderManagement() {
  const [search, setSearch] = useState("")
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Fetch booking từ API
  const fetchBookings = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await api.post("/bookings/showbookingbystatus", { status: "ALL" })
      if (res.data?.data) {
        const mapped = res.data.data.map((b: any) => ({
          id: "BK" + b.bookingId,
          customer: b.user?.fullName || "Ẩn danh",
          customerPhone: b.user?.phone || "",
          vehicle: b.vehicle?.modelName || "Không rõ",
          start: b.startTime?.split(" ")[0] || "",
          end: b.endTime?.split(" ")[0] || "",
          amount: b.tariff?.price ? b.tariff.price.toLocaleString() : "—",
          status: translateStatus(b.status),
        }))
        setBookings(mapped)
      } else {
        setBookings([])
      }
    } catch (err: any) {
      console.error(err)
      setError("Không thể tải danh sách booking")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const translateStatus = (status: string) => {
    switch (status?.toUpperCase()) {
      case "BOOKING": return "Chờ xử lý"
      case "RENTING": return "Đang thuê"
      case "CANCELLED": return "Đã hủy"
      case "COMPLETED": return "Hoàn thành"
      case "NO_SHOW": return "Không đến"
      case "UNCONFIRMED": return "Chưa xác nhận"
      default: return status
    }
  }

  const filtered = bookings.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.vehicle.toLowerCase().includes(search.toLowerCase())
  )

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
              <Input
                placeholder="Tìm theo mã đơn/khách/xe"
                className="pl-8 w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
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
            {loading ? (
              <p>Đang tải dữ liệu...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : filtered.length === 0 ? (
              <p>Không có đơn thuê nào.</p>
            ) : (
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
                      <TableCell className="flex items-center gap-1">
                        <DollarSign className="size-4 text-green-600" /> {o.amount} VNĐ
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            o.status === "Hoàn thành"
                              ? "default"
                              : o.status === "Đang thuê"
                              ? "secondary"
                              : "destructive"
                          }
                        >
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
