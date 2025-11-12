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
  const [activeTab, setActiveTab] = useState<"signin" | "signup">(initialTab)
  const [isSignedUp, setIsSignedUp] = useState(false)
  const [userStatus, setUserStatus] = useState<"unverified" | "verified">("unverified")
  const [error, setError] = useState("")
  const { login } = useAuth()

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
      body: formData, // multipart/form-data
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || "Đăng ký thất bại")
    }
    return res.json()
  }

    const [showPassword, setShowPassword] = useState(false)


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

    if (decoded.role === "ADMIN") {
      router.push("/admin")
    } else if (decoded.role === "RENTER" || decoded.role === "USER") {
      router.push("/")
    } else if (decoded.role === "STAFF" || decoded.role === "STAFF") {
      router.push("/staff")
    }
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

    // supabase de upload anh
    const uploadToSupabase = async (file: File, folder: string) => {
      const fileName = `${folder}/${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from("uploads").upload(fileName, file)
      if (error) throw error
      const { data } = supabase.storage.from("uploads").getPublicUrl(fileName)
      return data.publicUrl
    }

    const idCardUrl = await uploadToSupabase(idCardPhoto, "idcards")
    const driveUrl = await uploadToSupabase(driveLicensePhoto, "licenses")

    // 
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
     console.log("form gửi lên backend:", payload)

   
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
    setUserStatus("unverified") //set trang thai cho tai khoan vua tao
  } catch (err: any) {
    console.error("Upload/Register error:", err)
    setError(err.message || "Đăng ký thất bại")
  }
}
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  const formData = new FormData(e.currentTarget)
  const phone = formData.get("phone") as string
  const email = formData.get("email") as string
  const idCard = formData.get("idCard") as string
  const driveLicense = formData.get("driveLicense") as string
  const fullName = formData.get("fullName") as string
  const username = formData.get("username") as string

  
  const phoneRegex = /^(0[1-9][0-9]{8})$/
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const idCardRegex = /^\d{9}|\d{12}$/ 
  const driveLicenseRegex = /^\d{8,12}$/ 
  const nameRegex = /^[\p{L}\s]+$/u
  const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/ 
  if (!phoneRegex.test(phone)) {
    setError("Số điện thoại không hợp lệ")
    return
  }
  if (!emailRegex.test(email)) {
    setError("Email không hợp lệ")
    return
  }
  if (!idCardRegex.test(idCard)) {
    setError("Số CCCD phải có 9 hoặc 12 số")
    return
  }
  if (!driveLicenseRegex.test(driveLicense)) {
    setError("Số GPLX phải từ 8 đến 12 số")
    return
  }
  if (!nameRegex.test(fullName)) {
    setError("Họ tên chỉ được chứa chữ cái và khoảng trắng")
    return
  }
  if (!usernameRegex.test(username)) {
    setError("Tên đăng nhập phải từ 4-20 ký tự, chỉ chứa chữ, số hoặc gạch dưới")
    return
  }

  setError("") 
  console.log("Form OK:", Object.fromEntries(formData))
}


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-500" >
            <User className="h-5 w-5" />
            Thuê xe ngay nào!
          </DialogTitle>
        </DialogHeader>

        {!isSignedUp ? (
          <Tabs
                  value={activeTab as string}        
                  onValueChange={(val) => setActiveTab(val as "signin" | "signup")}
                    className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Đăng nhập</TabsTrigger>
              <TabsTrigger value="signup">Đăng Ký</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-username">Tên đăng nhập</Label>
                  <Input id="signin-username" type="text" placeholder="Tên đăng nhập" required />
                </div>
                            <div className="relative space-y-2">
  <Label htmlFor="signin-password">Mật Khẩu</Label>
  <Input
    id="signin-password"
    type={showPassword ? "text" : "password"}
    placeholder="••••••••"
    required
    className="pr-10 h-10" 
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
  >
    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
  </button>
</div>



                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full">Đăng Nhập</Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4" encType="multipart/form-data">
                <div className="space-y-2">
  <Label htmlFor="fullName">Họ và tên</Label>
  <Input
    id="fullName"
    name="fullName"
    required
    pattern="^[\p{L}\s]+$"
    title="Họ và tên chỉ được chứa chữ cái và khoảng trắng"
  />
</div>

                <div className="space-y-2">
                  <Label htmlFor="username">Tên đăng nhập</Label>
                  <Input id="username" name="username" required />
                </div>
                    <div className="relative space-y-2">
  <Label htmlFor="password">Mật Khẩu</Label>
  <Input
    id="password"
    name="password"
    type={showPassword ? "text" : "password"} 
    required
    className="pr-10 h-10" 
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
  >
    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
  </button>
</div>

                    <div className="space-y-2">
    <Label htmlFor="phone">Số điện thoại</Label>
    <Input
      id="phone"
      name="phone"
      type="tel"
      required
      pattern="^(0[0-9]{9})$" 
      title="Số điện thoại bắt đầu bằng 0 và có 10 số"
    />
  </div>

  <div className="space-y-2">
    <Label htmlFor="email">Email</Label>
    <Input
      id="email"
      name="email"
      type="email"
      required
    />
  </div>

  <div className="space-y-2">
    <Label htmlFor="idCard">Số căn cước công dân</Label>
    <Input
      id="idCard"
      name="idCard"
      required
      pattern="^[0-9]{12}$" 
      title="Vui lòng nhập đủ và đúng 12 số trên CCCD"
    />
  </div>

  <div className="space-y-2">
    <Label htmlFor="driveLicense">Số giấy phép lái xe</Label>
    <Input
      id="driveLicense"
      name="driveLicense"
      required
      pattern="^[0-9]{12}$" 
      title="Vui lòng nhập đủ và đúng 12 số trên GPLX"
    />
  </div>

  <div className="space-y-2">
    <Label htmlFor="idCardPhoto">Ảnh căn cước mặt trước</Label>
    <Input
      id="idCardPhoto"
      name="idCardPhoto"
      type="file"
      accept="image/*"
      required
      title="Vui lòng up đúng ảnh căn cước mặt trước"
    />
  </div>

  <div className="space-y-2">
    <Label htmlFor="driveLicensePhoto">Ảnh GPLX</Label>
    <Input
      id="driveLicensePhoto"
      name="driveLicensePhoto"
      type="file"
      accept="image/*"
      required
      title="Vui lòng up đúng ảnh giấy phép lái xe"
    />
  </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full">Tạo tài khoản</Button>
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
                    <strong>Bước tiếp theo:</strong> Chờ đợi tài khoản được xác minh hoặc liên hệ ngay với nhân viên tại trạm xe để được xác minh ngay lập tức!.
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
