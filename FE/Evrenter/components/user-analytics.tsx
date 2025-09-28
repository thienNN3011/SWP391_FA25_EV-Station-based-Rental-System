"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Leaf, DollarSign, Car, Battery } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

// Mock analytics data
const monthlyUsage = [
  { month: "Aug", rentals: 2, cost: 145 },
  { month: "Sep", rentals: 4, cost: 287 },
  { month: "Oct", rentals: 6, cost: 423 },
  { month: "Nov", rentals: 5, cost: 356 },
  { month: "Dec", rentals: 4, cost: 298 },
  { month: "Jan", rentals: 7, cost: 487 },
]

export function UserAnalytics() {
  return (
    <div className="space-y-6">
      {/* Monthly Usage Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Thống kê tháng</CardTitle>
          <CardDescription>Hoạt dộng thuê xe của bạn trong 6 tháng qua</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyUsage}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
              <YAxis className="text-xs fill-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Bar dataKey="rentals" fill="hsl(var(--secondary))" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Environmental Impact */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-green-800">
            <Leaf className="h-5 w-5" />
            Tác động đến môi trường
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">giảm 100g</div>
              <div className="text-sm text-green-700">CO₂ ra môi trường</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">tiết kiệm 100,000 VND</div>
              <div className="text-sm text-green-700">chi phí xăng, dầu</div>
            </div>
          </div>  

          <div className="p-3 bg-green-100 rounded-lg">
            <div className="flex items-center gap-2 text-green-800 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">Rất tốt!</span>
            </div>
            <p className="text-xs text-green-700 mt-1">
              Bạn đã ngăn chặn được lượng khí thải tương đương với việc đốt 5L xăng.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Thống kê nhanh</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Xe yêu thích</span>
            </div>
            <Badge variant="secondary">VinFast VF7</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Chi phí trung bình</span>
            </div>
            <span className="text-sm font-medium">100.000 VND</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Tham gia</span>
            </div>
            <span className="text-sm font-medium">Tháng 1 năm 2025</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
