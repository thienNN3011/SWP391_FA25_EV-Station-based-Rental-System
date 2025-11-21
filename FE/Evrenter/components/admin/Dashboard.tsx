"use client"

import { useEffect, useState } from "react"
import { Car, Users, UserCheck, DollarSign, TrendingUp, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts"

import { api } from "@/lib/api"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const statsData = [
  { title: "Tổng khách hàng", value: "1,234", change: "+12%", changeType: "increase", icon: Users, description: "So với tháng trước" },
  { title: "Tổng nhân viên", value: "45", change: "+2", changeType: "increase", icon: UserCheck, description: "Nhân viên đang hoạt động" },
  { title: "Tổng số xe", value: "89", change: "-3", changeType: "decrease", icon: Car, description: "Xe đang có sẵn: 67" },
  { title: "Doanh thu tháng", value: "245.800.000", change: "+18%", changeType: "increase", icon: DollarSign, description: "VNĐ" },
]

const vehicleTypeData = [
  { name: "VF e34", value: 35, color: "#0088FE" },
  { name: "VF 8", value: 28, color: "#00C49F" },
  { name: "VF 9", value: 20, color: "#FFBB28" },
  { name: "VF 5", value: 17, color: "#FF8042" },
]

const recentOrders = [
  { id: "ORD001", customer: "Nguyễn Văn A", vehicle: "VinFast VF e34", status: "Đang thuê", amount: "2.500.000 VNĐ" },
  { id: "ORD002", customer: "Trần Thị B", vehicle: "VinFast VF 8", status: "Hoàn thành", amount: "3.200.000 VNĐ" },
  { id: "ORD003", customer: "Lê Văn C", vehicle: "VinFast VF 9", status: "Chờ xử lý", amount: "2.800.000 VNĐ" },
  { id: "ORD004", customer: "Phạm Thị D", vehicle: "VinFast VF 5", status: "Đang thuê", amount: "4.100.000 VNĐ" },
]

export function Dashboard() {

  const [year, setYear] = useState("2025")
  const [month, setMonth] = useState("11")

  const [stations, setStations] = useState<any[]>([])
  const [selectedStation, setSelectedStation] = useState<string>("")

  const [revenueData, setRevenueData] = useState<any[]>([])
  const [bookingStats, setBookingStats] = useState<any[]>([])


  // LOAD STATIONS
  useEffect(() => {
    const loadStations = async () => {
      try {
        const res = await api.get("/showactivestation")
        if (res.data.success) {
          const list = res.data.data ?? []
          setStations(list)

          const saved = localStorage.getItem("selectedStation")

          if (saved) {
            setSelectedStation(saved)
          } else if (list.length > 0) {
            setSelectedStation(list[0].stationName)
            localStorage.setItem("selectedStation", list[0].stationName)
          }
        }
      } catch (err) {
        console.error("Lỗi load station:", err)
      }
    }
    loadStations()
  }, [])


  // LOAD REVENUE
  useEffect(() => {
    if (!selectedStation) return
    const station = stations.find(s => s.stationName === selectedStation)

    const loadRevenue = async () => {
      try {
        const res = await api.post("/payments/revenue", {
          stationId: station?.stationId,
          stationName: selectedStation,
          year: year
        })

        const formatted = (res.data.data || []).map((item: any) => ({
          month: `T${item.month}`,
          revenue: item.revenue / 1_000_000,
        }))

        setRevenueData(formatted)
      } catch (err) {
        console.error("Lỗi API:", err)
      }
    }

    loadRevenue()
  }, [selectedStation, year, stations])


  // LOAD BOOKING COMPLETED
  useEffect(() => {
    if (!selectedStation || !month || !year) return
    const station = stations.find(s => s.stationName === selectedStation)

    const loadBookingStats = async () => {
      try {
        const res = await api.post("/bookings/stats/monthly-completed", {
          stationId: station?.stationId,
          stationName: selectedStation,
          month: Number(month),
          year: year,
        })

        const breakdown = res.data.data?.stationBreakdown ?? []

        const formatted = breakdown.map((item: any) => ({
          station: item.stationName.replace(/^Station\s+/i, "Trạm "),
          completed: item.completedBookings,
        }))

        setBookingStats(formatted)
      } catch (err) {
        console.error("Lỗi load booking stats:", err)
      }
    }

    loadBookingStats()
  }, [selectedStation, year, month, stations])



  return (
    <div className="h-full w-full overflow-auto">
      <div className="p-4 md:p-6 space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl">Trang chủ</h1>
            <p className="text-muted-foreground">Tổng quan hệ thống thuê xe</p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="size-4 mr-2" />
              Hôm nay
            </Button>
            <Button size="sm">
              <TrendingUp className="size-4 mr-2" />
              Báo cáo
            </Button>
          </div>
        </div>


        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <span className={`mr-1 ${stat.changeType === "increase" ? "text-green-600" : "text-red-600"}`}>
                    {stat.change}
                  </span>
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>


        {/* MAIN CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Revenue */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Doanh thu theo tháng</CardTitle>
                <CardDescription>Triệu VNĐ</CardDescription>
              </div>

              <div className="flex gap-3">
                
                {/* Station select */}
                <Select
                  value={selectedStation}
                  onValueChange={(value) => {
                    setSelectedStation(value)
                    localStorage.setItem("selectedStation", value)
                  }}
                >
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

                {/* Year select */}
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Năm" />
                  </SelectTrigger>
                  <SelectContent>
                    {["2023", "2024", "2025", "2026"].map((y) => (
                      <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Month select */}
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Tháng" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(12)].map((_, i) => (
                      <SelectItem key={i+1} value={`${i+1}`}>
                        Tháng {i+1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

              </div>
            </CardHeader>

            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>


          {/* BOOKING COMPLETED BAR CHART */}
          <Card>
            <CardHeader>
              <CardTitle>Số đơn hoàn thành</CardTitle>
              <CardDescription>Tháng {month}/{year}</CardDescription>
            </CardHeader>

            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bookingStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="station" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>


     


        
      </div>
    </div>
  )
}
