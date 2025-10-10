import { useState } from 'react'
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2, Filter } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

// Mock data cho khách hàng
const customersData = [
  {
    id: "USR001",
    name: "Nguyễn Văn An",
    email: "nguyen.van.an@email.com",
    phone: "0987654321",
    address: "123 Nguyễn Huệ, Q1, TP.HCM",
    totalOrders: 5,
    totalSpent: "12.500.000 VNĐ",
    joinDate: "2024-01-15",
    lastOrder: "2024-09-10"
  },
  {
    id: "USR002", 
    name: "Trần Thị Bình",
    email: "tran.thi.binh@email.com",
    phone: "0976543210",
    address: "456 Lê Lợi, Q3, TP.HCM",
    totalOrders: 3,
    totalSpent: "8.200.000 VN��",
    joinDate: "2024-02-20",
    lastOrder: "2024-09-15"
  },
  {
    id: "USR003",
    name: "Lê Văn Cường",
    email: "le.van.cuong@email.com", 
    phone: "0965432109",
    address: "789 Trần Hưng Đạo, Q5, TP.HCM",
    totalOrders: 8,
    totalSpent: "20.100.000 VNĐ",
    joinDate: "2023-12-05",
    lastOrder: "2024-09-12"
  },
  {
    id: "USR004",
    name: "Phạm Thị Dung",
    email: "pham.thi.dung@email.com",
    phone: "0954321098",
    address: "101 Võ Thị Sáu, Q3, TP.HCM",
    totalOrders: 1,
    totalSpent: "2.800.000 VNĐ",
    joinDate: "2024-08-01",
    lastOrder: "2024-08-15"
  },
  {
    id: "USR005",
    name: "Hoàng Văn Em",
    email: "hoang.van.em@email.com",
    phone: "0943210987",
    address: "202 Hai Bà Trưng, Q1, TP.HCM",
    totalOrders: 12,
    totalSpent: "35.600.000 VNĐ", 
    joinDate: "2023-10-10",
    lastOrder: "2024-09-18"
  }
]

function CustomerDialog({ customer, isOpen, onClose }: { customer?: any, isOpen: boolean, onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{customer ? 'Chi tiết khách hàng' : 'Thêm khách hàng mới'}</DialogTitle>
          <DialogDescription>
            {customer ? 'Thông tin chi tiết của khách hàng' : 'Điền thông tin để thêm khách hàng mới'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Họ và tên</Label>
            <Input id="name" defaultValue={customer?.name || ''} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={customer?.email || ''} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input id="phone" defaultValue={customer?.phone || ''} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input id="address" defaultValue={customer?.address || ''} />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={onClose}>
            {customer ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredCustomers = customersData.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm)
    return matchesSearch
  })

  const handleViewCustomer = (customer: any) => {
    setSelectedCustomer(customer)
    setIsDialogOpen(true)
  }

  const handleAddCustomer = () => {
    setSelectedCustomer(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="h-full w-full overflow-auto">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl">Quản lý khách hàng</h1>
            <p className="text-muted-foreground">Quản lý thông tin khách hàng và lịch sử thuê xe</p>
          </div>
          <Button onClick={handleAddCustomer}>
            <Plus className="size-4 mr-2" />
            Thêm khách hàng
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Tổng khách hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{customersData.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Tổng đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{customersData.reduce((sum, c) => sum + c.totalOrders, 0)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Doanh thu từ khách</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">79.200.000 VNĐ</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách khách hàng</CardTitle>
            <CardDescription>Quản lý và theo dõi thông tin khách hàng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã KH</TableHead>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead>Tổng đơn</TableHead>
                    <TableHead>Tổng chi tiêu</TableHead>
                    <TableHead>Đơn gần nhất</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.id}</TableCell>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{customer.totalOrders}</TableCell>
                      <TableCell>{customer.totalSpent}</TableCell>
                      <TableCell>{customer.lastOrder}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewCustomer(customer)}>
                              <Eye className="size-4 mr-2" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewCustomer(customer)}>
                              <Edit className="size-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="size-4 mr-2" />
                              Xóa
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

        <CustomerDialog 
          customer={selectedCustomer}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      </div>
    </div>
  )
}