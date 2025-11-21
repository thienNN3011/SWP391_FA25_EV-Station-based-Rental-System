"use client"

import { useState } from "react"
import { Car, Users, MapPin, Home, Menu, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider
} from "@/components/ui/sidebar"

import { UserManagementStaff } from "@/components/staff/UserManagementStaff"
import { LocationManagementStaff } from "./LocationManagementStaff"
import { BookingStaff } from "./BookingStaff"
import StartRentalStaff from "./StartRental"
import EndRentalStaff from "./EndRentalStaff"
import IncidentReportStaff  from "./IcidentReportStaff"
import { useAuth } from "@/components/auth-context"
import { AuthModal } from "@/components/auth-modal"
import { Dashboard } from "./DashboardStaff"
import { useRouter } from "next/navigation"

type ActivePage = "dashboard" | "users" | "station" | "booking" | "rental" | "endrental" | "incident"

const menuItems = [
  { id: "dashboard" as ActivePage, label: "Trang chủ", icon: Home },
  { id: "users" as ActivePage, label: "Quản lý khách hàng", icon: Users },
  { id: "station" as ActivePage, label: "Quản lý điểm thuê", icon: MapPin },
  { id: "booking" as ActivePage, label: "Quản lý booking", icon: MapPin },
  { id: "rental" as ActivePage, label: "Bắt đầu hợp đồng", icon: MapPin },
  { id: "endrental" as ActivePage, label: "Khách hàng trả xe", icon: MapPin },
  { id: "incident" as ActivePage, label: "Báo cáo sự cố", icon: MapPin },
]

function AdminSidebar({ activePage, setActivePage }: { activePage: ActivePage; setActivePage: (page: ActivePage) => void }) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Car className="size-8 text-primary" />
          <div>
            <h2 className="text-lg">Nhân Viên</h2>
            <p className="text-sm text-muted-foreground">Hệ thống quản lý của nhân viên</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => setActivePage(item.id)}
                isActive={activePage === item.id}
                className="w-full justify-start"
              >
                <item.icon className="size-4" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

function MobileSidebar({ activePage, setActivePage }: { activePage: ActivePage; setActivePage: (page: ActivePage) => void }) {
  const [open, setOpen] = useState(false)
  const handlePageChange = (page: ActivePage) => {
    setActivePage(page)
    setOpen(false)
  }
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex items-center gap-2 px-4 py-6 border-b">
          <Car className="size-8 text-primary" />
          <div>
            <h2 className="text-lg">Nhân viên</h2>
            <p className="text-sm text-muted-foreground">Hệ thống nhân viên</p>
          </div>
        </div>
        <div className="p-4">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activePage === item.id ? "default" : "ghost"}
              className="w-full justify-start mb-2"
              onClick={() => handlePageChange(item.id)}
            >
              <item.icon className="size-4 mr-2" />
              {item.label}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function renderActivePage(activePage: ActivePage) {
  switch (activePage) {
    case "dashboard":
      return <Dashboard />
    case "users":
      return <UserManagementStaff />
    case "station":
      return <LocationManagementStaff />
    case "booking":
      return <BookingStaff />
    case "rental":
      return <StartRentalStaff />
    case "endrental":
      return <EndRentalStaff />
    case "incident":
      return <IncidentReportStaff />  
    default:
      return <Dashboard />
  }
}

export default function AppStaff() {
  const [activePage, setActivePage] = useState<ActivePage>("dashboard")
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("http://localhost:3000")
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <div className="hidden md:block w-64 border-r bg-card">
          <AdminSidebar activePage={activePage} setActivePage={setActivePage} />
        </div>

        <div className="flex-1 flex flex-col min-h-screen">
          <header className="border-b bg-card px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MobileSidebar activePage={activePage} setActivePage={setActivePage} />
              <h1 className="text-lg font-semibold">Ứng dụng nhân viên</h1>
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <span className="text-sm font-medium">{user.fullName}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout} 
                    className="flex items-center gap-2 text-red-600"
                  >
                    <LogOut className="h-4 w-4" /> Đăng xuất
                  </Button>
                </>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsAuthOpen(true)}
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" /> Đăng nhập
                </Button>
              )}
            </div>
          </header>

          <AuthModal isOpen={isAuthOpen} onOpenChange={setIsAuthOpen} initialTab="signin" />

          <main className="flex-1 w-full overflow-visible relative z-0">
            {renderActivePage(activePage)}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
