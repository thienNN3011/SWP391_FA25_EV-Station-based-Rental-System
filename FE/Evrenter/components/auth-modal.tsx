"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, User } from "lucide-react"

export function AuthModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSignedUp, setIsSignedUp] = useState(false)
  const [userStatus, setUserStatus] = useState<"unverified" | "verified">("unverified")

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSignedUp(true)
    setUserStatus("unverified")
  }

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate sign in - in real app this would call API
    setUserStatus("verified")
    setIsOpen(false)
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 z-50 shadow-lg">
        <User className="mr-2 h-4 w-4" />
        Account
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Access
            </DialogTitle>
          </DialogHeader>

          {!isSignedUp ? (
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input id="signin-email" type="email" placeholder="your@email.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input id="signin-password" type="password" placeholder="••••••••" required />
                  </div>
                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your@email.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" required />
                  </div>
                  <Button type="submit" className="w-full">
                    Create Account
                  </Button>
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
                <CardDescription>Welcome to EcoRide! Your account has been created successfully.</CardDescription>
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
                      <strong>Next Step:</strong> Visit any EcoRide location to complete your verification. Bring a
                      valid driver's license and complete the in-person verification process.
                    </p>
                  </div>
                )}

                <Button onClick={() => setIsOpen(false)} className="w-full">
                  Continue
                </Button>
              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
