"use client"

import { useEffect, useState } from "react"
import { Search, Filter, ArrowUpRight, ArrowDownLeft, Download, ChevronLeft, ChevronRight, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { getTransactions, getAllStations, TransactionResponse, StationResponse } from "@/lib/adminApi"
import { AdminBookingDetailModal } from "@/components/admin/admin-booking-detail-modal"

export function TransactionManagement() {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])
  const [stations, setStations] = useState<StationResponse[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [stationId, setStationId] = useState<string>("all")
  const [paymentType, setPaymentType] = useState<string>("all")

  // Pagination
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  // Booking detail modal
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null)

  useEffect(() => {
    loadStations()
  }, [])

  useEffect(() => {
    loadTransactions()
  }, [page, stationId, paymentType, startDate, endDate])

  async function loadStations() {
    try {
      const data = await getAllStations()
      setStations(data)
    } catch (err) {
      console.error("Failed to load stations", err)
    }
  }

  async function loadTransactions() {
    setLoading(true)
    try {
      const res = await getTransactions({
        page,
        size: 10,
        startDate: startDate || null,
        endDate: endDate || null,
        stationId: stationId !== "all" ? Number(stationId) : null,
        paymentType: paymentType !== "all" ? paymentType : null
      })
      setTransactions(res.content)
      setTotalPages(res.totalPages)
      setTotalElements(res.totalElements)
    } catch (err) {
      console.error("Failed to load transactions", err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('vi-VN')
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Đặt cọc</Badge>
      case 'FINAL_PAYMENT':
        return <Badge className="bg-green-500 hover:bg-green-600">Thanh toán</Badge>
      case 'REFUND_DEPOSIT':
        return <Badge variant="destructive">Hoàn tiền</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <div className="h-full w-full p-4 md:p-6 space-y-6 overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý dòng tiền</h1>
          <p className="text-muted-foreground">Theo dõi lịch sử giao dịch và biến động số dư.</p>
        </div>
        {/* Stats Summary (Optional - Placeholder for now) */}
        <div className="flex gap-2">
          {/* <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Xuất báo cáo</Button> */}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Filter className="h-4 w-4" /> Bộ lọc tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Từ ngày</label>
              <Input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Đến ngày</label>
              <Input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Trạm xe</label>
              <Select value={stationId} onValueChange={setStationId}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả trạm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạm</SelectItem>
                  {stations.map(s => (
                    <SelectItem key={s.stationId} value={String(s.stationId)}>
                      {s.stationName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Loại giao dịch</label>
              <Select value={paymentType} onValueChange={setPaymentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  <SelectItem value="DEPOSIT">Đặt cọc (Vào)</SelectItem>
                  <SelectItem value="FINAL_PAYMENT">Thanh toán (Vào)</SelectItem>
                  <SelectItem value="REFUND_DEPOSIT">Hoàn tiền (Ra)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã GD</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Phương thức</TableHead>
                <TableHead>Trạm</TableHead>
                <TableHead className="text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">Đang tải dữ liệu...</TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">Không tìm thấy giao dịch nào.</TableCell>
                </TableRow>
              ) : (
                transactions.map((txn) => (
                  <TableRow key={txn.paymentId}>
                    <TableCell className="font-medium">#{txn.referenceCode}</TableCell>
                    <TableCell>{formatDate(txn.transactionDate)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{txn.customerName}</span>
                        <span className="text-xs text-muted-foreground">Booking #{txn.bookingId}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(txn.paymentType)}</TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-1 font-bold ${txn.paymentType === 'REFUND_DEPOSIT' ? 'text-red-600' : 'text-green-600'}`}>
                        {txn.paymentType === 'REFUND_DEPOSIT' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                        {formatCurrency(txn.amount)}
                      </div>
                    </TableCell>
                    <TableCell>{txn.method}</TableCell>
                    <TableCell>{txn.stationName}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedBookingId(txn.bookingId)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="size-4" />
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        
        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-4 py-4 border-t">
          <div className="text-sm text-muted-foreground">
            Hiển thị {transactions.length} / {totalElements} giao dịch
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4" /> Trước
            </Button>
            <div className="text-sm font-medium">
              Trang {page + 1} / {totalPages || 1}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              Sau <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Admin Booking Detail Modal */}
      <AdminBookingDetailModal
        bookingId={selectedBookingId}
        onClose={() => setSelectedBookingId(null)}
      />
    </div>
  )
}
