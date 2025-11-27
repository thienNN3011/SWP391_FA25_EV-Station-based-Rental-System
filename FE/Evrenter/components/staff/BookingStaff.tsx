"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import {Search,Eye,MoreHorizontal,Clock,Car,Calendar,User,DollarSign,FileText, Phone, ChevronDown, ChevronUp
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
import { TimeDisplay } from "./TimeDisplay"
import { BookingDetailRow } from "./BookingDetailRow"



export function BookingStaff() {
  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
  const [activeTab, setActiveTab] = useState("ALL")

  const translateStatus = (status: string) => {
  switch (status?.toUpperCase()) {
    case "BOOKING":
      return "Đã đặt (Đã nhận cọc)"
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


  const toggleRowExpansion = (bookingId: number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(bookingId)) {
        newSet.delete(bookingId)
      } else {
        newSet.add(bookingId)
      }
      return newSet
    })
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
          actualStartTime: b.actualStartTime,
          actualEndTime: b.actualEndTime,
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

  // Filter by tab first
  const tabFiltered = bookings.filter((b) => {
    if (activeTab === "ALL") return true
    return b.status?.toUpperCase() === activeTab
  })

  // Then filter by search
  const filtered = tabFiltered.filter((b) => {
    const text = search.toLowerCase()
    return (
      b.customerName?.toLowerCase().includes(text) ||
      b.modelName?.toLowerCase().includes(text) ||
      b.customerPhone?.toLowerCase().includes(text) ||
      b.stationName?.toLowerCase().includes(text)
    )
  })

  const tabs = [
    { key: "ALL", label: "Tất cả" },
    { key: "BOOKING", label: "Đã hoàn tất cọc" },
    { key: "UNCONFIRMED", label: "Chưa xác nhận" },
    { key: "RENTING", label: "Đang thuê" },
    { key: "COMPLETED", label: "Hoàn thành" },
    { key: "CANCELLED", label: "Đã hủy" },
    { key: "NO_SHOW", label: "Không đến" },
  ]

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
                placeholder="Tìm theo khách hàng / xe / trạm"
                className="pl-8 w-72"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "outline"}
              onClick={() => setActiveTab(tab.key)}
              className={
                activeTab === tab.key
                  ? "bg-teal-500 hover:bg-teal-600 text-white"
                  : "hover:bg-gray-100"
              }
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách Booking</CardTitle>
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
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Mã Booking</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead>Xe</TableHead>
                    <TableHead>Trạm</TableHead>
                    <TableHead>Thời gian</TableHead>
                   
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((bk) => (
                    <>
                      <TableRow key={bk.bookingId}>
                        {/* Expand/Collapse Button */}
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleRowExpansion(bk.bookingId)}
                          >
                            {expandedRows.has(bk.bookingId) ? (
                              <ChevronUp className="size-4" />
                            ) : (
                              <ChevronDown className="size-4" />
                            )}
                          </Button>
                        </TableCell>

                        <TableCell className="font-medium">{bk.bookingId}</TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="size-4 text-primary" />
                            <div>{bk.customerName || "Ẩn danh"}</div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="size-4 text-primary" />
                            <div>{bk.customerPhone || "Ẩn danh"}</div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Car className="size-4 text-blue-500" />
                            <div>{bk.modelName || "Không rõ"}</div>
                          </div>
                        </TableCell>

                        <TableCell>{bk.stationName || "Không rõ"}</TableCell>

                        {/* Time Display - Using new TimeDisplay component */}
                        <TableCell>
                          <TimeDisplay booking={bk} />
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

                      {/* Expandable Detail Row */}
                      {expandedRows.has(bk.bookingId) && (
                        <TableRow key={`${bk.bookingId}-detail`}>
                          <TableCell colSpan={9} className="p-0">
                            <BookingDetailRow booking={bk} />
                          </TableCell>
                        </TableRow>
                      )}
                    </>
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
