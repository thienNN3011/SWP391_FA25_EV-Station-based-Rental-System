"use client"

import { useState } from "react"
import { Car, Users, MapPin, TrendingUp, FileText, Home, Menu, LogOut } from "lucide-react"
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


import { UserManagement } from "@/components/admin/UserManagement"
import { VehicleManagement } from "@/components/admin/VehicleManagement"
import { LocationManagement } from "@/components/admin/LocationManagement"
import { RevenueManagement } from "@/components/admin/RevenueManagement"
import { OrderManagement } from "@/components/admin/OrderManagement"
import IncidentReportManagement from "@/components/admin/IncidentReportAdmin"
import { useAuth } from "@/components/auth-context"  
import SystemConfigAdmin from "./SystemConfigAdmin"
import RefundManagementPage from "./RefundManagementPage"
type ActivePage =  "users" | "vehicles" | "locations" | "revenue" | "orders" | "incident" | "config" | "refund"

const menuItems = [
  
  { id: "users" as ActivePage, label: "Quản lý người dùng", icon: Users },
  { id: "vehicles" as ActivePage, label: "Quản lý xe", icon: Car },
  { id: "locations" as ActivePage, label: "Quản lý điểm thuê", icon: MapPin },
  { id: "revenue" as ActivePage, label: "Doanh thu & Thống kê", icon: TrendingUp },
  { id: "orders" as ActivePage, label: "Quản lý đơn thuê", icon: FileText },
  { id: "incident" as ActivePage, label: "Báo cáo tai nạn", icon: FileText },
   { id: "config" as ActivePage, label: "Cấu hình hệ thống", icon: FileText },
   { id: "refund" as ActivePage, label: "Hoàn tiền booking", icon: FileText },
]

function AdminSidebar({ activePage, setActivePage }: { activePage: ActivePage; setActivePage: (page: ActivePage) => void }) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Car className="size-8 text-primary" />
          <div>
            <h2 className="text-lg">RentCar Admin</h2>
            <p className="text-sm text-muted-foreground">Hệ thống quản lý</p>
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
            <h2 className="text-lg">RentCar Admin</h2>
            <p className="text-sm text-muted-foreground">Hệ thống quản lý</p>
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
    case "users":
      return <UserManagement />
    case "vehicles":
      return <VehicleManagement />
    case "locations":
      return <LocationManagement />
    case "revenue":
      return <RevenueManagement />
    case "orders":
      return <OrderManagement />
    case "incident":
      return <IncidentReportManagement />
    case "config":
      return <SystemConfigAdmin />
     case "refund":
      return <RefundManagementPage />  
  }
}

export default function AppAdmin() {
  const [activePage, setActivePage] = useState<ActivePage>("dashboard")
  const { user, logout } = useAuth()

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
              <h1 className="text-lg font-semibold">Ứng dụng quản trị</h1>
            </div>

            <div className="flex items-center gap-3">
              {user && (
                <>
                  <span className="text-sm font-medium">{user.fullName}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="flex items-center gap-2 text-red-600"
                  >
                    <LogOut className="h-4 w-4" /> Đăng xuất
                  </Button>
                </>
              )}
            </div>
          </header>

          <main className="flex-1 w-full overflow-visible relative z-0">
            {renderActivePage(activePage)}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
