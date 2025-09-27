import { useState } from 'react'
import { TrendingUp, Calendar, Download, Filter } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'

// Mock data cho doanh thu
const monthlyRevenueData = [
  { month: 'T1', revenue: 145, profit: 45, orders: 89 },
  { month: 'T2', revenue: 189, profit: 62, orders: 125 },
  { month: 'T3', revenue: 180, profit: 58, orders: 118 },
  { month: 'T4', revenue: 201, profit: 68, orders: 135 },
  { month: 'T5', revenue: 156, profit: 51, orders: 102 },
  { month: 'T6', revenue: 215, profit: 72, orders: 142 },
  { month: 'T7', revenue: 230, profit: 78, orders: 156 },
  { month: 'T8', revenue: 245, profit: 85, orders: 168 },
  { month: 'T9', revenue: 240, profit: 82, orders: 162 },
  { month: 'T10', revenue: 255, profit: 89, orders: 175 },
  { month: 'T11', revenue: 265, profit: 92, orders: 182 },
  { month: 'T12', revenue: 280, profit: 98, orders: 195 }
]

const branchRevenueData = [
  { name: 'Chi nhánh Q1', revenue: 85.2, percent: 32, color: '#0088FE' },
  { name: 'Chi nhánh Q7', revenue: 95.4, percent: 36, color: '#00C49F' },
  { name: 'Chi nhánh Q3', revenue: 62.8, percent: 24, color: '#FFBB28' },
  { name: 'Chi nhánh Q5', revenue: 21.6, percent: 8, color: '#FF8042' }
]

const vehicleTypeRevenueData = [
  { type: 'VF e34', revenue: 120.5, orders: 145 },
  { type: 'VF 8', revenue: 98.3, orders: 89 },
  { type: 'VF 9', revenue: 85.7, orders: 112 },
  { type: 'VF 5', revenue: 55.5, orders: 87 },
  { type: 'VF 3', revenue: 35.5, orders: 54 }
]

const dailyRevenueData = [
  { day: '1', revenue: 8.5 },
  { day: '2', revenue: 12.3 },
  { day: '3', revenue: 15.7 },
  { day: '4', revenue: 9.8 },
  { day: '5', revenue: 18.2 },
  { day: '6', revenue: 22.4 },
  { day: '7', revenue: 19.6 },
  { day: '8', revenue: 16.3 },
  { day: '9', revenue: 21.1 },
  { day: '10', revenue: 25.8 },
  { day: '11', revenue: 23.2 },
  { day: '12', revenue: 20.9 },
  { day: '13', revenue: 24.6 },
  { day: '14', revenue: 28.3 },
  { day: '15', revenue: 26.7 }
]

const topCustomersData = [
  { name: "Hoàng Văn Em", totalSpent: "35.600.000 VNĐ", orders: 12, avgOrder: "2.970.000 VNĐ" },
  { name: "Lê Văn Cường", totalSpent: "20.100.000 VNĐ", orders: 8, avgOrder: "2.510.000 VNĐ" },
  { name: "Nguyễn Văn An", totalSpent: "12.500.000 VNĐ", orders: 5, avgOrder: "2.500.000 VNĐ" },
  { name: "Trần Thị Bình", totalSpent: "8.200.000 VNĐ", orders: 3, avgOrder: "2.730.000 VNĐ" },
  { name: "Phạm Thị Dung", totalSpent: "2.800.000 VNĐ", orders: 1, avgOrder: "2.800.000 VNĐ" }
]

export function RevenueManagement() {
  const [timeFilter, setTimeFilter] = useState('year')
  const [branchFilter, setBranchFilter] = useState('all')

  // Số liệu cụ thể để làm ví dụ  
  const totalOrders = 1567

  return (
    <div className="h-full w-full overflow-auto">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl">Doanh thu & Thống kê</h1>
            <p className="text-muted-foreground">Theo dõi và phân tích doanh thu của hệ thống</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-32">
                <Calendar className="size-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Hôm nay</SelectItem>
                <SelectItem value="week">Tuần này</SelectItem>
                <SelectItem value="month">Tháng này</SelectItem>
                <SelectItem value="year">Năm này</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Download className="size-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Tổng doanh thu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl flex items-center gap-2">
                <TrendingUp className="size-5 text-green-600" />
                2.65 tỷ VNĐ
              </div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="size-3 mr-1" />
                +12% so với năm trước
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Lợi nhuận</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-blue-600">795 triệu VNĐ</div>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <TrendingUp className="size-3 mr-1" />
                +15% so với năm trước
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Tổng đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{totalOrders.toLocaleString()}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="size-3 mr-1" />
                +8% so với năm trước
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Giá trị đơn TB</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">1.69 triệu VNĐ</div>
              <p className="text-xs text-purple-600 flex items-center mt-1">
                <TrendingUp className="size-3 mr-1" />
                +5% so với năm trước
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Xu hướng doanh thu theo tháng</CardTitle>
              <CardDescription>Triệu VNĐ</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="profit" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Branch Revenue Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Doanh thu theo chi nhánh</CardTitle>
              <CardDescription>Phần trăm đóng góp</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={branchRevenueData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name.replace('Chi nhánh ', '')} ${percent}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="revenue"
                  >
                    {branchRevenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} triệu VNĐ`, 'Doanh thu']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vehicle Type Revenue */}
          <Card>
            <CardHeader>
              <CardTitle>Doanh thu theo loại xe</CardTitle>
              <CardDescription>So sánh hiệu suất các loại xe</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={vehicleTypeRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Daily Revenue */}
          <Card>
            <CardHeader>
              <CardTitle>Doanh thu 15 ngày gần nhất</CardTitle>
              <CardDescription>Triệu VNĐ</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Customers */}
          <Card>
            <CardHeader>
              <CardTitle>Khách hàng có doanh thu cao nhất</CardTitle>
              <CardDescription>Top 5 khách hàng theo tổng chi tiêu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCustomersData.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">{customer.orders} đơn hàng</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{customer.totalSpent}</p>
                      <p className="text-sm text-muted-foreground">TB: {customer.avgOrder}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Revenue by Branch Details */}
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết doanh thu chi nhánh</CardTitle>
              <CardDescription>Hiệu suất từng chi nhánh trong tháng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {branchRevenueData.map((branch, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{branch.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {branch.percent}% tổng doanh thu
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{branch.revenue} triệu VNĐ</p>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${branch.percent * 2.5}%`, 
                            backgroundColor: branch.color 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}