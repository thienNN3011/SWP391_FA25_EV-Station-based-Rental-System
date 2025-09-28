import { Header } from "@/components/header"
import { DashboardOverview } from "@/components/dashboard-overview"
import { RentalHistory } from "@/components/rental-history"
import { UserAnalytics } from "@/components/user-analytics"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-2">Thống kê</h1>
          <p className="text-muted-foreground">Theo dõi hoạt động thuê xe và tác động môi trường của bạn</p>
        </div>

        <div className="space-y-8">
          <DashboardOverview />

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <RentalHistory />
            </div>
            <div>
              <UserAnalytics />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
