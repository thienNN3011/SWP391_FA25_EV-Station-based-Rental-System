"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Zap, Leaf, MapPin, Clock } from "lucide-react"

export function Hero() {
  const [stationCount, setStationCount] = useState<number>(0)

  // Fetch the number of active stations
  useEffect(() => {
    const fetchStationCount = async () => {
      try {
        const response = await fetch("http://localhost:8080/EVRental/showactivestation")
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const result = await response.json()
        if (result.success && result.data) {
          setStationCount(result.data.length) 
        }
      } catch (error) {
        console.error("Failed to fetch station count:", error)
      }
    }

    fetchStationCount()
  }, [])

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
                Lái xe điện, <br />
                <span className="text-secondary">Lái xe sạch</span>
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-md">
                Trải nghiệm phương tiện tương lai với dịch vụ cho thuê xe điện của chúng tôi.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="./booking">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  <MapPin className="mr-2 h-5 w-5" />
                  Tìm địa điểm thuê xe gần nhất
                </Button>
              </Link>
              <Link href="./booking">
                <Button variant="outline" size="lg">
                  <Zap className="mr-2 h-5 w-5" />
                  Chọn mẫu xe
                </Button>
              </Link>
            </div>

            {/* Statistics Section */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">{stationCount}</div>
                <div className="text-sm text-muted-foreground">Trạm thuê xe</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">100%</div>
                <div className="text-sm text-muted-foreground">Xe điện</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">24/7</div>
                <div className="text-sm text-muted-foreground">Hoạt động</div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="/vf9.png"
                alt="Electric vehicle in natural setting"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/20 rounded-full blur-xl"></div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <Card className="p-6 text-center border-primary/20 bg-primary/5">
            <Leaf className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Không khí thải</h3>
            <p className="text-sm text-muted-foreground">100% xe điện cho môi trường trong lành hơn</p>
          </Card>

          <Card className="p-6 text-center border-secondary/20 bg-secondary/5">
            <Zap className="h-12 w-12 text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sạc nhanh</h3>
            <p className="text-sm text-muted-foreground">Trạm sạc nhanh ở mọi trạm sạc</p>
          </Card>

          <Card className="p-6 text-center border-primary/20 bg-primary/5">
            <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Đặt xe ngay</h3>
            <p className="text-sm text-muted-foreground">Đặt xe của bạn trong vài giây, thao tác đơn giản</p>
          </Card>
        </div>
      </div>
    </section>
  )
}