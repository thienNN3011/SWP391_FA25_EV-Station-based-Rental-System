import { Car, Users, UserCheck, DollarSign, TrendingUp, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

// Mock data cho dashboard
const statsData = [
  {
    title: "Tổng khách hàng",
    value: "1,234",
    change: "+12%",
    changeType: "increase" as const,
    icon: Users,
    description: "So với tháng trước"
  },
  {
    title: "Tổng nhân viên",
    value: "45",
    change: "+2",
    changeType: "increase" as const,
    icon: UserCheck,
    description: "Nhân viên đang hoạt động"
  },
  {
    title: "Tổng số xe",
    value: "89",
    change: "-3",
    changeType: "decrease" as const,
    icon: Car,
    description: "Xe đang có sẵn: 67"
  },
  {
    title: "Doanh thu tháng",
    value: "245.800.000",
    change: "+18%",
    changeType: "increase" as const,
    icon: DollarSign,
    description: "VNĐ"
  }
]

const revenueData = [
  { month: 'T1', revenue: 65 },
  { month: 'T2', revenue: 89 },
  { month: 'T3', revenue: 80 },
  { month: 'T4', revenue: 81 },
  { month: 'T5', revenue: 56 },
  { month: 'T6', revenue: 95 },
  { month: 'T7', revenue: 110 },
  { month: 'T8', revenue: 125 },
  { month: 'T9', revenue: 140 },
  { month: 'T10', revenue: 135 },
  { month: 'T11', revenue: 155 },
  { month: 'T12', revenue: 165 }
]

const vehicleTypeData = [
  { name: 'VF e34', value: 35, color: '#0088FE' },
  { name: 'VF 8', value: 28, color: '#00C49F' },
  { name: 'VF 9', value: 20, color: '#FFBB28' },
  { name: 'VF 5', value: 17, color: '#FF8042' }
]

const recentOrders = [
  { id: "ORD001", customer: "Nguyễn Văn A", vehicle: "VinFast VF e34", status: "Đang thuê", amount: "2.500.000 VNĐ" },
  { id: "ORD002", customer: "Trần Thị B", vehicle: "VinFast VF 8", status: "Hoàn thành", amount: "3.200.000 VNĐ" },
  { id: "ORD003", customer: "Lê Văn C", vehicle: "VinFast VF 9", status: "Chờ xử lý", amount: "2.800.000 VNĐ" },
  { id: "ORD004", customer: "Phạm Thị D", vehicle: "VinFast VF 5", status: "Đang thuê", amount: "4.100.000 VNĐ" },
]

export function Dashboard() {
  return (
    <div className="h-full w-full overflow-auto">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
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

        {/* Stats Cards */}
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
                  <span className={`mr-1 ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Doanh thu theo tháng</CardTitle>
              <CardDescription>Triệu VNĐ</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value} triệu VNĐ`, 'Doanh thu']}
                    labelFormatter={(label) => `Tháng ${label.replace('T', '')}`}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Vehicle Types Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Phân bố loại xe</CardTitle>
              <CardDescription>Theo số lượng</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={vehicleTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {vehicleTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Đơn thuê gần đây</CardTitle>
            <CardDescription>5 đơn thuê mới nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                    </div>
                    <div>
                      <p className="text-sm">{order.vehicle}</p>
                      <p className="text-xs text-muted-foreground">Xe thuê</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium">{order.amount}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${
                        order.status === 'Đang thuê' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Hoàn thành' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}