import { useState } from 'react'
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2, Filter, Calendar, Car, User, CreditCard } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Separator } from './ui/separator'

// Mock data cho đơn thuê
const orderData = [
  {
    id: "ORD001",
    customer: {
      id: "USR001",
      name: "Nguyễn Văn An",
      phone: "0987654321",
      email: "nguyen.van.an@email.com"
    },
    vehicle: {
      id: "VH001",
      licensePlate: "30A-12345",
      brand: "VinFast",
      model: "VF e34",
      type: "SUV điện cỡ nhỏ"
    },
    location: "Chi nhánh Quận 1",
    startDate: "2024-09-15",
    endDate: "2024-09-18",
    totalDays: 3,
    pricePerDay: "800.000",
    totalAmount: "2.400.000",
    deposit: "500.000",
    status: "active",
    paymentStatus: "paid",
    paymentMethod: "card",
    createdDate: "2024-09-14",
    notes: "Khách hàng VIP, ưu tiên phục vụ"
  },
  {
    id: "ORD002",
    customer: {
      id: "USR002",
      name: "Trần Thị Bình",
      phone: "0976543210",
      email: "tran.thi.binh@email.com"
    },
    vehicle: {
      id: "VH002",
      licensePlate: "30B-67890",
      brand: "VinFast",
      model: "VF 8",
      type: "SUV điện"
    },
    location: "Chi nhánh Quận 3",
    startDate: "2024-09-10",
    endDate: "2024-09-13",
    totalDays: 3,
    pricePerDay: "1.200.000",
    totalAmount: "3.600.000",
    deposit: "800.000",
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "transfer",
    createdDate: "2024-09-09",
    notes: ""
  },
  {
    id: "ORD003",
    customer: {
      id: "USR003",
      name: "Lê Văn Cường",
      phone: "0965432109",
      email: "le.van.cuong@email.com"
    },
    vehicle: {
      id: "VH004",
      licensePlate: "30D-22222",
      brand: "VinFast",
      model: "VF 5",
      type: "SUV điện cỡ A"
    },
    location: "Chi nhánh Quận 5",
    startDate: "2024-09-20",
    endDate: "2024-09-22",
    totalDays: 2,
    pricePerDay: "700.000",
    totalAmount: "1.400.000",
    deposit: "350.000",
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "cash",
    createdDate: "2024-09-18",
    notes: "Cần xác nhận trước 6h ngày 19/9"
  },
  {
    id: "ORD004",
    customer: {
      id: "USR004",
      name: "Phạm Thị Dung",
      phone: "0954321098",
      email: "pham.thi.dung@email.com"
    },
    vehicle: {
      id: "VH005",
      licensePlate: "30E-33333",
      brand: "VinFast",
      model: "VF 3",
      type: "Xe điện mini"
    },
    location: "Chi nhánh Quận 1",
    startDate: "2024-09-16",
    endDate: "2024-09-19",
    totalDays: 3,
    pricePerDay: "500.000",
    totalAmount: "1.500.000",
    deposit: "300.000",
    status: "active",
    paymentStatus: "partial",
    paymentMethod: "card",
    createdDate: "2024-09-15",
    notes: ""
  },
  {
    id: "ORD005",
    customer: {
      id: "USR005",
      name: "Hoàng Văn Em",
      phone: "0943210987",
      email: "hoang.van.em@email.com"
    },
    vehicle: {
      id: "VH003",
      licensePlate: "30C-11111",
      brand: "VinFast",
      model: "VF 9",
      type: "SUV điện cao cấp"
    },
    location: "Chi nhánh Quận 7",
    startDate: "2024-09-12",
    endDate: "2024-09-15",
    totalDays: 3,
    pricePerDay: "1.500.000",
    totalAmount: "4.500.000",
    deposit: "1.000.000",
    status: "cancelled",
    paymentStatus: "refunded",
    paymentMethod: "transfer",
    createdDate: "2024-09-11",
    notes: "Khách hàng hủy do lý do cá nhân"
  }
]

