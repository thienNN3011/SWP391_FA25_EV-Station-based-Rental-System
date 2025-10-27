"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { api } from "@/lib/api"

interface UserProfile {
  fullName: string
  email: string
  phone: string
  role: string
  createdAt?: string
}

export default function UserProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

 
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const res = await api.get("/users/me")
        if (res.data?.success) {
          setUser(res.data.data)
        }
      } catch (err) {
        console.error("Lỗi lấy thông tin:", err)
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin người dùng.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

 
  const handleUpdate = async () => {
    const payload: Record<string, string> = {}
    if (email) payload.email = email
    if (phone) payload.phone = phone
    if (password) payload.password = password

    if (Object.keys(payload).length === 0) {
      toast({
        title: "⚠️ Thiếu dữ liệu",
        description: "Vui lòng nhập ít nhất một thông tin cần cập nhật.",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
      const res = await api.put("/updateuser", payload)
      if (res.data?.success) {
        toast({
          title: "Cập nhật thành công",
          description: res.data?.message || "Thông tin của bạn đã được cập nhật.",
        })
        setEmail("")
        setPhone("")
        setPassword("")
      } else {
        toast({
          title: "Cập nhật thất bại",
          description: res.data?.message || "Vui lòng thử lại.",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Lỗi máy chủ",
        description: "Không thể cập nhật thông tin, vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-10 animate-pulse">
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
    )
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-center">
            👤 Thông tin cá nhân
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {user && (
            <>
              <div className="space-y-1">
                <p><strong>Họ tên:</strong> {user.fullName}</p>
                <p><strong>Email hiện tại:</strong> {user.email}</p>
                <p><strong>Số điện thoại:</strong> {user.phone}</p>
                <p><strong>Vai trò:</strong> {user.role}</p>
                {user.createdAt && (
                  <p className="text-muted-foreground text-sm">
                    Ngày tạo tài khoản: {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                )}
              </div>
              <hr className="my-4" />
            </>
          )}

          <h3 className="font-medium text-base">Cập nhật thông tin</h3>

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
            className="w-full mt-4"
            disabled={saving}
          >
            {saving ? "Đang cập nhật..." : "Lưu thay đổi"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
