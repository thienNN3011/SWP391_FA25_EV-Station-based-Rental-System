"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Clock, MapPin, Leaf } from "lucide-react"
import { api } from "@/lib/api"

interface Vehicle {
  plateNumber: string
  stationName: string
  modelName: string
  brand: string
  bookingsCount: number
  distanceKm: number
}

interface Stats {
  totalBookingCompleted: number
  totalDistanceKm: number
  totalDurationMinutes: number
  vehicles: Vehicle[]
}

export function DashboardOverview() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/users/me/stats")
        if (res.data?.success) {
          const d = res.data.data
          setStats({
            totalBookingCompleted: d.totalBookingCompleted || 0,
            totalDistanceKm: d.totalDistanceKm || 0,
            totalDurationMinutes: d.totalDurationMinutes || 0,
            vehicles: d.vehicles || [],
          })
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

  return (
    <div className="space-y-8">
     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
       
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số lần thuê</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookingCompleted}</div>
            <p className="text-xs text-muted-foreground">+2 so với tháng trước</p>
          </CardContent>
        </Card>

       
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng thời gian thuê</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours} giờ</div>
            <p className="text-xs text-muted-foreground">{stats.totalDurationMinutes} phút tổng cộng</p>
          </CardContent>
        </Card>

        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng quãng đường</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDistanceKm.toFixed(1)} km</div>
            <p className="text-xs text-muted-foreground">+km so với tháng trước, chưa có data chỗ này</p>
          </CardContent>
        </Card>

        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CO₂ giảm thải</CardTitle>
            <Leaf className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{co2SavedKg} kg</div>
            <p className="text-xs text-muted-foreground">
              Tương đương {Math.round(Number(co2SavedKg) / 20)} cây xanh 🌳
            </p>
          </CardContent>
        </Card>
      </div>

     
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Xe đã thuê gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.vehicles.length === 0 ? (
            <p className="text-sm text-muted-foreground">Chưa có dữ liệu xe đã thuê.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border-t border-gray-200">
                <thead>
                  <tr className="text-gray-500 border-b">
                    <th className="px-4 py-2">Biển số</th>
                    <th className="px-4 py-2">Mẫu xe</th>
                    <th className="px-4 py-2">Thương hiệu</th>
                    <th className="px-4 py-2">Trạm sạc</th>
                    <th className="px-4 py-2 text-center">Số lần thuê</th>
                    <th className="px-4 py-2 text-center">Quãng đường (km)</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.vehicles.map((v) => (
                    <tr key={v.plateNumber} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-2 font-medium">{v.plateNumber}</td>
                      <td className="px-4 py-2">{v.modelName}</td>
                      <td className="px-4 py-2">{v.brand}</td>
                      <td className="px-4 py-2">{v.stationName}</td>
                      <td className="px-4 py-2 text-center">{v.bookingsCount}</td>
                      <td className="px-4 py-2 text-center">{v.distanceKm.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
