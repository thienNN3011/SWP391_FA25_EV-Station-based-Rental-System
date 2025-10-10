import { useState } from 'react'
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2, UserCheck } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

// Mock data cho nhân viên
const staffData = [
  {
    id: "STF001",
    name: "Nguyễn Văn Minh",
    email: "minh.nguyen@rentcar.com",
    phone: "0987123456",
    location: "Chi nhánh Quận 1",
    joinDate: "2023-06-15",
    customerRating: 4.8,
    avatar: "/placeholder-avatar.jpg"
  },
  {
    id: "STF002",
    name: "Trần Thị Lan",
    email: "lan.tran@rentcar.com", 
    phone: "0976234567",
    location: "Chi nhánh Quận 3",
    joinDate: "2023-08-20",
    customerRating: 4.6,
    avatar: "/placeholder-avatar.jpg"
  },
  {
    id: "STF003",
    name: "Lê Văn Tùng",
    email: "tung.le@rentcar.com",
    phone: "0965345678", 
    location: "Chi nhánh Quận 7",
    joinDate: "2023-04-10",
    customerRating: 4.9,
    avatar: "/placeholder-avatar.jpg"
  },
  {
    id: "STF004",
    name: "Phạm Thị Hoa",
    email: "hoa.pham@rentcar.com",
    phone: "0954456789",
    location: "Chi nhánh Quận 5",
    joinDate: "2023-07-05",
    customerRating: 4.3,
    avatar: "/placeholder-avatar.jpg"
  },
  {
    id: "STF005",
    name: "Hoàng Văn Đức",
    email: "duc.hoang@rentcar.com",
    phone: "0943567890",
    location: "Chi nhánh Quận 1",
    joinDate: "2023-09-01",
    customerRating: 4.7,
    avatar: "/placeholder-avatar.jpg"
  }
]

function StaffDialog({ staff, isOpen, onClose }: { staff?: any, isOpen: boolean, onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{staff ? 'Chi tiết nhân viên' : 'Thêm nhân viên mới'}</DialogTitle>
          <DialogDescription>
            {staff ? 'Thông tin chi tiết của nhân viên' : 'Điền thông tin để thêm nhân viên mới'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Họ và tên</Label>
            <Input id="name" defaultValue={staff?.name || ''} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={staff?.email || ''} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input id="phone" defaultValue={staff?.phone || ''} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Điểm làm việc</Label>
            <Select defaultValue={staff?.location || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn điểm làm việc" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Chi nhánh Quận 1">Chi nhánh Quận 1</SelectItem>
                <SelectItem value="Chi nhánh Quận 3">Chi nhánh Quận 3</SelectItem>
                <SelectItem value="Chi nhánh Quận 5">Chi nhánh Quận 5</SelectItem>
                <SelectItem value="Chi nhánh Quận 7">Chi nhánh Quận 7</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="rating">Đánh giá khách hàng</Label>
            <Input id="rating" type="number" min="0" max="5" step="0.1" defaultValue={staff?.customerRating || ''} placeholder="4.5" />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={onClose}>
            {staff ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function StaffManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStaff, setSelectedStaff] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredStaff = staffData.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.phone.includes(searchTerm)
    return matchesSearch
  })

  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "text-yellow-500" : "text-gray-300"}>
          ★
        </span>
      )
    }
    return stars
  }

  const handleViewStaff = (staff: any) => {
    setSelectedStaff(staff)
    setIsDialogOpen(true)
  }

  const handleAddStaff = () => {
    setSelectedStaff(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="h-full w-full overflow-auto">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl">Quản lý nhân viên</h1>
            <p className="text-muted-foreground">Quản lý thông tin nhân viên tại các điểm thuê</p>
          </div>
          <Button onClick={handleAddStaff}>
            <Plus className="size-4 mr-2" />
            Thêm nhân viên
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Tổng nhân viên</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl flex items-center gap-2">
                <UserCheck className="size-5 text-blue-600" />
                {staffData.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Đánh giá trung bình</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-yellow-600 flex items-center gap-1">
                {(staffData.reduce((sum, s) => sum + s.customerRating, 0) / staffData.length).toFixed(1)}
                <span className="text-sm">★</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Nhân viên xuất sắc</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-green-600">{staffData.filter(s => s.customerRating >= 4.5).length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Staff List */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách nhân viên</CardTitle>
            <CardDescription>Quản lý và theo dõi thông tin nhân viên</CardDescription>
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
                    <TableHead>Mã NV</TableHead>
                    <TableHead>Nhân viên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead>Điểm làm việc</TableHead>
                    <TableHead>Đánh giá khách hàng</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell className="font-medium">{staff.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarImage src={staff.avatar} />
                            <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{staff.name}</div>
                            <div className="text-sm text-muted-foreground">Gia nhập: {staff.joinDate}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{staff.email}</TableCell>
                      <TableCell>{staff.phone}</TableCell>
                      <TableCell>{staff.location}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{staff.customerRating}</span>
                          <div className="flex">
                            {renderStars(staff.customerRating)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewStaff(staff)}>
                              <Eye className="size-4 mr-2" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewStaff(staff)}>
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

        <StaffDialog 
          staff={selectedStaff}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      </div>
    </div>
  )
}