"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination } from "@/components/ui/pagination"
import { api } from "@/lib/api"

interface Transaction {
  id: string
  date: string
  amount: number
  type: string
  status: string
}

export function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/transactions?page=${currentPage}`)
        if (res.data?.success) {
          setTransactions(res.data.data.transactions)
          setTotalPages(res.data.data.totalPages)
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
  }, [currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Lịch sử giao dịch</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-muted-foreground">Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : transactions.length === 0 ? (
          <p className="text-center text-muted-foreground">Không có giao dịch nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã giao dịch</TableHead>
                  <TableHead>Ngày giao dịch</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Loại giao dịch</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell>{transaction.amount.toLocaleString()} VND</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>{transaction.status}</TableCell>
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