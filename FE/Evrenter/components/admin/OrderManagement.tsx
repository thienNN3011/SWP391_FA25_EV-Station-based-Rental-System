"use client"

import { useState, useEffect } from "react"
import { Search, Filter, DollarSign, User, Car, Phone, ChevronDown, ChevronUp, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from "@/lib/api"
import { BookingDetailRow } from "@/components/staff/BookingDetailRow"
import { TimeDisplay } from "@/components/staff/TimeDisplay"
import { AdminBookingDetailModal } from "@/components/admin/admin-booking-detail-modal"

const STATUS_TABS = [
  { key: "ALL", label: "Tất cả" },
  { key: "BOOKING", label: "Đã hoàn tất cọc" },
  { key: "UNCONFIRMED", label: "Chưa xác nhận" },
  { key: "RENTING", label: "Đang thuê" },
  { key: "COMPLETED", label: "Hoàn thành" },
  { key: "CANCELLED", label: "Đã hủy" },
  { key: "NO_SHOW", label: "Không đến" },
]

export function OrderManagement() {
  const [search, setSearch] = useState("")
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [tab, setTab] = useState("ALL")
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null)

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

  const translateStatus = (status: string) => {
    switch (status?.toUpperCase()) {
      case "BOOKING": return "Đã hoàn tất cọc"
      case "RENTING": return "Đang thuê"
      case "CANCELLED": return "Đã hủy"
      case "COMPLETED": return "Hoàn thành"
      case "NO_SHOW": return "Không đến"
      case "UNCONFIRMED": return "Chưa xác nhận"
      default: return status
    }
  }

  const fetchBookings = async () => {
    setLoading(true)
    setError("")
    try {
      const payload = { bookingStatus: "ALL" }
      const res = await api.post("/bookings/showbookingbystatus", payload)

      if (res.data?.data) {
        const mapped = res.data.data.map((b: any) => ({
          id: "BK" + b.bookingId,
          bookingId: b.bookingId,
          customerName: b.user?.fullName || "Ẩn danh",
          customerPhone: b.user?.phone || "—",
          modelName: b.vehicle?.modelName || "Không rõ",
          stationName: b.station?.stationName || "—",
          startTime: b.startTime,
          endTime: b.endTime,
          actualStartTime: b.actualStartTime,
          actualEndTime: b.actualEndTime,
          price: b.tariff?.price,
          statusRaw: b.status?.toUpperCase(),
          status: translateStatus(b.status),
        }))
        setBookings(mapped)
      } else {
        setBookings([])
      }
    } catch (err) {
      console.error(err)
      setError("Không thể tải danh sách booking")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const tabFiltered = bookings.filter((b) => {
    if (tab === "ALL") return true
    return b.statusRaw === tab
  })

  const finalFiltered = tabFiltered.filter((o) => {
    const text = search.toLowerCase()
    return (
      o.id.toLowerCase().includes(text) ||
      o.customerName?.toLowerCase().includes(text) ||
      o.modelName?.toLowerCase().includes(text) ||
      o.customerPhone?.toLowerCase().includes(text) ||
      o.stationName?.toLowerCase().includes(text)
    )
  })

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

      
        <div className="flex gap-2 overflow-x-auto pb-2">
          {STATUS_TABS.map((t) => (
            <Button
              key={t.key}
              variant={tab === t.key ? "default" : "outline"}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </Button>
          ))}
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
            ) : finalFiltered.length === 0 ? (
              <p>Không có đơn nào trong mục này.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Mã</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead>Xe</TableHead>
                    <TableHead>Trạm</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-center">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {finalFiltered.map((bk) => (
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

                        <TableCell className="font-medium">{bk.id}</TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="size-4 text-primary" />
                            <div>{bk.customerName}</div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="size-4 text-primary" />
                            <div>{bk.customerPhone}</div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Car className="size-4 text-blue-500" />
                            <div>{bk.modelName}</div>
                          </div>
                        </TableCell>

                        <TableCell>{bk.stationName}</TableCell>

                        <TableCell>
                          <TimeDisplay booking={bk} />
                        </TableCell>

                        <TableCell className="flex items-center gap-1">
                          <DollarSign className="size-4 text-green-600" />
                          {bk.price ? `${bk.price.toLocaleString()} VNĐ` : "—"}
                        </TableCell>

                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              bk.statusRaw === "BOOKING"
                                ? "bg-yellow-100 text-yellow-700"
                                : bk.statusRaw === "RENTING"
                                ? "bg-blue-100 text-blue-700"
                                : bk.statusRaw === "CANCELLED"
                                ? "bg-red-100 text-red-700"
                                : bk.statusRaw === "COMPLETED"
                                ? "bg-green-100 text-green-700"
                                : bk.statusRaw === "NO_SHOW"
                                ? "bg-orange-100 text-orange-700"
                                : bk.statusRaw === "UNCONFIRMED"
                                ? "bg-gray-200 text-gray-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {bk.status}
                          </span>
                        </TableCell>

                        {/* Action Column */}
                        <TableCell className="text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedBookingId(bk.bookingId)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="size-4" />
                            Chi tiết
                          </Button>
                        </TableCell>
                      </TableRow>

                      {/* Expandable Detail Row */}
                      {expandedRows.has(bk.bookingId) && (
                        <TableRow key={`${bk.bookingId}-detail`}>
                          <TableCell colSpan={10} className="p-0">
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
      </div>

      {/* Admin Booking Detail Modal */}
      <AdminBookingDetailModal
        bookingId={selectedBookingId}
        onClose={() => setSelectedBookingId(null)}
      />
    </div>
  )
}
