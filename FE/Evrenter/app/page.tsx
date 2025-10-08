import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { AuthModal } from "@/components/auth-modal"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      
      <Hero />

      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Bạn đã sẵn sàng cho xe điện chưa</h2>
          <p className="text-muted-foreground mb-6">Tìm và đặt xe điện lý tưởng của bạn chỉ trong vài giây</p>
          <Link href="/booking">
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <MapPin className="mr-2 h-5 w-5" />
              Đặt xe ngay
            </Button>
          </Link>
        </div>
      </section>

    </div>
  )
}
