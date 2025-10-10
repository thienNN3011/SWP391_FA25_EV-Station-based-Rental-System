import { useState } from 'react'
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2, MapPin, Phone, Clock } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'

// Mock data cho điểm thuê
const locationData = [
  {
    id: "LOC001",
    name: "Chi nhánh Quận 1",
    address: "123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM",
    phone: "028-1234-5678",
    email: "quan1@rentcar.com",
    manager: "Nguyễn Văn Minh",
    vehicleCount: 25,
    staffCount: 8,
    openTime: "07:00",
    closeTime: "22:00",
    area: "120m²"
  },
  {
    id: "LOC002",
    name: "Chi nhánh Quận 3", 
    address: "456 Võ Văn Tần, Phường 6, Quận 3, TP.HCM",
    phone: "028-2345-6789",
    email: "quan3@rentcar.com",
    manager: "Trần Thị Lan",
    vehicleCount: 20,
    staffCount: 6,
    openTime: "07:00",
    closeTime: "21:00",
    area: "100m²"
  },
  {
    id: "LOC003",
    name: "Chi nhánh Quận 7",
    address: "789 Nguyễn Thị Thập, Phường Tân Phong, Quận 7, TP.HCM",
    phone: "028-3456-7890", 
    email: "quan7@rentcar.com",
    manager: "Lê Văn Tùng",
    vehicleCount: 30,
    staffCount: 10,
    openTime: "06:30",
    closeTime: "22:30",
    area: "150m²"
  },
  {
    id: "LOC004",
    name: "Chi nhánh Quận 5",
    address: "101 An Dương Vương, Phường 3, Quận 5, TP.HCM",
    phone: "028-4567-8901",
    email: "quan5@rentcar.com", 
    manager: "Phạm Thị Hoa",
    vehicleCount: 15,
    staffCount: 5,
    openTime: "08:00",
    closeTime: "20:00",
    area: "80m²"
  }
]

function LocationDialog({ location, isOpen, onClose }: { location?: any, isOpen: boolean, onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{location ? 'Chi tiết điểm thuê' : 'Thêm điểm thuê mới'}</DialogTitle>
          <DialogDescription>
            {location ? 'Thông tin chi tiết của điểm thuê' : 'Điền thông tin để thêm điểm thuê mới'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Tên chi nhánh</Label>
            <Input id="name" defaultValue={location?.name || ''} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Textarea id="address" defaultValue={location?.address || ''} rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input id="phone" defaultValue={location?.phone || ''} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={location?.email || ''} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="manager">Nhân viên</Label>
            <Select defaultValue={location?.manager || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhân viên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Nguyễn Văn Minh">Nguyễn Văn Minh</SelectItem>
                <SelectItem value="Trần Thị Lan">Trần Thị Lan</SelectItem>
                <SelectItem value="Lê Văn Tùng">Lê Văn Tùng</SelectItem>
                <SelectItem value="Phạm Thị Hoa">Phạm Thị Hoa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="openTime">Giờ mở cửa</Label>
              <Input id="openTime" type="time" defaultValue={location?.openTime || ''} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="closeTime">Giờ đóng cửa</Label>
              <Input id="closeTime" type="time" defaultValue={location?.closeTime || ''} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="area">Diện tích</Label>
              <Input id="area" defaultValue={location?.area || ''} placeholder="100m²" />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={onClose}>
            {location ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function LocationManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredLocations = locationData.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.manager.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleViewLocation = (location: any) => {
    setSelectedLocation(location)
    setIsDialogOpen(true)
  }

  const handleAddLocation = () => {
    setSelectedLocation(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="h-full w-full overflow-auto">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl">Quản lý điểm thuê</h1>
            <p className="text-muted-foreground">Quản lý thông tin các chi nhánh và điểm thuê xe</p>
          </div>
          <Button onClick={handleAddLocation}>
            <Plus className="size-4 mr-2" />
            Thêm điểm thuê
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Tổng chi nhánh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl flex items-center gap-2">
                <MapPin className="size-5 text-blue-600" />
                {locationData.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Chi nhánh hoạt động</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-green-600">{locationData.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Tổng xe tại các chi nhánh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{locationData.reduce((sum, loc) => sum + loc.vehicleCount, 0)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Tổng nhân viên</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{locationData.reduce((sum, loc) => sum + loc.staffCount, 0)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Location List */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách điểm thuê</CardTitle>
            <CardDescription>Quản lý và theo dõi thông tin các chi nhánh</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên chi nhánh, địa chỉ, nhân viên..."
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
                    <TableHead>Mã chi nhánh</TableHead>
                    <TableHead>Thông tin chi nhánh</TableHead>
                    <TableHead>Nhân viên</TableHead>
                    <TableHead>Liên hệ</TableHead>
                    <TableHead>Giờ hoạt động</TableHead>
                    <TableHead>Xe/Nhân viên</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLocations.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell className="font-medium">{location.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{location.name}</div>
                          <div className="text-sm text-muted-foreground max-w-xs truncate">
                            <MapPin className="size-3 inline mr-1" />
                            {location.address}
                          </div>
                          <div className="text-sm text-muted-foreground">{location.area}</div>
                        </div>
                      </TableCell>
                      <TableCell>{location.manager}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Phone className="size-3" />
                            {location.phone}
                          </div>
                          <div className="text-muted-foreground">{location.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="size-3" />
                          {location.openTime} - {location.closeTime}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{location.vehicleCount} xe</div>
                          <div className="text-muted-foreground">{location.staffCount} nhân viên</div>
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
                            <DropdownMenuItem onClick={() => handleViewLocation(location)}>
                              <Eye className="size-4 mr-2" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewLocation(location)}>
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

        <LocationDialog 
          location={selectedLocation}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      </div>
    </div>
  )
}