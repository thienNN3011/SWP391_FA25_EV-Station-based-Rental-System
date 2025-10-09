"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { MapView } from "@/components/map-view"
import { VehicleList } from "@/components/vehicle-list"
import { BookingModal } from "@/components/booking-modal"

export default function BookingPage() {
  // Biến lưu trạm được chọn
  const [selectedStation, setSelectedStation] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-2">Tìm xe điện bạn muốn</h1>
          <p className="text-muted-foreground">Chọn một trạm để xem các xe có sẵn</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Bên trái: danh sách trạm */}
          <div className="space-y-6">
            <MapView onSelectStation={(name) => setSelectedStation(name)} />
          </div>

          {/* Bên phải: danh sách xe tại trạm */}
          <div className="space-y-6">
            <VehicleList stationName={selectedStation ?? ""} />
          </div>
        </div>
      </div>
      <BookingModal />
    </div>
  )
}
