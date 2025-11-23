"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, Download, DollarSign, RefreshCw, TrendingUp, Activity } from "lucide-react"
import { MetricCard } from "./MetricCard"
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
import { getDashboardMetrics, DashboardMetricsResponse } from "@/lib/adminApi"

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
  const [year, setYear] = useState(2025)
  const [month, setMonth] = useState("1")

  const [orderData, setOrderData] = useState<{ month: string; orders: number }[]>([])
  const [metrics, setMetrics] = useState<DashboardMetricsResponse | null>(null)
  const [metricsLoading, setMetricsLoading] = useState(false)

  // Load stations
  useEffect(() => {
    const loadStations = async () => {
      try {
        const res = await api.get("/station/showall")
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

  // Load dashboard metrics
  useEffect(() => {
    const loadMetrics = async () => {
      setMetricsLoading(true)
      try {
        const station = stations.find(s => s.stationName === selectedStation)
        const data = await getDashboardMetrics({
          year,
          stationId: station?.stationId || null
        })
        setMetrics(data)
      } catch (err) {
        console.error("Lỗi load metrics:", err)
      } finally {
        setMetricsLoading(false)
      }
    }
    if (selectedStation) loadMetrics()
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
      } catch (err: any) {
        console.error("Lỗi API orders:", err)
        console.error("Response:", err.response?.data)
        setOrderData([]) // Clear data on error
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

        {/* Dashboard Metrics Cards */}
        {metricsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded w-32"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : metrics ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Tổng Doanh Thu"
              value={metrics.totalRevenue}
              color="green"
              icon={<DollarSign />}
              formatValue={(val) => `${Number(val).toLocaleString()} VND`}
            />
            <MetricCard
              title="Tổng Hoàn Tiền"
              value={metrics.totalRefunds}
              color="red"
              icon={<RefreshCw />}
              formatValue={(val) => `${Number(val).toLocaleString()} VND`}
            />
            <MetricCard
              title="Dòng Tiền Ròng"
              value={metrics.netCashFlow}
              color="blue"
              icon={<TrendingUp />}
              formatValue={(val) => `${Number(val).toLocaleString()} VND`}
            />
            <MetricCard
              title="Số Giao Dịch"
              value={metrics.transactionCount}
              color="purple"
              icon={<Activity />}
            />
          </div>
        ) : null}

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

          <Select value={year.toString()} onValueChange={(v) => setYear(parseInt(v))}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Năm" />
            </SelectTrigger>
            <SelectContent>
              {[2023, 2024, 2025, 2026].map(y => (
                <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Orders Chart - Full Width */}
        <Card>
          <CardHeader>
            <CardTitle>Số đơn hoàn thành theo tháng</CardTitle>
            <CardDescription>Đơn vị: đơn</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={orderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`${value} đơn`, 'Số đơn hoàn thành']}
                />
                <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
