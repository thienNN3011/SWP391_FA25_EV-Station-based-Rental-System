"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Clock, MapPin, Leaf, DollarSign, Flame, TrendingUp } from "lucide-react"
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
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null)

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

    const fetchTotalRevenue = async () => {
      try {
        const res = await api.get("/bookings/total-revenue")
        if (res.data?.success) {
          setTotalRevenue(res.data.data)
        }
      } catch (err) {
        console.error("Lỗi khi tải tổng doanh thu:", err)
      }
    }

    fetchStats()
    fetchTotalRevenue()
  }, [])

  const formatCurrency = (value: number | null) =>
    value !== null ? value.toLocaleString("vi-VN") + " VND" : "-"

  const renderLoadingState = () => (
    <Card>
      <CardContent className="py-10 text-center text-muted-foreground">
        Đang tải dữ liệu tổng quan...
      </CardContent>
    </Card>
  )

  if (loading) {
    return renderLoadingState()
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-red-500">
          Không có dữ liệu thống kê.
        </CardContent>
      </Card>
    )
  }

  const totalHours = (stats.totalDurationMinutes / 60).toFixed(1)
  const co2SavedKg = (stats.totalDistanceKm * 0.12).toFixed(1)
  const averageDistance = stats.vehicles.length
    ? (
        stats.vehicles.reduce((sum, v) => sum + v.distanceKm, 0) / stats.vehicles.length
      ).toFixed(1)
    : "0"
  const favoriteVehicle = stats.vehicles.reduce<Vehicle | null>((current, vehicle) => {
    if (!current) return vehicle
    return vehicle.bookingsCount > current.bookingsCount ? vehicle : current
  }, null)
  

  const insightCards = [
    {
      label: "Tổng thời gian thuê",
      value: `${totalHours} giờ`,
      subLabel: `${stats.totalDurationMinutes} phút tích lũy`,
      icon: Clock,
      accent: "text-sky-600",
    },
    {
      label: "Tổng quãng đường",
      value: `${stats.totalDistanceKm.toFixed(1)} km`,
      subLabel: `~${averageDistance} km / xe`,
      icon: MapPin,
      accent: "text-emerald-600",
    },
    {
      label: "CO₂ giảm thải",
      value: `${co2SavedKg} kg`,
      subLabel: `≈ ${Math.round(Number(co2SavedKg) / 20)} cây xanh`,
      icon: Leaf,
      accent: "text-lime-600",
    },
    {
      label: "Tổng chi tiêu",
      value: formatCurrency(totalRevenue),
      subLabel: "Tất cả đơn thuê đã hoàn tất",
      icon: DollarSign,
      accent: "text-amber-600",
    },
  ]

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2 bg-gradient-to-br from-sky-500 via-sky-600 to-indigo-600 text-white border-none shadow-xl">
          <CardHeader className="pb-0">
            <CardTitle className="text-base uppercase tracking-wide text-white/80">
              Tổng quan hành trình thuê xe
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm text-white/70">Tổng số lần thuê</p>
              <p className="text-4xl font-semibold mt-2">{stats.totalBookingCompleted}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-emerald-200">
                <TrendingUp className="h-4 w-4" />
                Duy trì thói quen di chuyển xanh
              </div>
            </div>
            <div>
              <p className="text-sm text-white/70">Tổng chi tiêu</p>
              <p className="text-3xl font-semibold mt-2">{formatCurrency(totalRevenue)}</p>
              <p className="text-xs text-white/70 mt-2">Bao gồm phí thuê và cọc</p>
            </div>
            <div>
              <p className="text-sm text-white/70">Quãng đường tích lũy</p>
              <p className="text-3xl font-semibold mt-2">{stats.totalDistanceKm.toFixed(1)} km</p>
              <p className="text-xs text-white/70 mt-2">Tương đương {co2SavedKg} kg CO₂ tránh phát thải</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-secondary/30 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-gray-800">Gợi ý cho bạn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {favoriteVehicle ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-sky-100 text-sky-600">
                    <Car className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Xe gần nhất bạn thuê</p>
                    <p className="font-semibold text-gray-900">{favoriteVehicle.modelName}</p>
                    <p className="text-xs text-muted-foreground">
                      {favoriteVehicle.brand} • {favoriteVehicle.stationName}
                    </p>
                  </div>
                </div>
                <div className="rounded-lg border border-dashed border-secondary/30 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Tổng số chuyến</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalBookingCompleted}</p>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">Bạn chưa có chuyến xe nào, hãy bắt đầu hành trình đầu tiên!</p>
            )}
            <div className="flex items-center gap-3 rounded-lg bg-secondary/10 p-3">
              <Flame className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Mẹo tiết kiệm</p>
                <p className="text-sm text-gray-700">
                  Thuê dài ngày với cùng mẫu xe giúp tối ưu chi phí và giảm số lần đặt lại.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {insightCards.map(({ label, value, subLabel, icon: Icon, accent }) => (
          <Card key={label} className="shadow-sm border border-gray-100 hover:shadow-md transition">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{label}</CardTitle>
              <Icon className={`h-5 w-5 ${accent}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{subLabel}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="shadow-lg border border-slate-100">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-800">Các đơn thuê gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.vehicles.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              Bạn chưa có dữ liệu xe đã thuê. Bắt đầu chuyến đi đầu tiên ngay hôm nay!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-500 border-y bg-gray-50">
                    <th className="px-4 py-2 font-medium">Biển số</th>
                    <th className="px-4 py-2 font-medium">Mẫu xe</th>
                    <th className="px-4 py-2 font-medium">Thương hiệu</th>
                    <th className="px-4 py-2 font-medium">Trạm sạc</th>
                    <th className="px-4 py-2 text-center font-medium">Số lần thuê</th>
                    <th className="px-4 py-2 text-center font-medium">Quãng đường (km)</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.vehicles.map((v) => (
                    <tr key={v.plateNumber} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-900">{v.plateNumber}</td>
                      <td className="px-4 py-3">{v.modelName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{v.brand}</td>
                      <td className="px-4 py-3 text-muted-foreground">{v.stationName}</td>
                      <td className="px-4 py-3 text-center font-medium text-gray-900">{v.bookingsCount}</td>
                      <td className="px-4 py-3 text-center font-medium text-gray-900">
                        {v.distanceKm.toFixed(1)}
                      </td>
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