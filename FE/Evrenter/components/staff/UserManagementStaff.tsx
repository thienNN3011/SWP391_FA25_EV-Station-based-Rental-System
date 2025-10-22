"use client"
import { SimpleDropdown } from "@/components/ui/simple-dropdown"
import { useState, useEffect } from "react"
import { Search, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export function UserManagementStaff() {
  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

 
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        const response = await fetch(
          "http://localhost:8080/EVRental/showallrenters",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (response.status === 403) throw new Error("Không có quyền truy cập.")
        if (!response.ok)
          throw new Error(`Lỗi khi gọi API: ${response.status}`)

        const result = await response.json()
        const userList = Array.isArray(result.data) ? result.data : []
        setUsers(userList)
      } catch (error: any) {
        console.error("Lỗi tải người dùng:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  
  const changeAccountStatus = async (username: string, status: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        "http://localhost:8080/EVRental/changeaccountstatus",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username, status }),
        }
      )

      const result = await response.json()

      if (result.success) {
        alert(
          ` ${status === "ACTIVE" ? "Kích hoạt" : "Hủy"} tài khoản thành công!`
        )
        setUsers((prev) =>
          prev.map((u) =>
            u.username === username ? { ...u, status } : u
          )
        )
      } else {
        alert("Thao tác thất bại: " + (result.message || "Lỗi không xác định"))
      }
    } catch (err) {
      console.error("Lỗi khi đổi trạng thái:", err)
      alert("Không thể kết nối đến server!")
    }
  }

 
  const filtered = users.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search)
  )


  const renderStatus = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-500/20 text-green-700">Active</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-500/20 text-yellow-700">Pending</Badge>
      case "BLOCKED":
      case "REJECTED":
        return <Badge className="bg-red-500/20 text-red-700">Blocked</Badge>
      default:
        return <Badge className="bg-gray-200 text-gray-600">{status}</Badge>
    }
  }

  return (
    <div className="h-full w-full">
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Quản lý người dùng</h1>
            <p className="text-muted-foreground">Danh sách tài khoản khách hàng</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên / email / SĐT"
                className="pl-8 w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <UserPlus className="size-4 mr-2" /> Thêm người dùng
            </Button>
          </div>
        </div>

        {loading && <p>🔄 Đang tải dữ liệu...</p>}
        {error && <p className="text-red-600">❌ {error}</p>}

        <Card>
          <CardHeader>
            <CardTitle>Danh sách người dùng</CardTitle>
            <CardDescription>
              Thông tin chi tiết của khách hàng đã đăng ký
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ và Tên</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Số CMND/CCCD</TableHead>
                  <TableHead>Số GPLX</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ảnh CMND/CCCD</TableHead>
                  <TableHead>Ảnh GPLX</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length > 0 ? (
                  filtered.map((u) => (
                    <TableRow key={u.username}>
                      <TableCell className="font-medium">{u.fullName}</TableCell>
                      <TableCell>{u.phone}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.idCard}</TableCell>
                      <TableCell>{u.driveLicense}</TableCell>
                      <TableCell>{renderStatus(u.status)}</TableCell>
                      <TableCell>
                        <img
                          src={u.idCardImage}
                          alt="CCCD"
                          className="w-16 h-10 object-cover rounded bg-muted"
                        />
                      </TableCell>
                      <TableCell>
                        <img
                          src={u.licenseImage}
                          alt="GPLX"
                          className="w-16 h-10 object-cover rounded bg-muted"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <SimpleDropdown
                          onActivate={() =>
                            changeAccountStatus(u.username, "ACTIVE")
                          }
                          onDeactivate={() =>
                            changeAccountStatus(u.username, "REJECTED")
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6 text-gray-500">
                      Không có dữ liệu người dùng.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm người dùng mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin chi tiết của người dùng
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input id="fullName" placeholder="Nguyễn Văn A" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@example.com" />
              </div>
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" placeholder="0987 654 321" />
              </div>
              <div>
                <Label htmlFor="cccd">Số CMND/CCCD</Label>
                <Input id="cccd" placeholder="079xxxxxxx" />
              </div>
              <div>
                <Label htmlFor="driverLicense">Số GPLX</Label>
                <Input id="driverLicense" placeholder="DLxxxxxxx" />
              </div>
              <div>
                <Label htmlFor="cccdImage">Ảnh CMND/CCCD</Label>
                <Input id="cccdImage" type="file" accept="image/*" />
              </div>
              <div>
                <Label htmlFor="licenseImage">Ảnh GPLX</Label>
                <Input id="licenseImage" type="file" accept="image/*" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button>Lưu</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
