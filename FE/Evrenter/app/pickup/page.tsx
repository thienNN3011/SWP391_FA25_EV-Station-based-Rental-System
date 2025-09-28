import { Header } from "@/components/header"
import { PickupFlow } from "@/components/pickup-flow"

export default function PickupPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Nhận xe</h1>
            <p className="text-muted-foreground">
              Hoàn tất quá trình thuê xe của bạn
            </p>
          </div>
          <PickupFlow />
        </div>
      </div>
    </div>
  )
}
