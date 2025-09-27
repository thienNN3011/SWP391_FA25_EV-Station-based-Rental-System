import { useState } from 'react'
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2, Filter, UserCheck } from 'lucide-react'
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
    position: "Quản lý điểm thuê",
    location: "Chi nhánh Quận 1",
    status: "active",
    joinDate: "2023-06-15",
    salary: "15.000.000",
    avatar: "/placeholder-avatar.jpg"
  },
  {
    id: "STF002",
    name: "Trần Thị Lan",
    email: "lan.tran@rentcar.com", 
    phone: "0976234567",
    position: "Nhân viên tư vấn",
    location: "Chi nhánh Quận 3",
    status: "active",
    joinDate: "2023-08-20",
    salary: "10.000.000",
    avatar: "/placeholder-avatar.jpg"
  },
  {
    id: "STF003",
    name: "Lê Văn Tùng",
    email: "tung.le@rentcar.com",
    phone: "0965345678", 
    position: "Kỹ thuật viên",
    location: "Chi nhánh Quận 7",
    status: "active",
    joinDate: "2023-04-10",
    salary: "12.000.000",
    avatar: "/placeholder-avatar.jpg"
  },
  {
    id: "STF004",
    name: "Phạm Thị Hoa",
    email: "hoa.pham@rentcar.com",
    phone: "0954456789",
    position: "Nhân viên bảo trì",
    location: "Chi nhánh Quận 5",
    status: "leave",
    joinDate: "2023-07-05",
    salary: "11.000.000",
    avatar: "/placeholder-avatar.jpg"
  },
  {
    id: "STF005",
    name: "Hoàng Văn Đức",
    email: "duc.hoang@rentcar.com",
    phone: "0943567890",
    position: "Nhân viên giao xe",
    location: "Chi nhánh Quận 1",
    status: "active",
    joinDate: "2023-09-01",
    salary: "9.000.000",
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
            <Label htmlFor="position">Chức vụ</Label>
            <Select defaultValue={staff?.position || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn chức vụ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Quản lý điểm thuê">Quản lý điểm thuê</SelectItem>
                <SelectItem value="Nhân viên tư vấn">Nhân viên tư vấn</SelectItem>
                <SelectItem value="Kỹ thuật viên">Kỹ thuật viên</SelectItem>
                <SelectItem value="Nhân viên bảo trì">Nhân viên bảo trì</SelectItem>
                <SelectItem value="Nhân viên giao xe">Nhân viên giao xe</SelectItem>
              </SelectContent>
            </Select>
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
            <Label htmlFor="salary">Lương (VNĐ)</Label>
            <Input id="salary" defaultValue={staff?.salary || ''} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select defaultValue={staff?.status || 'active'}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Đang làm việc</SelectItem>
                <SelectItem value="leave">Nghỉ phép</SelectItem>
                <SelectItem value="inactive">Đã nghỉ việc</SelectItem>
              </SelectContent>
            </Select>
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
  const [statusFilter, setStatusFilter] = useState('all')
  const [positionFilter, setPositionFilter] = useState('all')
  const [selectedStaff, setSelectedStaff] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredStaff = staffData.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.phone.includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || staff.status === statusFilter
    const matchesPosition = positionFilter === 'all' || staff.position === positionFilter
    return matchesSearch && matchesStatus && matchesPosition
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Đang làm việc</Badge>
      case 'leave':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Nghỉ phép</Badge>
      case 'inactive':
        return <Badge variant="destructive">Đã nghỉ việc</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleViewStaff = (staff: any) => {
    setSelectedStaff(staff)
    setIsDialogOpen(true)
  }

  const handleAddStaff = () => {
    setSelectedStaff(null)
    setIsDialogOpen(true)
  }

  const positions = [...new Set(staffData.map(s => s.position))]

  return (
    <div className="p-6 space-y-6">
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <CardTitle className="text-sm">Đang làm việc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">{staffData.filter(s => s.status === 'active').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Nghỉ phép</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-yellow-600">{staffData.filter(s => s.status === 'leave').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Tổng lương/tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">57.000.000 VNĐ</div>
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="size-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">��ang làm việc</SelectItem>
                <SelectItem value="leave">Nghỉ phép</SelectItem>
                <SelectItem value="inactive">Đã nghỉ việc</SelectItem>
              </SelectContent>
            </Select>
            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Chọn chức vụ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả chức vụ</SelectItem>
                {positions.map(position => (
                  <SelectItem key={position} value={position}>{position}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                  <TableHead>Chức vụ</TableHead>
                  <TableHead>Điểm làm việc</TableHead>
                  <TableHead>Lương</TableHead>
                  <TableHead>Trạng thái</TableHead>
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
                    <TableCell>{staff.position}</TableCell>
                    <TableCell>{staff.location}</TableCell>
                    <TableCell>{staff.salary} VNĐ</TableCell>
                    <TableCell>{getStatusBadge(staff.status)}</TableCell>
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
  )
}