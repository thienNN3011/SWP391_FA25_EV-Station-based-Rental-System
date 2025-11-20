"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Search, RefreshCcw, Calendar, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import toast, { Toaster } from "react-hot-toast"

interface RefundBooking {
  bookingId: number
  status: string
  actualEndTime?: string
  startTime?: string
  customerName?: string
  customerPhone?: string
  customerEmail?: string
  bankAccount?: string
  bankName?: string
  originalDeposit?: number
  refundRate?: number
  refundAmount?: number

  [k: string]: any
}

export default function RefundInlinePage() {
  const [bookings, setBookings] = useState<RefundBooking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")

 
  const [editingBookingId, setEditingBookingId] = useState<number | null>(null)
  const [referenceCode, setReferenceCode] = useState("")
  const [transactionDate, setTransactionDate] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchRefundList()
  }, [])

  const fetchRefundList = async () => {
    setLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Chưa đăng nhập")

      const res = await api.get("/bookings/showbookingsrefund", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.data && res.data.success) {
        setBookings(res.data.data || [])
      } else {
        setError(res.data?.message || "Lỗi khi lấy dữ liệu")
      }
    } catch (err: any) {
      console.error("fetchRefundList error:", err)
      setError(err?.message || "Không thể kết nối đến server")
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (b: RefundBooking) => {
    setEditingBookingId(b.bookingId)
    setReferenceCode("") 
 
    setTransactionDate("") 
  }

  const cancelEdit = () => {
    setEditingBookingId(null)
    setReferenceCode("")
    setTransactionDate("")
  }

  const handleRefundSubmit = async (bookingId: number) => {
   
    if (!referenceCode) {
      toast.error("Vui lòng nhập mã tham chiếu (referenceCode).")
      return
    }
    if (!transactionDate) {
      toast.error("Vui lòng chọn ngày giao dịch.")
      return
    }

    
    let tx = transactionDate
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(tx)) {
      tx = tx + ":00"
    }

    setSubmitting(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Chưa đăng nhập")

      const payload = {
        bookingId: String(bookingId),
        referenceCode: referenceCode,
        transactionDate: tx,
      }

      const res = await api.post("/payments/refund", payload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.data && res.data.success) {
        toast.success(res.data.message || "Hoàn tiền thành công")
      
        setBookings((prev) => prev.filter((p) => p.bookingId !== bookingId))
        cancelEdit()
      } else {
        toast.error(res.data?.message || "Hoàn tiền thất bại")
      }
    } catch (err: any) {
      console.error("handleRefundSubmit error:", err)
      toast.error(err?.response?.data?.message || err?.message || "Lỗi khi gọi API hoàn tiền")
    } finally {
      setSubmitting(false)
    }
  }

  const filtered = bookings.filter((b) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      b.bookingId.toString().includes(q) ||
      (b.customerName || "").toLowerCase().includes(q) ||
      (b.customerEmail || "").toLowerCase().includes(q)
    )
  })

  return (
    <div className="h-full w-full overflow-auto p-4 md:p-6">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <DollarSign className="text-green-600 w-6 h-6" />
            Quản lý hoàn tiền (Inline)
          </h1>
          <p className="text-muted-foreground">Danh sách booking cần hoàn tiền — thao tác nhanh</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo Booking ID / tên / email"
              className="pl-8 w-72"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Button variant="outline" onClick={fetchRefundList}>
            <RefreshCcw className="w-4 h-4 mr-2" /> Làm mới
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách chờ hoàn tiền</CardTitle>
          <CardDescription>Click "Hoàn tiền" để hiện form ngay phía dưới hàng</CardDescription>
        </CardHeader>

        <CardContent className="overflow-visible">
          {loading ? (
            <div className="py-6 text-center">Đang tải...</div>
          ) : error ? (
            <div className="text-red-500 p-4">
              <div>{error}</div>
              {error.toLowerCase().includes("đăng nhập") && (
                <Button onClick={() => (window.location.href = "/login")}>Đăng nhập lại</Button>
              )}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">Không có booking cần hoàn tiền</div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Liên hệ</TableHead>
                    <TableHead>Số tiền hoàn</TableHead>
                    <TableHead>Ngày bắt đầu</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
  {filtered.map((b) => (
    <>
 
      <TableRow key={b.bookingId}>
        <TableCell className="font-medium">{b.bookingId}</TableCell>
        <TableCell>{b.customerName || "—"}</TableCell>
        <TableCell className="text-sm text-muted-foreground">
          <div>{b.customerPhone}</div>
          <div>{b.customerEmail}</div>
        </TableCell>
        <TableCell>
          {Number(b.refundAmount ?? b.originalDeposit ?? 0).toLocaleString()}₫
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {b.startTime ? new Date(b.startTime).toLocaleString("vi-VN") : "—"}
        </TableCell>
        <TableCell>
          <Badge className="text-xs">
            {b.status ?? "—"}
          </Badge>
        </TableCell>

        <TableCell className="text-right">
          <Button
            size="sm"
            variant="outline"
            onClick={() => startEdit(b)}
            disabled={editingBookingId === b.bookingId && submitting}
          >
            Hoàn tiền
          </Button>
        </TableCell>
      </TableRow>


      {editingBookingId === b.bookingId && (
        <TableRow key={`${b.bookingId}-form`}>
          <TableCell colSpan={7} className="bg-muted/30">
            <div className="p-3 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              <div>
                <div className="text-xs text-muted-foreground">Mã booking</div>
                <div className="font-medium">{b.bookingId}</div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground">Mã tham chiếu (referenceCode)</div>
                <Input
                  placeholder="vd: 15250703"
                  value={referenceCode}
                  onChange={(e) => setReferenceCode(e.target.value)}
                />
              </div>

              <div>
                <div className="text-xs text-muted-foreground">Ngày giao dịch</div>
                <Input
                  type="datetime-local"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Ví dụ: 2025-11-12 17:00
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="ghost" onClick={cancelEdit} disabled={submitting}>
                  Huỷ
                </Button>

                <Button
                  onClick={() => handleRefundSubmit(b.bookingId)}
                  disabled={submitting}
                >
                  {submitting
                    ? "Đang xử lý..."
                    : `Xác nhận hoàn ${Number(b.refundAmount ?? b.originalDeposit ?? 0).toLocaleString()}₫`}
                </Button>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  ))}
</TableBody>

              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
