import { useState } from 'react'
import { 
  Car, 
  Users, 
  UserCheck, 
  MapPin, 
  TrendingUp, 
  FileText,
  Home,
  Menu
} from 'lucide-react'
import { Button } from './components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet'
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider } from './components/ui/sidebar'

// Import các trang quản lý
import { Dashboard } from './components/Dashboard'
import { UserManagement } from './components/UserManagement'
import { StaffManagement } from './components/StaffManagement'
import { VehicleManagement } from './components/VehicleManagement'
import { LocationManagement } from './components/LocationManagement'
import { RevenueManagement } from './components/RevenueManagement'
import { OrderManagement } from './components/OrderManagement'

type ActivePage = 'dashboard' | 'users' | 'staff' | 'vehicles' | 'locations' | 'revenue' | 'orders'

const menuItems = [
  { id: 'dashboard' as ActivePage, label: 'Trang chủ', icon: Home },
  { id: 'users' as ActivePage, label: 'Quản lý khách hàng', icon: Users },
  { id: 'staff' as ActivePage, label: 'Quản lý nhân viên', icon: UserCheck },
  { id: 'vehicles' as ActivePage, label: 'Quản lý xe', icon: Car },
  { id: 'locations' as ActivePage, label: 'Quản lý điểm thuê', icon: MapPin },
  { id: 'revenue' as ActivePage, label: 'Doanh thu & Thống kê', icon: TrendingUp },
  { id: 'orders' as ActivePage, label: 'Quản lý đơn thuê', icon: FileText },
]

function AdminSidebar({ activePage, setActivePage }: { activePage: ActivePage, setActivePage: (page: ActivePage) => void }) {
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

function MobileSidebar({ activePage, setActivePage }: { activePage: ActivePage, setActivePage: (page: ActivePage) => void }) {
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
    case 'dashboard':
      return <Dashboard />
    case 'users':
      return <UserManagement />
    case 'staff':
      return <StaffManagement />
    case 'vehicles':
      return <VehicleManagement />
    case 'locations':
      return <LocationManagement />
    case 'revenue':
      return <RevenueManagement />
    case 'orders':
      return <OrderManagement />
    default:
      return <Dashboard />
  }
}

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('dashboard')

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 border-r bg-card">
          <AdminSidebar activePage={activePage} setActivePage={setActivePage} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header với mobile menu */}
          <header className="border-b bg-card px-4 py-3 md:hidden shrink-0">
            <div className="flex items-center justify-between">
              <h1 className="text-lg">RentCar Admin</h1>
              <MobileSidebar activePage={activePage} setActivePage={setActivePage} />
            </div>
          </header>

          {/* Page Content - Full screen */}
          <main className="flex-1 w-full">
            {renderActivePage(activePage)}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}