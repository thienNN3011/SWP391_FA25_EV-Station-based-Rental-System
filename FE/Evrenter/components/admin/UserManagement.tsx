"use client"
import { useEffect, useState } from "react"
import { Search, MoreHorizontal, Eye, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getPendingAccounts, getPendingAccountDetail, changeAccountStatus, CustomerResponse } from "@/lib/adminApi"

export function UserManagement() {
  const [search, setSearch] = useState("")
  const [rows, setRows] = useState<CustomerResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [detail, setDetail] = useState<CustomerResponse|null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const data = await getPendingAccounts()
        setRows(data)
      } catch (e: any) {
        setError(e.message || 'Lỗi tải danh sách')
      } finally { setLoading(false) }
    })()
  }, [])

  const filtered = rows.filter((c) => c.fullName.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()))

  const approve = async (username: string) => {
    await changeAccountStatus(username, 'ACTIVE')
    setRows(prev => prev.filter(x => x.username !== username))
  }
  const reject = async (username: string) => {
    await changeAccountStatus(username, 'REJECTED')
    setRows(prev => prev.filter(x => x.username !== username))
  }
  const view = async (username: string) => {
    const d = await getPendingAccountDetail(username)
    setDetail(d); setOpen(true)
  }

  if (loading) return <div className="p-6">Đang tải...</div>
  if (error) return <div className="p-6 text-red-500">{error}</div>

  return (
    <div className="h-full w-full overflow-auto">
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl">Tài khoản đang chờ duyệt</h1>
            <p className="text-muted-foreground">Duyệt/ẩn khách hàng mới đăng ký</p>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
            <Input placeholder="Tìm theo tên/email" className="pl-8 w-64" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách chờ duyệt</CardTitle>
            <CardDescription>Nguồn dữ liệu từ API backend</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.username}>
                    <TableCell className="font-medium">{c.username}</TableCell>
                    <TableCell>{c.fullName}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.status}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="size-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => view(c.username)} className="flex items-center gap-2"><Eye className="size-4" /> Xem</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => approve(c.username)} className="flex items-center gap-2"><Check className="size-4" /> Duyệt</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => reject(c.username)} className="flex items-center gap-2 text-red-600"><X className="size-4" /> Từ chối</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chi tiết tài khoản</DialogTitle>
            </DialogHeader>
            {detail && (
              <div className="grid grid-cols-2 gap-2">
                <div>Username: <b>{detail.username}</b></div>
                <div>Họ tên: <b>{detail.fullName}</b></div>
                <div>Email: {detail.email}</div>
                <div>SĐT: {detail.phone}</div>
                <div>CCCD: {detail.idCard}</div>
                <div>GPLX: {detail.driveLicense}</div>
                <div>Trạng thái: {detail.status}</div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}