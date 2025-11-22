"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Car, Clock, MapPin, Search, Eye, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { Toaster } from "react-hot-toast"
import { Header } from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"
import { useBookings, type Booking } from "@/hooks/use-bookings"
import { BookingDetailModal } from "@/components/booking-detail-modal"
import { CancelBookingDialog } from "@/components/cancel-booking-dialog"
import { useRouter } from "next/navigation"
import { getErrorMessage } from "@/lib/error-utils"
import toast from "react-hot-toast"

const STATUS_TABS = [
  { key: "ALL", label: "Tất cả" },
  { key: "BOOKING", label: "Đã hoàn tất cọc" },
  { key: "UNCONFIRMED", label: "Chưa xác nhận" },
  { key: "RENTING", label: "Đang thuê" },
  { key: "COMPLETED", label: "Hoàn thành" },
  { key: "CANCELLED", label: "Đã hủy" },
  { key: "NO_SHOW", label: "Không đến" },
]

const STATUS_COLORS: Record<string, string> = {
  BOOKING: "bg-yellow-400 text-black",
  RENTING: "bg-blue-500 text-white",
  COMPLETED: "bg-green-600 text-white",
  CANCELLED: "bg-red-500 text-white",
  NO_SHOW: "bg-red-500 text-white",
  UNCONFIRMED: "bg-red-500 text-white",
}

const colorMap: Record<string, string> = {
  red: "Đỏ",
  blue: "Xanh dương",
  white: "Trắng",
  black: "Đen",
  silver: "Bạc",
  gray: "Xám",
  green: "Xanh lá",
  yellow: "Vàng",
  orange: "Cam",
  brown: "Nâu",
}

export default function BookingHistoryPage() {
  const router = useRouter()
  const [tab, setTab] = useState("ALL")
  const [page, setPage] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null)
  const [cancelBooking, setCancelBooking] = useState<Booking | null>(null)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setPage(0) // Reset to first page on search
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Reset page when tab changes
  useEffect(() => {
    setPage(0)
  }, [tab])

  // Fetch bookings with React Query
  const { data, isLoading, error } = useBookings({
    status: tab,
    page,
    size: 20,
    searchQuery: debouncedSearch,
  })

  // Handle error
  useEffect(() => {
    if (error) {
      const message = getErrorMessage(error)
      toast.error(message)
    }
  }, [error])

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("vi-VN"),
      time: date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Header />
      <Toaster position="top-right" />

      {/* Header with New Booking Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Lịch sử đơn thuê</h1>
          <p className="text-muted-foreground">Quản lý và theo dõi các đơn thuê xe của bạn</p>
        </div>
        <Button onClick={() => router.push("/booking")} className="gap-2">
          <Plus className="h-4 w-4" />
          Đặt xe mới
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo mã đơn, biển số, mẫu xe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto py-3 mb-4">
        {STATUS_TABS.map((t) => (
          <Button
            key={t.key}
            variant={tab === t.key ? "default" : "outline"}
            onClick={() => setTab(t.key)}
            className="whitespace-nowrap"
          >
            {t.label}
          </Button>
        ))}
      </div>

      {/* Bookings List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-secondary" />
            Danh sách đơn thuê
          </CardTitle>
          <CardDescription>
            {data && `Hiển thị ${data.bookings.length} / ${data.totalElements} đơn`}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : !data || data.bookings.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {searchQuery ? "Không tìm thấy đơn thuê phù hợp" : "Không có đơn trong mục này"}
            </div>
          ) : (
            <div className="space-y-4">
              {data.bookings.map((b) => {
                const start = formatDateTime(b.startTime)
                const end = formatDateTime(b.endTime)

                return (
                  <div
                    key={b.bookingId}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition cursor-pointer"
                    onClick={() => setSelectedBookingId(b.bookingId)}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Car className="h-6 w-6 text-secondary" />
                      </div>

                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="font-medium flex items-center gap-2">
                          <span>#{b.bookingId}</span>
                          <span className="text-muted-foreground">•</span>
                          <span>
                            {b.vehicleModel} ({colorMap[b.vehicleColor?.trim().toLowerCase()] || b.vehicleColor})
                          </span>
                          <span className="text-muted-foreground">•</span>
                          <span className="font-mono">{b.plateNumber}</span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{b.stationName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 flex-shrink-0" />
                            <span>
                              {start.date} {start.time} - {end.date} {end.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right space-y-2">
                        <div className="font-semibold text-lg text-secondary">{b.totalAmount.toLocaleString()}₫</div>
                        <Badge className={STATUS_COLORS[b.status] || "bg-gray-300"}>
                          {STATUS_TABS.find((t) => t.key === b.status)?.label ?? b.status}
                        </Badge>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedBookingId(b.bookingId)
                          }}
                          className="gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          Chi tiết
                        </Button>

                        {b.status === "BOOKING" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              setCancelBooking(b)
                            }}
                          >
                            Hủy đơn
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Trang {data.currentPage + 1} / {data.totalPages}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={!data.hasPrevious || isLoading}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trước
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!data.hasNext || isLoading}
                  className="gap-1"
                >
                  Sau
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <BookingDetailModal bookingId={selectedBookingId} onClose={() => setSelectedBookingId(null)} />
      <CancelBookingDialog booking={cancelBooking} onClose={() => setCancelBooking(null)} />
    </div>
  )
}

