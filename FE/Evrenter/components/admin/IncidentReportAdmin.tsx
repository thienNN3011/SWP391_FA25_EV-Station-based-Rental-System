"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Search, Eye, Edit, Calendar, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface IncidentReport {
  reportId: number
  bookingId: number
  incidentDate: string
  description: string
  incidentImageUrl?: string
  status: string
}

export default function IncidentReportAdmin() {
  const [reports, setReports] = useState<IncidentReport[]>([])
  const [search, setSearch] = useState("")
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    setLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Chưa đăng nhập hoặc token không tồn tại")

      const response = await fetch("http://localhost:8080/EVRental/incidentreport/showall", {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        if (response.status === 403) throw new Error("Bạn không có quyền xem danh sách báo cáo")
        else throw new Error("Không thể kết nối đến máy chủ")
      }

      const data = await response.json()
      if (data.success) setReports(data.data || [])
      else setError(data.message || "Không thể tải dữ liệu")
    } catch (err: any) {
      console.error("Lỗi khi tải danh sách báo cáo:", err)
      setError(err.message || "Lỗi không xác định")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (reportId: number, status: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Chưa đăng nhập hoặc token không tồn tại")

      const res = await api.put(
        "/incidentreport/update",
        { reportId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (res.data.success) {
        // bạn có thể đổi thành toast nếu muốn
        alert(`Đã cập nhật trạng thái thành ${status}!`)
        fetchReports()
      } else {
        alert("Cập nhật thất bại!")
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err)
      alert("Cập nhật thất bại")
    }
  }

  const handleViewDetail = (report: IncidentReport) => {
    setSelectedReport(report)
    setIsDialogOpen(true)
  }

  const filtered = reports.filter(
    (r) =>
      r.reportId.toString().includes(search) ||
      r.description?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="h-full w-full overflow-auto">
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold flex items-center gap-2">
              <AlertTriangle className="text-red-500 w-6 h-6" /> Quản lý báo cáo tai nạn
            </h1>
            <p className="text-muted-foreground">Theo dõi và xử lý sự cố phương tiện</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo mã/miêu tả"
                className="pl-8 w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách báo cáo</CardTitle>
            <CardDescription>Báo cáo sự cố gần đây</CardDescription>
          </CardHeader>

          <CardContent className="overflow-visible">
            {loading ? (
              <p>Đang tải...</p>
            ) : error ? (
              <div className="text-red-500 space-y-2">
                <p>{error}</p>
                {error.includes("đăng nhập") && (
                  <Button onClick={() => (window.location.href = "/login")}>Đăng nhập lại</Button>
                )}
              </div>
            ) : null}

            {!loading && !error && (
              <Table>
                {/* Header: bổ sung cột Ảnh và cột checkbox (Đã xử lý) */}
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Ảnh</TableHead>
                    <TableHead className="max-w-[350px]">Mô tả</TableHead>
                    <TableHead>Ngày xảy ra</TableHead>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-center">Đã xử lý</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.reportId}>
                      <TableCell className="font-medium">{r.reportId}</TableCell>

                      {/* Ảnh thumbnail */}
                      <TableCell>
                        {r.incidentImageUrl ? (
                          <img
                            src={r.incidentImageUrl}
                            alt={`Ảnh báo cáo ${r.reportId}`}
                            className="w-20 h-12 object-cover rounded-md"
                            onError={(e) => {
                              ;(e.currentTarget as HTMLImageElement).src = "/images/no-image.png"
                            }}
                          />
                        ) : (
                          <div className="w-20 h-12 flex items-center justify-center text-xs text-muted-foreground bg-muted rounded-md">
                            No image
                          </div>
                        )}
                      </TableCell>

                      {/* Mô tả */}
                      <TableCell className="max-w-[350px]">
                        <div className="text-sm leading-tight text-foreground truncate">{r.description}</div>
                      </TableCell>

                      {/* Ngày */}
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" /> {new Date(r.incidentDate).toLocaleDateString("vi-VN")}
                        </div>
                      </TableCell>

                      <TableCell>{r.bookingId}</TableCell>

                      {/* Badge trạng thái */}
                      <TableCell>
                        <Badge
  variant={
    r.status === "RESOLVED" ? "default" :
    r.status === "PENDING" ? "secondary" :
    r.status === "REJECTED" ? "destructive" :
    "default"
  }
>
  {r.status === "RESOLVED" ? "Đã xử lý" :
   r.status === "PENDING" ? "Chờ xử lý" :
   r.status === "REJECTED" ? "Từ chối" :
   r.status}
</Badge>

                      </TableCell>

                      {/* Checkbox để admin tick */}
                    <TableCell className="text-center">
  <input
    type="checkbox"
    checked={r.status === "RESOLVED"}
    disabled={r.status === "RESOLVED"} // ko cho đổi từ resolve sang dis
    onChange={() => handleUpdateStatus(r.reportId, "RESOLVED")}
    aria-label={`Đánh dấu báo cáo ${r.reportId} là đã xử lý`}
  />
</TableCell>


                      {/* Thao tác: Xem chi tiết / (nút Đã xử lý thành backup) */}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewDetail(r)} className="flex items-center">
                            <Eye className="w-4 h-4 mr-2" /> Xem
                          </Button>

                          {r.status !== "RESOLVED" && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleUpdateStatus(r.reportId, "RESOLVED")}
                              className="flex items-center"
                            >
                              <Edit className="w-4 h-4 mr-2" /> Đã xử lý
                            </Button>
                          )}
                        </div>
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
              <DialogTitle>Chi tiết báo cáo</DialogTitle>
              <DialogDescription>Xem thông tin chi tiết về báo cáo sự cố</DialogDescription>
            </DialogHeader>

            {selectedReport && (
              <div className="space-y-4">
                <p>
                  <strong>ID:</strong> {selectedReport.reportId}
                </p>
                <p>
                  <strong>Booking ID:</strong> {selectedReport.bookingId}
                </p>
                <p>
                  <strong>Mô tả:</strong> {selectedReport.description}
                </p>
                <p>
                  <strong>Ngày xảy ra:</strong> {new Date(selectedReport.incidentDate).toLocaleString("vi-VN")}
                </p>

                {selectedReport.incidentImageUrl ? (
                  <div className="flex justify-center">
                    <img
                      src={selectedReport.incidentImageUrl}
                      alt="ảnh sự cố"
                      className="max-w-full max-h-[60vh] object-contain rounded"
                      onError={(e) => {
                        ;(e.currentTarget as HTMLImageElement).src = "/images/no-image.png"
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-center text-sm text-muted-foreground">Không có ảnh</div>
                )}

                <p>
                  <strong>Trạng thái:</strong> {selectedReport.status}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Đóng
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
