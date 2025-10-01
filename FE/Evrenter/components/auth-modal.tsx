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

interface AuthModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  initialTab: "signin" | "signup"
}

export function AuthModal({ isOpen, onOpenChange, initialTab = "signin" }: AuthModalProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"signin" | "signup">(initialTab)
  const [isSignedUp, setIsSignedUp] = useState(false)
  const [userStatus, setUserStatus] = useState<"unverified" | "verified">("unverified")
  const [error, setError] = useState("")

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

  // ==== Handlers ====
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const username = (document.getElementById("signin-username") as HTMLInputElement).value
    const password = (document.getElementById("signin-password") as HTMLInputElement).value

    try {
      const result = await loginApi(username, password)
      if (!result.token) throw new Error()
      localStorage.setItem("authToken", result.token)
      setUserStatus("verified")
      onOpenChange(false)
      router.push("/")
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
      await registerApi(formData)
      setIsSignedUp(true)
      setUserStatus("unverified")
    } catch (err: any) {
      setError(err.message || "Đăng ký thất bại")
    }
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
                  <Input id="fullName" name="fullName" required />
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
                  <Input id="phone" name="phone" type="tel" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idCard">Số căn cước công dân</Label>
                  <Input id="idCard" name="idCard" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driveLicense">Số giấy phép lái xe</Label>
                  <Input id="driveLicense" name="driveLicense" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idCardPhoto">Ảnh căn cước mặt trước</Label>
                  <Input id="idCardPhoto" name="idCardPhoto" type="file" accept="image/*" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driveLicensePhoto">Ảnh bằng lái</Label>
                  <Input id="driveLicensePhoto" name="driveLicensePhoto" type="file" accept="image/*" required />
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
                Account Created
              </CardTitle>
              <CardDescription>Welcome! Your account has been created successfully.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">Verification Status</span>
                </div>
                <Badge variant={userStatus === "verified" ? "default" : "secondary"}>
                  {userStatus === "verified" ? "Verified" : "Unverified"}
                </Badge>
              </div>

              {userStatus === "unverified" && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Next Step:</strong> Visit a location to complete verification.
                  </p>
                </div>
              )}

              <Button onClick={() => onOpenChange(false)} className="w-full">Continue</Button>
            </CardContent>
          </Card>
          
        )}
      </DialogContent>
      
    </Dialog>
    
  )
}
