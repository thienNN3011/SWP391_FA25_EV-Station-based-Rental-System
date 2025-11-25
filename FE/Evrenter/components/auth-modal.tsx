"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, User } from "lucide-react"
import { Eye, EyeOff } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "./auth-context"
import { supabase } from "@/lib/supabaseClient"

interface AuthModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  initialTab: "signin" | "signup"
}
interface TokenPayload {
  username: string;
  role: string;
  fullName: string;
}

export function AuthModal({ isOpen, onOpenChange, initialTab = "signin" }: AuthModalProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"signin" | "signup" | "forgot">(initialTab)
  const [isSignedUp, setIsSignedUp] = useState(false)
  const [userStatus, setUserStatus] = useState<"unverified" | "verified">("unverified")
  const [error, setError] = useState("")
  const { login } = useAuth()

  const [showPassword, setShowPassword] = useState(false)

  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotMessage, setForgotMessage] = useState("")
  const [forgotError, setForgotError] = useState("")

  // Reset tab khi modal mở lại
  useEffect(() => {
    if (isOpen) setActiveTab(initialTab)
  }, [isOpen, initialTab])

  // ==== API Call ====
  async function loginApi(username: string, password: string) {
    const res = await fetch("http://localhost:8080/EVRental/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
    if (!res.ok) throw new Error()
    return res.json()
  }

  async function registerApi(formData: FormData) {
    const res = await fetch("http://localhost:8080/EVRental/users", {
      method: "POST",
      body: formData,
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || "Đăng ký thất bại")
    }
    return res.json()
  }

  async function sendForgotPassword(email: string) {
    const res = await fetch("http://localhost:8080/EVRental/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    if (!res.ok) throw new Error("Gửi email thất bại")
    return res.json()
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const username = (document.getElementById("signin-username") as HTMLInputElement).value
    const password = (document.getElementById("signin-password") as HTMLInputElement).value

    try {
      const result = await loginApi(username, password)
      if (!result.token) throw new Error()

      const decoded = jwtDecode<{ username: string; role: string; fullName: string }>(result.token)

      login(
        {
          username: decoded.username,
          role: decoded.role,
          fullName: decoded.fullName,
        },
        result.token
      )

      onOpenChange(false)

      if (decoded.role === "ADMIN") router.push("/admin")
      else if (decoded.role === "RENTER" || decoded.role === "USER") router.push("/")
      else router.push("/staff")
    } catch {
      setError("Sai tài khoản hoặc mật khẩu")
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    try {
      const idCardPhoto = formData.get("idCardPhoto") as File
      const driveLicensePhoto = formData.get("driveLicensePhoto") as File

      const uploadToSupabase = async (file: File, folder: string) => {
        const fileName = `${folder}/${Date.now()}-${file.name}`
        const { error } = await supabase.storage.from("uploads").upload(fileName, file)
        if (error) throw error
        const { data } = supabase.storage.from("uploads").getPublicUrl(fileName)
        return data.publicUrl
      }

      const idCardUrl = await uploadToSupabase(idCardPhoto, "idcards")
      const driveUrl = await uploadToSupabase(driveLicensePhoto, "licenses")

      const payload = {
        username: formData.get("username"),
        password: formData.get("password"),
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        idCard: formData.get("idCard"),
        driveLicense: formData.get("driveLicense"),
        role: "RENTER",
        status: "PENDING",
        idCardPhoto: idCardUrl,
        driveLicensePhoto: driveUrl,
        createdDate: new Date().toISOString(),
      }

      const res = await fetch("http://localhost:8080/EVRental/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || "Đăng ký thất bại")
      }

      setIsSignedUp(true)
      setUserStatus("unverified")
    } catch (err: any) {
      console.error("Upload/Register error:", err)
      setError(err.message || "Đăng ký thất bại")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-500">
            <User className="h-5 w-5" />
            Thuê xe ngay nào!
          </DialogTitle>
        </DialogHeader>

        {!isSignedUp ? (
          <Tabs
            value={activeTab as string}
            onValueChange={(val) => setActiveTab(val as "signin" | "signup" | "forgot")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="signin">Đăng nhập</TabsTrigger>
              <TabsTrigger value="signup">Đăng ký</TabsTrigger>
              <TabsTrigger value="forgot">Quên mật khẩu</TabsTrigger>
            </TabsList>

            {/* Sign In Tab */}
            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-username">Tên đăng nhập</Label>
                  <Input id="signin-username" type="text" placeholder="Tên đăng nhập" required />
                </div>
                 <div className="relative space-y-2">
                  <Label htmlFor="signin-password">Mật khẩu</Label>
                   <div className="relative">
                  <Input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full">Đăng Nhập</Button>
              </form>
            </TabsContent>

          
<TabsContent value="signup" className="space-y-4">
  <form onSubmit={handleSignUp} className="space-y-4" encType="multipart/form-data">
    <div className="space-y-2">
      <Label htmlFor="fullName">Họ và tên</Label>
      <Input id="fullName" name="fullName" required pattern="^[\\p{L}\\s]+$" title="Chỉ chữ và khoảng trắng" />
    </div>

    <div className="space-y-2">
      <Label htmlFor="username">Tên đăng nhập</Label>
      <Input id="username" name="username" required pattern="^[a-zA-Z0-9_]{4,20}$" title="4-20 ký tự, chữ/số/_" />
    </div>

   <div className="relative space-y-2">
      <Label htmlFor="password">Mật khẩu</Label>
       <div className="relative">
      <Input id="password" name="password" type={showPassword ? "text" : "password"} required className="pr-10" />
      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 hover:text-gray-700">
        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
    </div>

    <div className="space-y-2">
      <Label htmlFor="phone">Số điện thoại</Label>
      <Input id="phone" name="phone" type="tel" required pattern="^(0[0-9]{9})$" title="Bắt đầu 0, 10 số" />
    </div>

    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" name="email" type="email" required />
    </div>

    <div className="space-y-2">
      <Label htmlFor="idCard">Số CCCD</Label>
     <Input id="idCard" name="idCard" required pattern="^\d{9}$|^\d{12}$" title="9 hoặc 12 số" />

    </div>

    <div className="space-y-2">
      <Label htmlFor="driveLicense">Số GPLX</Label>
      <Input id="driveLicense" name="driveLicense" required pattern="^\d{9}$|^\d{12}$" title="9 hoặc 12 số" />

    </div>

    <div className="space-y-2">
      <Label htmlFor="idCardPhoto">Ảnh CCCD</Label>
      <Input id="idCardPhoto" name="idCardPhoto" type="file" accept="image/*" required />
    </div>

    <div className="space-y-2">
      <Label htmlFor="driveLicensePhoto">Ảnh GPLX</Label>
      <Input id="driveLicensePhoto" name="driveLicensePhoto" type="file" accept="image/*" required />
    </div>

    {error && <p className="text-red-500 text-sm">{error}</p>}
    <Button type="submit" className="w-full">Tạo tài khoản</Button>
  </form>
</TabsContent>


            {/* Forgot Password Tab */}
            <TabsContent value="forgot" className="space-y-4">
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  setForgotMessage("")
                  setForgotError("")

                  try {
                    const res = await sendForgotPassword(forgotEmail)
                    if (res.success) {
                      setForgotMessage("Email reset mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư.")
                    } else {
                      setForgotError(res.message || "Gửi email thất bại")
                    }
                  } catch (err) {
                    console.error(err)
                    setForgotError("Có lỗi xảy ra, vui lòng thử lại")
                  }
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email đăng ký</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
                {forgotMessage && <p className="text-green-500 text-sm">{forgotMessage}</p>}
                {forgotError && <p className="text-red-500 text-sm">{forgotError}</p>}
                <Button type="submit" className="w-full">Gửi email</Button>
              </form>
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Tài khoản đã được tạo
              </CardTitle>
              <CardDescription>Xin chúc mừng! Bạn đã tạo tài khoản thành công!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">Trạng thái tài khoản</span>
                </div>
                <Badge variant={userStatus === "verified" ? "default" : "secondary"}>
                  {userStatus === "verified" ? "Verified" : "Chưa xác thực"}
                </Badge>
              </div>

              {userStatus === "unverified" && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Bước tiếp theo:</strong> Chờ đợi tài khoản được xác minh hoặc liên hệ ngay với nhân viên tại trạm xe để được xác minh ngay lập tức!
                  </p>
                </div>
              )}

              <Button onClick={() => onOpenChange(false)} className="w-full">Kết thúc</Button>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  )
}
