"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, Download } from "lucide-react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts"

const monthlyRevenue = [
  { month: "T1", revenue: 65, orders: 120 },
  { month: "T2", revenue: 89, orders: 150 },
  { month: "T3", revenue: 80, orders: 140 },
  { month: "T4", revenue: 81, orders: 145 },
  { month: "T5", revenue: 56, orders: 100 },
  { month: "T6", revenue: 95, orders: 170 },
  { month: "T7", revenue: 110, orders: 190 },
  { month: "T8", revenue: 125, orders: 210 },
  { month: "T9", revenue: 140, orders: 230 },
  { month: "T10", revenue: 135, orders: 220 },
  { month: "T11", revenue: 155, orders: 250 },
  { month: "T12", revenue: 165, orders: 260 },
]

export function RevenueManagement() {
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Doanh thu theo tháng</CardTitle>
              <CardDescription>Triệu VNĐ</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Số đơn theo tháng</CardTitle>
              <CardDescription>Đơn vị: đơn</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyRevenue}>
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

