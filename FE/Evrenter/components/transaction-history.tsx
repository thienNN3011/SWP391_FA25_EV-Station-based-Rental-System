"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination } from "@/components/ui/pagination"
import { api } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Transaction {
  paymentId: number
  bookingId: number
  paymentType: string
  amount: number
  referenceCode: string
  transactionDate: string
  method: string
}

const TRANSACTION_TABS = [
  { key: "ALL", label: "Tất cả" },
  { key: "DEPOSIT", label: "Tiền cọc" },
  { key: "REFUND_DEPOSIT", label: "Hoàn tiền cọc" },
  { key: "FINAL_PAYMENT", label: "Thanh toán" },
]

const paymentTypeLabels: Record<string, { label: string; color: string }> = {
  DEPOSIT: { label: "Tiền cọc", color: "bg-yellow-400 text-black" },
  REFUND_DEPOSIT: { label: "Hoàn tiền cọc", color: "bg-red-500 text-white" },
  FINAL_PAYMENT: { label: "Thanh toán", color: "bg-green-500 text-white" },
}

const paymentMethodLabels: Record<string, string> = {
  VN_PAY: "VN Pay",
  VIETCOMBANK: "Vietcombank",
}

export function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("ALL")
  const [startDate, setStartDate] = useState<string>("") // Ngày bắt đầu
  const [endDate, setEndDate] = useState<string>("") // Ngày kết thúc

  const formatDateForAPI = (date: string) => {
    const d = new Date(date)
    return d.toISOString().split("T")[0] // Chỉ lấy phần `YYYY-MM-DD`
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        const url = `/payments/history?page=${currentPage}&search=${searchQuery}&type=${
          activeTab !== "ALL" ? activeTab : ""
        }&startDate=${startDate ? formatDateForAPI(startDate) : ""}&endDate=${
          endDate ? formatDateForAPI(endDate) : ""
        }`
        console.log("Fetching transactions from:", url) // Log URL để kiểm tra
        const res = await api.get(url)
        if (res.data?.success) {
          setTransactions(res.data.data)
          setTotalPages(res.data.totalPages || 1)
        } else {
          setError("Không thể tải dữ liệu giao dịch.")
        }
      } catch (err) {
        console.error("Lỗi khi tải lịch sử giao dịch:", err)
        setError("Đã xảy ra lỗi khi tải dữ liệu.")
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [currentPage, searchQuery, activeTab, startDate, endDate])

  useEffect(() => {
    let filtered = transactions

    // Lọc theo tab
    if (activeTab !== "ALL") {
      filtered = filtered.filter((transaction) => transaction.paymentType === activeTab)
    }

    // Lọc theo khoảng thời gian
    if (startDate) {
      filtered = filtered.filter(
        (transaction) => new Date(transaction.transactionDate) >= new Date(startDate)
      )
    }
    if (endDate) {
      filtered = filtered.filter(
        (transaction) => new Date(transaction.transactionDate) <= new Date(endDate)
      )
    }

    setFilteredTransactions(filtered)
  }, [transactions, activeTab, startDate, endDate])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Lịch sử giao dịch</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {TRANSACTION_TABS.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "outline"}
              onClick={() => {
                setActiveTab(tab.key)
                setCurrentPage(1) // Reset về trang đầu khi đổi tab
              }}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Search Bar & Date Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo mã giao dịch hoặc mã đơn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Date Filters */}
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Từ ngày"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="Đến ngày"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredTransactions.length === 0 ? (
          <p className="text-center text-muted-foreground">Không có giao dịch nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã giao dịch</TableHead>
                  <TableHead>Mã đơn</TableHead>
                  <TableHead>Ngày giao dịch</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Loại giao dịch</TableHead>
                  <TableHead>Phương thức</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.paymentId}>
                    <TableCell>{transaction.paymentId}</TableCell>
                    <TableCell>{transaction.bookingId}</TableCell>
                    <TableCell>{formatDate(transaction.transactionDate)}</TableCell>
                    <TableCell>{transaction.amount.toLocaleString()} VND</TableCell>
                    <TableCell>
                      <Badge className={paymentTypeLabels[transaction.paymentType]?.color || "bg-gray-300"}>
                        {paymentTypeLabels[transaction.paymentType]?.label || transaction.paymentType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {paymentMethodLabels[transaction.method] || transaction.method}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </Card>
  )
}