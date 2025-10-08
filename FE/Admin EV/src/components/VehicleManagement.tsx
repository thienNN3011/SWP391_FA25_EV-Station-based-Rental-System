import { useState } from 'react'
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2, Filter, Car, Fuel, Settings } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { ImageWithFallback } from './figma/ImageWithFallback'

// Mock data cho xe
const vehicleData = [
  {
    id: "VH001",
    licensePlate: "30A-12345",
    brand: "VinFast",
    model: "VF e34",
    year: 2024,
    type: "SUV điện cỡ nhỏ",
    color: "Xanh đại dương",
    status: "available",
    location: "Chi nhánh Quận 1",
    pricePerDay: "800.000",
    mileage: "15.000",
    fuelType: "Điện",
    transmission: "Tự động",
    seats: 5,
    image: "/placeholder-car.jpg"
  },
  {
    id: "VH002", 
    licensePlate: "30B-67890",
    brand: "VinFast",
    model: "VF 8",
    year: 2024,
    type: "SUV điện",
    color: "Trắng Alpina",
    status: "rented",
    location: "Chi nhánh Quận 3",
    pricePerDay: "1.200.000",
    mileage: "8.500",
    fuelType: "Điện",
    transmission: "Tự động",
    seats: 7,
    image: "/placeholder-car.jpg"
  },
  {
    id: "VH003",
    licensePlate: "30C-11111",
    brand: "VinFast",
    model: "VF 9",
    year: 2024,
    type: "SUV điện cao cấp", 
    color: "Đỏ Ruby",
    status: "maintenance",
    location: "Chi nhánh Quận 7",
    pricePerDay: "1.500.000",
    mileage: "12.000",
    fuelType: "Điện",
    transmission: "Tự động",
    seats: 7,
    image: "/placeholder-car.jpg"
  },
  {
    id: "VH004",
    licensePlate: "30D-22222",
    brand: "VinFast",
    model: "VF 5",
    year: 2024,
    type: "SUV điện cỡ A",
    color: "Xám Titan",
    status: "available",
    location: "Chi nhánh Quận 5",
    pricePerDay: "700.000",
    mileage: "5.000",
    fuelType: "Điện",
    transmission: "Tự động",
    seats: 5,
    image: "/placeholder-car.jpg"
  },
  {
    id: "VH005",
    licensePlate: "30E-33333", 
    brand: "VinFast",
    model: "VF 3",
    year: 2024,
    type: "Xe điện mini",
    color: "Xanh Ceramic",
    status: "available",
    location: "Chi nhánh Quận 1",
    pricePerDay: "500.000",
    mileage: "3.000",
    fuelType: "Điện",
    transmission: "Tự động",
    seats: 4,
    image: "/placeholder-car.jpg"
  }
]

