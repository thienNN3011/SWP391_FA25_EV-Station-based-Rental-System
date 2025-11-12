"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SimpleDropdown } from "@/components/ui/simple-dropdown"

type StatusType = "ACTIVE" | "INACTIVE" | "REJECTED" | "PENDING"

export function UserManagementStaff() {
  const [search, setSearch] = useState("")
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<StatusType>("ACTIVE")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:8080/EVRental/showallrenters", {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        })
        if (res.status === 403) throw new Error("Không có quyền truy cập.")
        if (!res.ok) throw new Error(`Lỗi khi gọi API: ${res.status}`)
        const result = await res.json()
        setUsers(Array.isArray(result.data) ? result.data : [])
      } catch (err: any) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const changeAccountStatus = async (username: string, status: StatusType, reason?: string) => {
    try {
      const token = localStorage.getItem("token")
      const body: any = { username, status }
      if (reason) body.reason = reason

      const res = await fetch("http://localhost:8080/EVRental/changeaccountstatus", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })
      const result = await res.json()
      if (result.success) {
        alert(`Cập nhật trạng thái thành công!`)
        setUsers((prev) => prev.map((u) => (u.username === username ? { ...u, status } : u)))
      } else {
        alert("Thao tác thất bại: " + (result.message || "Lỗi không xác định"))
      }
    } catch (err) {
      console.error(err)
      alert("Không thể kết nối server!")
    }
  }

  const filtered = users //loc danh sach user theo status
    .filter(
      (u) =>
        u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.phone?.includes(search)
    )
    .filter((u) => u.status === activeTab)

  const renderStatus = (status: StatusType) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-500/20 text-green-700">Đang hoạt động</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-500/20 text-yellow-700">Đang chờ kích hoạt</Badge>
      case "INACTIVE":
        return <Badge className="bg-red-500/20 text-red-700">Bị chặn</Badge>
      case "REJECTED":
        return <Badge className="bg-red-700/20 text-red-700">Từ chối</Badge>
      default:
        return <Badge className="bg-gray-200 text-gray-600">{status}</Badge>
    }
  }

  return (
    <div className="h-full w-full p-4 md:p-6 space-y-6">
   
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Quản lý người dùng</h1>
          <p className="text-muted-foreground">Danh sách tài khoản khách hàng</p>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên / email / SĐT"
            className="pl-8 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

    
      <div className="flex gap-2 border-b pb-2">
        {["ACTIVE", "PENDING", "INACTIVE", "REJECTED"].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            onClick={() => setActiveTab(tab as StatusType)}
          >
            {renderStatus(tab as StatusType).props.children}
          </Button>
        ))}
      </div>

      {loading && <p>🔄 Đang tải dữ liệu...</p>}
      {error && <p className="text-red-600">{error}</p>}

     
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
          <CardDescription>Thông tin chi tiết của khách hàng đã đăng ký</CardDescription>
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
                    <TableCell>{u.fullName}</TableCell>
                    <TableCell>{u.phone}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.idCard}</TableCell>
                    <TableCell>{u.driveLicense}</TableCell>
                    <TableCell>{renderStatus(u.status)}</TableCell>
                    <TableCell>
                      <a href={u.idCardPhoto} target="_blank" rel="noopener noreferrer">
                        <img
                          src={u.idCardPhoto}
                          alt="CCCD"
                          className="w-16 h-10 object-cover rounded bg-muted hover:scale-105 transition"
                        />
                      </a>
                    </TableCell>
                    <TableCell>
                      <a href={u.driveLicensePhoto} target="_blank" rel="noopener noreferrer">
                        <img
                          src={u.driveLicensePhoto}
                          alt="GPLX"
                          className="w-16 h-10 object-cover rounded bg-muted hover:scale-105 transition"
                        />
                      </a>
                    </TableCell>
                    <TableCell className="text-right">
                      <SimpleDropdown
                        onChangeStatus={(status, reason) => changeAccountStatus(u.username, status, reason)}
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
    </div>
  )
}
