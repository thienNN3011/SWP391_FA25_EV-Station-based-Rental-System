'use client'

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { Header } from "@/components/header"

interface UserProfile {
  userId: number
  username: string
  fullName: string
  email: string
  phone: string
  idCard: string
  driveLicense: string
  role: string
  status: string
  createdDate: string
}

export default function UserProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      try {
        const res = await api.get("/showuserinfo")
        if (res.data?.success) {
          setUser(res.data.data)
        } else {
          setError(res.data?.message || "Không có thông tin người dùng.")
        }
      } catch (err) {
        setError("Không thể kết nối server")
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const handleUpdate = async () => {
    setMessage(null)
    setError(null)
    const payload: Record<string, string> = {}
    if (email) payload.email = email
    if (phone) payload.phone = phone
    if (password) payload.password = password

    if (Object.keys(payload).length === 0) {
      setError("Vui lòng nhập ít nhất một thông tin cần cập nhật.")
      return
    }

    try {
      setSaving(true)
      const res = await api.put("/updateuser", payload)
      if (res.data?.success) {
        setMessage(res.data?.message || "Cập nhật thành công")
        setEmail("")
        setPhone("")
        setPassword("")
        setUser((prev) => ({ ...prev!, ...res.data.data }))
      } else {
        setError(res.data?.message || "Cập nhật thất bại")
      }
    } catch (err) {
      setError("Không thể cập nhật thông tin, vui lòng thử lại sau.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background animate-pulse">
        <Header />
        <div className="max-w-5xl mx-auto mt-10 space-y-4">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Đang tải thông tin cá nhân...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded mb-4"></div>
              <div className="h-4 bg-muted rounded mb-4"></div>
              <div className="h-4 bg-muted rounded"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Thông tin cá nhân</h1>
        <p className="text-muted-foreground text-center mb-4">Xem và cập nhật thông tin của bạn</p>

        
        {message && <div className="text-green-600 text-center mb-4">{message}</div>}
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-center">👤 Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {user ? (
                <>
                  <p><strong>Họ tên:</strong> {user.fullName}</p>
                  <p><strong>Username:</strong> {user.username}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Số điện thoại:</strong> {user.phone}</p>
                  <p><strong>CMND/CCCD:</strong> {user.idCard}</p>
                  <p><strong>Bằng lái:</strong> {user.driveLicense}</p>
                  <p><strong>Vai trò:</strong> {user.role}</p>
                  <p><strong>Trạng thái:</strong> {user.status}</p>
                  <p className="text-muted-foreground text-sm">
                    Ngày tạo: {new Date(user.createdDate).toLocaleDateString("vi-VN")}
                  </p>
                </>
              ) : (
                <p>Không có thông tin người dùng.</p>
              )}
            </CardContent>
          </Card>

          {/* Form cập nhật */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-center">✏️ Cập nhật thông tin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email mới</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập email mới"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại mới</Label>
                <Input
                  id="phone"
                  type="text"
                  placeholder="Nhập số điện thoại mới"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu mới</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu mới"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button
                onClick={handleUpdate}
                className="w-full mt-2"
                disabled={saving}
              >
                {saving ? "Đang cập nhật..." : "Lưu thay đổi"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