function OrderDialog({ order, isOpen, onClose }: { order?: any, isOpen: boolean, onClose: () => void }) {
  if (!order) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết đơn thuê #{order.id}</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết đơn thuê xe
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Customer Info */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <User className="size-4" />
              Thông tin khách hàng
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <Label className="text-sm text-muted-foreground">Họ tên</Label>
                <p>{order.customer.name}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Số đi���n thoại</Label>
                <p>{order.customer.phone}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-sm text-muted-foreground">Email</Label>
                <p>{order.customer.email}</p>
              </div>
            </div>
          </div>

          {/* Vehicle Info */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Car className="size-4" />
              Thông tin xe
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <Label className="text-sm text-muted-foreground">Xe thuê</Label>
                <p>{order.vehicle.brand} {order.vehicle.model}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Biển số</Label>
                <p>{order.vehicle.licensePlate}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Loại xe</Label>
                <p>{order.vehicle.type}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Điểm thuê</Label>
                <p>{order.location}</p>
              </div>
            </div>
          </div>

          {/* Rental Info */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Calendar className="size-4" />
              Thông tin thuê
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <Label className="text-sm text-muted-foreground">Ngày bắt đầu</Label>
                <p>{order.startDate}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Ngày kết thúc</Label>
                <p>{order.endDate}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Số ngày thuê</Label>
                <p>{order.totalDays} ngày</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Giá thuê/ngày</Label>
                <p>{order.pricePerDay} VNĐ</p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <CreditCard className="size-4" />
              Thông tin thanh toán
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <Label className="text-sm text-muted-foreground">Tổng tiền</Label>
                <p className="text-lg font-medium">{order.totalAmount} VNĐ</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Tiền cọc</Label>
                <p>{order.deposit} VNĐ</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Phương thức</Label>
                <p className="capitalize">{order.paymentMethod === 'card' ? 'Thẻ' : order.paymentMethod === 'transfer' ? 'Chuyển khoản' : 'Tiền mặt'}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Trạng thái thanh toán</Label>
                <Badge variant={order.paymentStatus === 'paid' ? 'default' : order.paymentStatus === 'pending' ? 'secondary' : 'destructive'}>
                  {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 
                   order.paymentStatus === 'pending' ? 'Chờ thanh toán' :
                   order.paymentStatus === 'partial' ? 'Thanh toán một phần' : 'Đã hoàn tiền'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div>
              <h3 className="font-medium mb-3">Ghi chú</h3>
              <p className="bg-gray-50 p-4 rounded-lg">{order.notes}</p>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Đóng</Button>
          <Button>Chỉnh sửa</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredOrders = orderData.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter
    return matchesSearch && matchesStatus && matchesPayment
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Đang thuê</Badge>
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Hoàn thành</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Chờ xử lý</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Đã hủy</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default" className="bg-green-100 text-green-800">Đã thanh toán</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Chờ thanh toán</Badge>
      case 'partial':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Một phần</Badge>
      case 'refunded':
        return <Badge variant="destructive">Đã hoàn tiền</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order)
    setIsDialogOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Quản lý đơn thuê</h1>
          <p className="text-muted-foreground">Quản lý và theo dõi các đơn thuê xe và thanh toán</p>
        </div>
        <Button>
          <Plus className="size-4 mr-2" />
          Tạo đơn thuê mới
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Tổng đơn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{orderData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Đang thuê</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-blue-600">{orderData.filter(o => o.status === 'active').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Hoàn thành</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">{orderData.filter(o => o.status === 'completed').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Chờ xử lý</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-yellow-600">{orderData.filter(o => o.status === 'pending').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Tổng doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">13.800.000 VNĐ</div>
          </CardContent>
        </Card>
      </div>

      {/* Order List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn thuê</CardTitle>
          <CardDescription>Quản lý và theo dõi các đơn thuê xe</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo mã đơn, khách hàng, biển số xe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="size-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Đang thuê</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <CreditCard className="size-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả thanh toán</SelectItem>
                <SelectItem value="paid">Đã thanh toán</SelectItem>
                <SelectItem value="pending">Chờ thanh toán</SelectItem>
                <SelectItem value="partial">Một phần</SelectItem>
                <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Xe thuê</TableHead>
                  <TableHead>Thời gian thuê</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Trạng thái đơn</TableHead>
                  <TableHead>Thanh toán</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customer.name}</div>
                        <div className="text-sm text-muted-foreground">{order.customer.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.vehicle.brand} {order.vehicle.model}</div>
                        <div className="text-sm text-muted-foreground">{order.vehicle.licensePlate}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{order.startDate} → {order.endDate}</div>
                        <div className="text-sm text-muted-foreground">{order.totalDays} ngày</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.totalAmount} VNĐ</div>
                        <div className="text-sm text-muted-foreground">Cọc: {order.deposit}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{getPaymentBadge(order.paymentStatus)}</TableCell>
                    <TableCell>{order.createdDate}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                            <Eye className="size-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="size-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CreditCard className="size-4 mr-2" />
                            Cập nhật thanh toán
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="size-4 mr-2" />
                            Hủy đơn
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <OrderDialog 
        order={selectedOrder}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  )
}