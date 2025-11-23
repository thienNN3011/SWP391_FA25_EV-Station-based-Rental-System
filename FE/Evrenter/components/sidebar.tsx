"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { DollarSign, Clock, Leaf, MapPin } from "lucide-react"
import { api } from "@/lib/api"

export function Sidebar() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [modalContent, setModalContent] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/users/me/stats")
        if (res.data?.success) {
          setStats(res.data.data)
        }
      } catch (err) {
        console.error("Lỗi khi tải thống kê:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <p className="text-center text-muted-foreground">Đang tải dữ liệu...</p>
  }

  if (!stats) {
    return <p className="text-center text-red-500">Không có dữ liệu thống kê.</p>
  }

  const totalHours = (stats.totalDurationMinutes / 60).toFixed(1)
  const co2SavedKg = (stats.totalDistanceKm * 0.12).toFixed(1)

  const handleOpenModal = (content: string) => {
    setModalContent(content)
  }

  const handleCloseModal = () => {
    setModalContent(null)
  }

  return (
    <div className="space-y-6">
      {/* Lịch sử chi tiêu */}
      <Card>
        <CardHeader className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">Lịch sử chi tiêu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalRevenue?.toLocaleString() || 0} VND</div>
          <p className="text-xs text-muted-foreground">Tổng số tiền đã chi tiêu</p>
          <Button
            variant="link"
            className="text-sm text-primary mt-2"
            onClick={() => handleOpenModal("Lịch sử chi tiêu")}
          >
            Xem chi tiết
          </Button>
        </CardContent>
      </Card>

      {/* Thời gian thuê xe */}
      <Card>
        <CardHeader className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">Thời gian thuê xe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalHours} giờ</div>
          <p className="text-xs text-muted-foreground">Thời gian thuê xe thực tế</p>
          <Button
            variant="link"
            className="text-sm text-primary mt-2"
            onClick={() => handleOpenModal("Thời gian thuê xe")}
          >
            Xem chi tiết
          </Button>
        </CardContent>
      </Card>

      {/* Số cây xanh đã trồng */}
      <Card>
        <CardHeader className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-green-500" />
          <CardTitle className="text-sm font-medium">Số cây xanh đã trồng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {Math.round(Number(co2SavedKg) / 20)} cây
          </div>
          <p className="text-xs text-muted-foreground">Tương đương lượng CO₂ giảm thải</p>
          <Button
            variant="link"
            className="text-sm text-primary mt-2"
            onClick={() => handleOpenModal("Số cây xanh đã trồng")}
          >
            Xem chi tiết
          </Button>
        </CardContent>
      </Card>

      {/* Tổng quãng đường di chuyển */}
      <Card>
        <CardHeader className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">Tổng quãng đường</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalDistanceKm.toFixed(1)} km</div>
          <p className="text-xs text-muted-foreground">Tổng quãng đường di chuyển thực tế</p>
          <Button
            variant="link"
            className="text-sm text-primary mt-2"
            onClick={() => handleOpenModal("Tổng quãng đường di chuyển")}
          >
            Xem chi tiết
          </Button>
        </CardContent>
      </Card>

      {/* Modal */}
      {modalContent && (
        <Modal title={modalContent} onClose={handleCloseModal}>
          <p className="text-sm text-muted-foreground">
            Hiển thị chi tiết cho mục: <strong>{modalContent}</strong>.
          </p>
          {/* Thêm nội dung chi tiết cho từng mục ở đây */}
        </Modal>
      )}
    </div>
  )
}