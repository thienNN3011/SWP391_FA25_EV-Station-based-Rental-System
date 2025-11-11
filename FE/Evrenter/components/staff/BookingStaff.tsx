"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import {Search,Eye,MoreHorizontal,Clock,Car,Calendar,User,DollarSign,FileText, Phone
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {Card,CardContent,CardDescription,CardHeader,CardTitle,
} from "@/components/ui/card"
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow,
} from "@/components/ui/table"
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle,
} from "@/components/ui/dialog"



export function BookingStaff() {
  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const translateStatus = (status: string) => {
  switch (status?.toUpperCase()) {
    case "BOOKING":
      return "Đã đặt"
    case "RENTING":
      return "Đang thuê"
    case "CANCELLED":
      return "Đã hủy"
    case "NO_SHOW":
      return "Không đến"
    case "COMPLETED":
      return "Hoàn thành"
    case "UNCONFIRMED":
      return "Chưa xác nhận"
    default:
      return status
  }
}


  const fetchBookings = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await api.post("/bookings/showbookingbystatus", { status: "ALL" })
      if (res.data?.data) {
        const mapped = res.data.data.map((b: any) => ({
          bookingId: b.bookingId,
          customerName: b.user.fullName,  
          customerPhone: b.user.phone,          
          modelName: b.vehicle?.modelName,     
          stationName: b.station?.stationName, 
          startTime: b.startTime,
          endTime: b.endTime,
          price: b.tariff?.price,
          status: b.status
        }))
        setBookings(mapped)
      } else {
        setBookings([])
      }
    } catch (err: any) {
      console.error("Lỗi khi tải danh sách booking:", err)
      setError(
        err.response?.data?.message ||
          (err.response?.status === 403
            ? "Bạn không có quyền xem danh sách booking"
            : "Không thể kết nối đến máy chủ")
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const filtered = bookings.filter((b) => {
    const text = search.toLowerCase()
    return (
      b.customerName?.toLowerCase().includes(text) ||
      b.modelName?.toLowerCase().includes(text) ||
      b.customerPhone?.toLowerCase().includes(text) ||
      b.stationName?.toLowerCase().includes(text)
    )
  })

  return (
    <div className="h-full w-full overflow-auto">
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl">Quản lý Booking</h1>
            <p className="text-muted-foreground">Theo dõi và quản lý các yêu cầu đặt xe</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo khách hàng / xe / trạm"
                className="pl-8 w-72"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách Booking</CardTitle>
            <CardDescription>
              Hiển thị các yêu cầu đặt xe có trạng thái <b>BOOKING</b>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Đang tải</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : filtered.length === 0 ? (
              <p>Không có booking nào.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã Booking</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Số điện thoại</TableHead> 
                    <TableHead>Xe</TableHead>
                    <TableHead>Trạm</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((bk) => (
                    <TableRow key={bk.bookingId}>
                      <TableCell className="font-medium">{bk.bookingId}</TableCell>

                      <TableCell>
  <div className="flex items-center gap-2">
    <User className="size-4 text-primary" />
    <div>{bk.customerName || "Ẩn danh"}</div>
  </div>
</TableCell>
<TableCell>
  <div className="flex items-center gap-2">
    <User className="size-4 text-primary" />
    <div>{bk.customerPhone || "Ẩn danh"}</div>
  </div>
</TableCell>

{/* Cột xe */}
<TableCell>
  <div className="flex items-center gap-2">
    <Car className="size-4 text-blue-500" />
    <div>{bk.modelName || "Không rõ"}</div>
  </div>
</TableCell>
                      
                      <TableCell>{bk.stationName || "Không rõ"}</TableCell>

                      
                      <TableCell className="text-sm text-muted-foreground">
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-4" /> {bk.startTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="size-4" /> {bk.endTime}
                          </span>
                        </div>
                      </TableCell>

                  
                      <TableCell className="flex items-center gap-1">
                        <DollarSign className="size-4 text-green-600" />
                        {bk.price ? `${bk.price.toLocaleString()} VND` : "—"}
                      </TableCell>

                      
                      <TableCell>
  <span
    className={`px-2 py-1 rounded-full text-xs font-medium ${
      bk.status === "BOOKING"
        ? "bg-yellow-100 text-yellow-700"
        : bk.status === "RENTING"
        ? "bg-blue-100 text-blue-700"
        : bk.status === "CANCELLED"
        ? "bg-red-100 text-red-700"
        : bk.status === "COMPLETED"
        ? "bg-green-100 text-green-700"
        : bk.status === "NO_SHOW"
        ? "bg-orange-100 text-orange-700"
        : bk.status === "UNCONFIRMED"
        ? "bg-gray-200 text-gray-700"
        : "bg-gray-100 text-gray-600"
    }`}
  >
    {translateStatus(bk.status)}
  </span>
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
                              <Eye className="size-4" /> Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2">
                              <FileText className="size-4" /> Hợp đồng
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
              <DialogTitle>Thông tin Booking</DialogTitle>
              <DialogDescription>
                Xem chi tiết hoặc chỉnh sửa thông tin đặt xe
              </DialogDescription>
            </DialogHeader>
            <p>Chi tiết booking</p>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
