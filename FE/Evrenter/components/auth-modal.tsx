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
    const res = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
    if (!res.ok) throw new Error()
    return res.json()
  }

  async function registerApi(formData: FormData) {
    const res = await fetch("http://localhost:8080/users", {
      method: "POST",
      body: formData, // multipart/form-data
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || "Đăng ký thất bại")
    }
    return res.json()
  }

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
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Access
          </DialogTitle>
        </DialogHeader>

        {!isSignedUp ? (
          <Tabs
                  value={activeTab as string}        
                  onValueChange={(val) => setActiveTab(val as "signin" | "signup")}
                    className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-username">Username</Label>
                  <Input id="signin-username" type="text" placeholder="Your username" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input id="signin-password" type="password" placeholder="••••••••" required />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full">Sign In</Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4" encType="multipart/form-data">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" name="fullName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" name="username" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idCard">ID Card</Label>
                  <Input id="idCard" name="idCard" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driveLicense">Driver License</Label>
                  <Input id="driveLicense" name="driveLicense" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idCardPhoto">ID Card Photo</Label>
                  <Input id="idCardPhoto" name="idCardPhoto" type="file" accept="image/*" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driveLicensePhoto">Driver License Photo</Label>
                  <Input id="driveLicensePhoto" name="driveLicensePhoto" type="file" accept="image/*" required />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full">Create Account</Button>
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
