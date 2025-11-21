"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, Download } from "lucide-react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line
} from "recharts"
import { api } from "@/lib/api"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function RevenueManagement() {
  const [stations, setStations] = useState<any[]>([])
  const [selectedStation, setSelectedStation] = useState<string>("")
  const [year, setYear] = useState("2025")
  const [month, setMonth] = useState("1")

  const [revenueData, setRevenueData] = useState<{ month: string; revenue: number }[]>([])
  const [orderData, setOrderData] = useState<{ month: string; orders: number }[]>([])

  // Load stations
  useEffect(() => {
    const loadStations = async () => {
      try {
        const res = await api.get("/showactivestation")
        if (res.data.success) {
          setStations(res.data.data ?? [])
          const first = res.data.data?.[0]?.stationName
          if (first) setSelectedStation(first)
        }
      } catch (err) {
        console.error("Lỗi load station:", err)
      }
    }
    loadStations()
  }, [])

  // Load revenue
  useEffect(() => {
    if (!selectedStation) return
    const station = stations.find(s => s.stationName === selectedStation)
    if (!station) return

    const loadRevenue = async () => {
      try {
        const res = await api.post("/payments/revenue", {
          stationId: station.stationId,
          stationName: selectedStation,
          year
        })
        const formatted = (res.data.data || []).map((item: any) => ({
          month: `T${item.month}`,
          revenue: item.revenue / 1_000_000, // Triệu VNĐ
        }))
        setRevenueData(formatted)
      } catch (err) {
        console.error("Lỗi API revenue:", err)
      }
    }

    loadRevenue()
  }, [selectedStation, year, stations])

  // Load orders
useEffect(() => {
  if (!selectedStation) return
  const station = stations.find(s => s.stationName === selectedStation)
  if (!station) return

  const loadOrders = async () => {
    try {
      const res = await api.post("/bookings/stats/yearly-completed", {
        stationName: selectedStation,
        year
      })

      const arr: { month: string; orders: number }[] = []

      // Map dữ liệu từng tháng
      for (let m = 1; m <= 12; m++) {
        const monthData = res.data.data.find((d: any) => d.month === m)
        arr.push({
          month: `T${m}`,
          orders: monthData?.completedBookings || 0
        })
      }

      setOrderData(arr)
    } catch (err) {
      console.error("Lỗi API orders:", err)
    }
  }

  loadOrders()
}, [selectedStation, year, stations])


  return (
    <div className="h-full w-full overflow-auto">
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl">Doanh thu & Thống kê</h1>
            <p className="text-muted-foreground">Phân tích dữ liệu bán hàng</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <CalendarDays className="size-4 mr-2" /> Chọn khoảng thời gian
            </Button>
            <Button>
              <Download className="size-4 mr-2" /> Xuất báo cáo
            </Button>
          </div>
        </div>

        {/* Chọn Trạm & Năm */}
        <div className="flex gap-4 mb-4">
          <Select value={selectedStation} onValueChange={setSelectedStation}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn trạm" />
            </SelectTrigger>
            <SelectContent>
              {stations.map((s: any) => (
                <SelectItem key={s.stationId} value={s.stationName}>
                  {s.stationName.replace(/^Station\s+/i, "Trạm ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Năm" />
            </SelectTrigger>
            <SelectContent>
              {["2023","2024","2025","2026"].map(y => (
                <SelectItem key={y} value={y}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue */}
          <Card>
            <CardHeader>
              <CardTitle>Doanh thu theo tháng</CardTitle>
              <CardDescription>Triệu VNĐ</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Số đơn hoàn thành theo tháng</CardTitle>
              <CardDescription>Đơn vị: đơn</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={orderData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