function VehicleDialog({ vehicle, isOpen, onClose }: { vehicle?: any, isOpen: boolean, onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{vehicle ? 'Chi tiết xe' : 'Thêm xe mới'}</DialogTitle>
          <DialogDescription>
            {vehicle ? 'Thông tin chi tiết của xe' : 'Điền thông tin để thêm xe mới'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {vehicle && (
            <div className="flex justify-center mb-4">
              <ImageWithFallback 
                src={vehicle.image} 
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-64 h-40 object-cover rounded-lg"
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="licensePlate">Biển số xe</Label>
              <Input id="licensePlate" defaultValue={vehicle?.licensePlate || ''} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="brand">Hãng xe</Label>
              <Select defaultValue={vehicle?.brand || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn hãng xe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VinFast">VinFast</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="model">Mẫu xe</Label>
              <Input id="model" defaultValue={vehicle?.model || ''} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="year">Năm sản xuất</Label>
              <Input id="year" type="number" defaultValue={vehicle?.year || ''} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Loại xe</Label>
              <Select defaultValue={vehicle?.type || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại xe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUV điện cỡ nhỏ">SUV điện cỡ nhỏ</SelectItem>
                  <SelectItem value="SUV điện">SUV điện</SelectItem>
                  <SelectItem value="SUV điện cao cấp">SUV điện cao cấp</SelectItem>
                  <SelectItem value="SUV điện cỡ A">SUV điện cỡ A</SelectItem>
                  <SelectItem value="Xe điện mini">Xe điện mini</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="color">Màu sắc</Label>
              <Input id="color" defaultValue={vehicle?.color || ''} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="seats">Số ghế</Label>
              <Input id="seats" type="number" defaultValue={vehicle?.seats || ''} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fuelType">Loại nhiên liệu</Label>
              <Select defaultValue={vehicle?.fuelType || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại nhiên liệu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Điện">Điện</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="transmission">Hộp số</Label>
              <Select defaultValue={vehicle?.transmission || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn hộp số" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tự động">Tự động</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mileage">Số km đã đi</Label>
              <Input id="mileage" defaultValue={vehicle?.mileage || ''} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pricePerDay">Giá thuê/ngày (VNĐ)</Label>
              <Input id="pricePerDay" defaultValue={vehicle?.pricePerDay || ''} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Điểm thuê</Label>
              <Select defaultValue={vehicle?.location || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn điểm thuê" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Chi nhánh Quận 1">Chi nhánh Quận 1</SelectItem>
                  <SelectItem value="Chi nhánh Quận 3">Chi nhánh Quận 3</SelectItem>
                  <SelectItem value="Chi nhánh Quận 5">Chi nhánh Quận 5</SelectItem>
                  <SelectItem value="Chi nhánh Quận 7">Chi nhánh Quận 7</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select defaultValue={vehicle?.status || 'available'}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Sẵn sàng</SelectItem>
                <SelectItem value="rented">Đang cho thuê</SelectItem>
                <SelectItem value="maintenance">Bảo trì</SelectItem>
                <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={onClose}>
            {vehicle ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function VehicleManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredVehicles = vehicleData.filter(vehicle => {
    const matchesSearch = vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter
    const matchesType = typeFilter === 'all' || vehicle.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="default" className="bg-green-100 text-green-800">Sẵn sàng</Badge>
      case 'rented':
        return <Badge className="bg-blue-100 text-blue-800">Đang cho thuê</Badge>
      case 'maintenance':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Bảo trì</Badge>
      case 'inactive':
        return <Badge variant="destructive">Ngừng hoạt động</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleViewVehicle = (vehicle: any) => {
    setSelectedVehicle(vehicle)
    setIsDialogOpen(true)
  }

  const handleAddVehicle = () => {
    setSelectedVehicle(null)
    setIsDialogOpen(true)
  }

  const vehicleTypes = [...new Set(vehicleData.map(v => v.type))]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Quản lý xe</h1>
          <p className="text-muted-foreground">Quản lý thông tin xe tại các điểm thuê</p>
        </div>
        <Button onClick={handleAddVehicle}>
          <Plus className="size-4 mr-2" />
          Thêm xe mới
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Tổng số xe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl flex items-center gap-2">
              <Car className="size-5 text-blue-600" />
              {vehicleData.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Xe sẵn sàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">{vehicleData.filter(v => v.status === 'available').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Đang cho thuê</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-blue-600">{vehicleData.filter(v => v.status === 'rented').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Cần bảo trì</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-yellow-600 flex items-center gap-2">
              <Settings className="size-5" />
              {vehicleData.filter(v => v.status === 'maintenance').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách xe</CardTitle>
          <CardDescription>Quản lý và theo dõi thông tin xe</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo biển số, hãng xe, mẫu xe..."
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
                <SelectItem value="available">Sẵn sàng</SelectItem>
                <SelectItem value="rented">Đang cho thuê</SelectItem>
                <SelectItem value="maintenance">Bảo trì</SelectItem>
                <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Chọn loại xe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại xe</SelectItem>
                {vehicleTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã xe</TableHead>
                  <TableHead>Xe</TableHead>
                  <TableHead>Biển số</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Năm SX</TableHead>
                  <TableHead>Điểm thuê</TableHead>
                  <TableHead>Giá/Ngày</TableHead>
                  <TableHead>Số km</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <ImageWithFallback 
                          src={vehicle.image} 
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          className="w-12 h-8 object-cover rounded"
                        />
                        <div>
                          <div className="font-medium">{vehicle.brand} {vehicle.model}</div>
                          <div className="text-sm text-muted-foreground">{vehicle.color} • {vehicle.seats} chỗ</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{vehicle.licensePlate}</TableCell>
                    <TableCell>{vehicle.type}</TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>{vehicle.location}</TableCell>
                    <TableCell>{vehicle.pricePerDay} VNĐ</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Fuel className="size-3 text-muted-foreground" />
                        {vehicle.mileage} km
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewVehicle(vehicle)}>
                            <Eye className="size-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewVehicle(vehicle)}>
                            <Edit className="size-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="size-4 mr-2" />
                            Lên lịch bảo trì
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

      <VehicleDialog 
        vehicle={selectedVehicle}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  )
}