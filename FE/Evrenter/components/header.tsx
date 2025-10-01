"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { AuthModal } from "./auth-modal" 

export function Header() {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin")

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/unnamed.jpg"
            alt="Thuê xe điện"
            width={40}
            height={40}
            className="rounded-md"
            priority
          />
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-bold text-foreground">Thuê xe điện</span>
            <span className="text-xs text-muted-foreground">
              Tiện lợi • Tiết kiệm • Thân thiện
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/booking" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Đặt xe ngay
          </Link>
          <Link href="/return" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Trả xe
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Tổng Quan
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setActiveTab("signin"); setIsAuthOpen(true) }}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            Đăng nhập
          </Button>
          <Button
            size="sm"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            onClick={() => { setActiveTab("signup"); setIsAuthOpen(true) }}
          >
            Đăng ký
          </Button>
        </div>
      </div>
      
      {/* Modal dùng chung */}
      <AuthModal
        isOpen={isAuthOpen}
        onOpenChange={setIsAuthOpen}
        initialTab={activeTab}
      />
    </header>
  )
}
