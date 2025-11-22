"use client"
import { useEffect, useState } from "react"
import { Search, MoreHorizontal, Eye, Check, X, Plus, Edit, Trash2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  getPendingAccounts, 
  getPendingAccountDetail, 
  changeAccountStatus, 
  getAllRenters,
  getAllStaffs,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  CustomerResponse,
  CustomerUpdatePayload,
  StaffResponse
} from "@/lib/adminApi"
import { api } from "@/lib/api"

export function UserManagement() {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("pending")
  
  const [users, setUsers] = useState<StaffResponse[]>([])
  // Pending accounts
  const [pendingAccounts, setPendingAccounts] = useState<CustomerResponse[]>([])
  
  // All renters
  const [renters, setRenters] = useState<CustomerResponse[]>([])
  
  // All staffs
  const [staffs, setStaffs] = useState<CustomerResponse[]>([])
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  // Detail dialog
  const [detail, setDetail] = useState<CustomerResponse|null>(null)
  const [openDetail, setOpenDetail] = useState(false)
  
  // Create/Edit dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
const [editingUser, setEditingUser] = useState<StaffResponse | null>(null)
  interface UserForm {
  username: string
  password: string
  fullName: string
  email: string
  phone: string
  stationId: string
}

const [form, setForm] = useState<UserForm>({
  username: "",
  password: "",
  fullName: "",
  email: "",
  phone: "",
  stationId: ""
})

function openCreateDialog() {
  setEditingUser(null)
  setForm({
    username: "",
    password: "",
    fullName: "",
    email: "",
    phone: "",
    stationId: ""
  })
  setIsEditDialogOpen(true)
}
async function createStaff() {
  try {
    await api.post("/admin/staffs", {
      username: form.username,
      password: form.password,
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      stationId: form.stationId
    })

    alert("Tạo nhân viên thành công!")
    setIsEditDialogOpen(false)
    await loadAllData()
  } catch (err: any) {
    alert("Lỗi tạo staff: " + (err.response?.data?.message || err.message))
  }
}

async function handleSave() {
  if (!editingUser) {
    await createStaff()
  } else {
    
  }
}



  useEffect(() => {
    loadAllData()
  }, [])
  
  async function loadAllData() {
    setLoading(true)
    setError("")
    try {
      // Load pending accounts
      let pending: CustomerResponse[] = []
      try {
        pending = await getPendingAccounts()
        console.log("Pending accounts loaded:", pending.length)
      } catch (e) {
        console.error("Error loading pending accounts:", e)
      }

      // Load renters
      let allRenters: CustomerResponse[] = []
      try {
        allRenters = await getAllRenters()
        console.log("Renters loaded:", allRenters.length)
      } catch (e) {
        console.error("Error loading renters:", e)
      }

      // Load staffs
      let allStaffs: CustomerResponse[] = []
      try {
        allStaffs = await getAllStaffs()
        console.log("Staffs loaded:", allStaffs.length)
      } catch (e) {
        console.error("Error loading staffs:", e)
      }

      setPendingAccounts(pending)
      setRenters(allRenters)
      setStaffs(allStaffs)
    } catch (e: any) {
      console.error("Error in loadAllData:", e)
      setError(e.message || 'Lỗi tải danh sách')
    } finally { 
      setLoading(false) 
    }
  }

  const getCurrentList = () => {
    switch (activeTab) {
      case "pending": return pendingAccounts
      case "renters": return renters
      case "staffs": return staffs
      default: return []
    }
  }

  const filtered = getCurrentList().filter((c) => 
    c.fullName.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.username.toLowerCase().includes(search.toLowerCase())
  )

  const approve = async (username: string) => {
    try {
      await changeAccountStatus(username, 'ACTIVE')
      setPendingAccounts(prev => prev.filter(x => x.username !== username))
      await loadAllData()
    } catch (e: any) {
      alert("Lỗi duyệt tài khoản: " + e.message)
    }
  }
  
  const reject = async (username: string) => {
    try {
      await changeAccountStatus(username, 'REJECTED')
      setPendingAccounts(prev => prev.filter(x => x.username !== username))
    } catch (e: any) {
      alert("Lỗi từ chối tài khoản: " + e.message)
    }
  }
  
  const view = async (username: string) => {
    try {
      const d = await getPendingAccountDetail(username)
      setDetail(d)
      setOpenDetail(true)
    } catch (e: any) {
      alert("Lỗi xem chi tiết: " + e.message)
    }
  }
  


  
function openEditDialog(user: StaffResponse) {
  setEditingUser(user)
  setForm({
    username: user.username,
    password: "",
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    stationId: user.stationId.toString()
  })
  setIsEditDialogOpen(true)
}


  




  
  async function handleDelete(userId: number) {
    if (!confirm("Xác nhận xóa người dùng này?")) return
    try {
      await deleteCustomer(userId)
      await loadAllData()
    } catch (e: any) {
      alert("Xóa thất bại: " + e.message)
    }
  }

  if (loading) return <div className="p-6">Đang tải...</div>
  if (error) return <div className="p-6 text-red-500">{error}</div>

  return (
    <div className="h-full w-full overflow-auto">
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl">Quản lý người dùng</h1>
            <p className="text-muted-foreground">Quản lý tài khoản, khách hàng và nhân viên</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
              <Input placeholder="Tìm theo tên/email/username" className="pl-8 w-64" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            {activeTab !== "pending" && (
              <Button onClick={openCreateDialog}>
                <Plus className="size-4 mr-2" /> Thêm tài khoản nhân viên
              </Button>
            )}
            <Button variant="outline" onClick={loadAllData}>Tải lại</Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              Chờ duyệt ({pendingAccounts.length})
            </TabsTrigger>
            <TabsTrigger value="renters">
              Khách hàng ({renters.length})
            </TabsTrigger>
            <TabsTrigger value="staffs">
              Nhân viên ({staffs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Tài khoản chờ duyệt</CardTitle>
                <CardDescription>Duyệt hoặc từ chối tài khoản đăng ký mới</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead></TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Họ tên</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>SĐT</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          {loading ? "Đang tải..." : "Không có tài khoản chờ duyệt"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtered.map((c) => (
                        <TableRow key={c.userId}>
                          <TableCell className="font-medium">{c.userId}</TableCell>
                          <TableCell>{c.username}</TableCell>
                          <TableCell>{c.fullName}</TableCell>
                          <TableCell>{c.email}</TableCell>
                          <TableCell>{c.phone}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-700">
                              {c.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon"><MoreHorizontal className="size-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => view(c.username)} className="flex items-center gap-2">
                                  <Eye className="size-4" /> Xem chi tiết
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => approve(c.username)} className="flex items-center gap-2 text-green-600">
                                  <Check className="size-4" /> Duyệt
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => reject(c.username)} className="flex items-center gap-2 text-red-600">
                                  <X className="size-4" /> Từ chối
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="renters">
            <Card>
              <CardHeader>
                <CardTitle>Danh sách khách hàng</CardTitle>
                <CardDescription>Quản lý thông tin khách hàng thuê xe</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead></TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Họ tên</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>SĐT</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          {loading ? "Đang tải..." : "Không có khách hàng nào"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtered.map((c) => (
                        <TableRow key={c.userId}>
                          <TableCell className="font-medium">{c.userId}</TableCell>
                          <TableCell>{c.username}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="size-4 text-primary" />
                              {c.fullName}
                            </div>
                          </TableCell>
                          <TableCell>{c.email}</TableCell>
                          <TableCell>{c.phone}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs ${
                              c.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {c.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon"><MoreHorizontal className="size-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => { setDetail(c); setOpenDetail(true) }} className="flex items-center gap-2">
                                  <Eye className="size-4" /> Xem
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEditDialog(c)} className="flex items-center gap-2">
                                  <Edit className="size-4" /> Sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(c.userId)} className="flex items-center gap-2 text-red-600">
                                  <Trash2 className="size-4" /> Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staffs">
            <Card>
              <CardHeader>
                <CardTitle>Danh sách nhân viên</CardTitle>
                <CardDescription>Quản lý thông tin nhân viên hệ thống</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead></TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Họ tên</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>SĐT</TableHead>
                      <TableHead></TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          {loading ? "Đang tải..." : "Không có nhân viên nào"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtered.map((c) => (
                        <TableRow key={c.userId}>
                          <TableCell className="font-medium">{c.userId}</TableCell>
                          <TableCell>{c.username}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="size-4 text-primary" />
                              {c.fullName}
                            </div>
                          </TableCell>
                          <TableCell>{c.email}</TableCell>
                          <TableCell>{c.phone}</TableCell>
                          <TableCell>{c.role}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs ${
                              c.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {c.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon"><MoreHorizontal className="size-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => { setDetail(c); setOpenDetail(true) }} className="flex items-center gap-2">
                                  <Eye className="size-4" /> Xem
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEditDialog(c)} className="flex items-center gap-2">
                                  <Edit className="size-4" /> Sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(c.userId)} className="flex items-center gap-2 text-red-600">
                                  <Trash2 className="size-4" /> Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}

                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog xem chi tiết */}
        <Dialog open={openDetail} onOpenChange={setOpenDetail}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chi tiết tài khoản</DialogTitle>
            </DialogHeader>
            {detail && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-semibold">ID:</Label>
                  <p className="text-sm">{detail.userId}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Username:</Label>
                  <p className="text-sm font-medium">{detail.username}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Họ tên:</Label>
                  <p className="text-sm font-medium">{detail.fullName}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Vai trò:</Label>
                  <p className="text-sm">{detail.role}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Email:</Label>
                  <p className="text-sm">{detail.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">SĐT:</Label>
                  <p className="text-sm">{detail.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">CCCD:</Label>
                  <p className="text-sm">{detail.idCard}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">GPLX:</Label>
                  <p className="text-sm">{detail.driveLicense}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Trạng thái:</Label>
                  <p className="text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      detail.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {detail.status}
                    </span>
                  </p>
                </div>
                {detail.createdDate && (
                  <div>
                    <Label className="text-sm font-semibold">Ngày tạo:</Label>
                    <p className="text-sm">{new Date(detail.createdDate).toLocaleDateString('vi-VN')}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog thêm/sửa */}
     {/* Dialog thêm/sửa */}
<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>{editingUser ? "Sửa nhân viên" : "Thêm nhân viên mới"}</DialogTitle>
      <DialogDescription>
        {editingUser ? "Cập nhật thông tin nhân viên" : "Nhập thông tin nhân viên mới"}
      </DialogDescription>
    </DialogHeader>

    <div className="grid grid-cols-2 gap-4">

      {!editingUser && (
        <>
          <div>
            <Label>Username *</Label>
            <Input
              value={form.username}
              onChange={(e) => setForm(s => ({ ...s, username: e.target.value }))}
            />
          </div>

          <div>
            <Label>Password *</Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm(s => ({ ...s, password: e.target.value }))}
            />
          </div>
        </>
      )}

      <div>
        <Label>Họ tên *</Label>
        <Input
          value={form.fullName}
          onChange={(e) => setForm(s => ({ ...s, fullName: e.target.value }))}
        />
      </div>

      <div>
        <Label>Email *</Label>
        <Input
          type="email"
          value={form.email}
          onChange={(e) => setForm(s => ({ ...s, email: e.target.value }))}
        />
      </div>

      <div>
        <Label>Số điện thoại *</Label>
        <Input
          value={form.phone}
          onChange={(e) => setForm(s => ({ ...s, phone: e.target.value }))}
        />
      </div>

      <div>
        <Label>Station ID *</Label>
        <Input
          value={form.stationId}
          onChange={(e) => setForm(s => ({ ...s, stationId: e.target.value }))}
        />
      </div>

    </div>

    <div className="flex justify-end gap-2 pt-4">
      <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Hủy</Button>
      <Button onClick={handleSave}>{editingUser ? "Cập nhật" : "Tạo mới"}</Button>
    </div>

  </DialogContent>
</Dialog>


      </div>
    </div>
  )
}