"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Search, Eye, CheckCircle, Calendar, AlertTriangle, Clock, XCircle, FileWarning, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
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

  const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
    RESOLVED: { label: "Đã xử lý", color: "text-green-600", bgColor: "bg-green-100", icon: CheckCircle },
    PENDING: { label: "Chờ xử lý", color: "text-amber-600", bgColor: "bg-amber-100", icon: Clock },
    REJECTED: { label: "Từ chối", color: "text-red-600", bgColor: "bg-red-100", icon: XCircle },
  }

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === "PENDING").length,
    resolved: reports.filter(r => r.status === "RESOLVED").length,
    rejected: reports.filter(r => r.status === "REJECTED").length,
  }

  return (
    <div className="h-full w-full overflow-auto">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Quản lý báo cáo sự cố</h1>
              <p className="text-sm text-muted-foreground">Theo dõi và xử lý các sự cố phương tiện</p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo mã hoặc mô tả..."
              className="pl-10 w-72"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng báo cáo</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <FileWarning className="w-8 h-8 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Chờ xử lý</p>
                  <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-amber-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Đã xử lý</p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Từ chối</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách báo cáo</CardTitle>
            <CardDescription>Hiển thị {filtered.length} báo cáo</CardDescription>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex gap-4 p-4 border rounded-lg">
                    <div className="w-24 h-16 bg-slate-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-500 mb-4">{error}</p>
                {error.includes("đăng nhập") && (
                  <Button onClick={() => (window.location.href = "/login")}>Đăng nhập lại</Button>
                )}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileWarning className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Không có báo cáo nào</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((r) => {
                  const status = statusConfig[r.status] || statusConfig.PENDING
                  const StatusIcon = status.icon

                  return (
                    <div
                      key={r.reportId}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition cursor-pointer"
                      onClick={() => handleViewDetail(r)}
                    >
                      {/* Ảnh */}
                      <div className="flex-shrink-0">
                        {r.incidentImageUrl ? (
                          <img
                            src={r.incidentImageUrl}
                            alt={`Ảnh báo cáo ${r.reportId}`}
                            className="w-24 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = "/images/no-image.png"
                            }}
                          />
                        ) : (
                          <div className="w-24 h-16 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <ImageIcon className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Nội dung */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">#{r.reportId}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">Booking #{r.bookingId}</span>
                        </div>
                        <p className="text-sm text-foreground line-clamp-2">{r.description}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(r.incidentDate).toLocaleDateString("vi-VN")}</span>
                        </div>
                      </div>

                      {/* Trạng thái & Actions */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${status.bgColor}`}>
                          <StatusIcon className={`w-4 h-4 ${status.color}`} />
                          <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
                        </div>

                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button variant="outline" size="sm" onClick={() => handleViewDetail(r)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          {r.status === "PENDING" && (
                            <Button
                              size="sm"
                              className="bg-green-500 hover:bg-green-600"
                              onClick={() => handleUpdateStatus(r.reportId, "RESOLVED")}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Chi tiết báo cáo #{selectedReport?.reportId}
              </DialogTitle>
              <DialogDescription>Thông tin chi tiết về sự cố</DialogDescription>
            </DialogHeader>

            {selectedReport && (
              <div className="space-y-4">
                {/* Ảnh sự cố */}
                {selectedReport.incidentImageUrl ? (
                  <div className="rounded-lg overflow-hidden border">
                    <img
                      src={selectedReport.incidentImageUrl}
                      alt="ảnh sự cố"
                      className="w-full max-h-[400px] object-contain bg-slate-100"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/images/no-image.png"
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <div className="text-center text-muted-foreground">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Không có ảnh đính kèm</p>
                    </div>
                  </div>
                )}

                {/* Thông tin chi tiết */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Mã báo cáo</p>
                    <p className="font-semibold">#{selectedReport.reportId}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Booking ID</p>
                    <p className="font-semibold">#{selectedReport.bookingId}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Ngày xảy ra</p>
                    <p className="font-semibold">{new Date(selectedReport.incidentDate).toLocaleString("vi-VN")}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Trạng thái</p>
                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${statusConfig[selectedReport.status]?.bgColor || "bg-gray-100"}`}>
                      {(() => {
                        const StatusIcon = statusConfig[selectedReport.status]?.icon || Clock
                        return <StatusIcon className={`w-3 h-3 ${statusConfig[selectedReport.status]?.color || "text-gray-600"}`} />
                      })()}
                      <span className={`text-sm font-medium ${statusConfig[selectedReport.status]?.color || "text-gray-600"}`}>
                        {statusConfig[selectedReport.status]?.label || selectedReport.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mô tả */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Mô tả sự cố</p>
                  <p className="text-sm leading-relaxed">{selectedReport.description}</p>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2">
                  {selectedReport.status === "PENDING" && (
                    <Button
                      className="bg-green-500 hover:bg-green-600 gap-2"
                      onClick={() => {
                        handleUpdateStatus(selectedReport.reportId, "RESOLVED")
                        setIsDialogOpen(false)
                      }}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Đánh dấu đã xử lý
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Đóng
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
