"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { ReturnFlow } from "@/components/return-flow"

export default function ReturnPage() {
  const [isConfirmed, setIsConfirmed] = useState(false)

  // Hard data
  const currentRental = {
    name: "VinFast VF7",
    station: "Quận 3",
    battery: "78%",
    km: 127,
    startTime: "9:00 AM",
    image: "/vf7.jpg",
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-balance mb-2">Trả xe</h1>
            <p className="text-muted-foreground">Hoàn tất trả xe</p>
          </div>

          {!isConfirmed ? (
            <div className="border p-6 rounded-lg shadow flex gap-4">
              <img
                src={currentRental.image}
                alt={currentRental.name}
                className="w-32 h-20 object-cover rounded"
              />
              <div className="flex-1 space-y-1 text-sm">
                <div><strong>Tên xe:</strong> {currentRental.name}</div>
                <div><strong>Trạm:</strong> {currentRental.station}</div>
                <div><strong>Pin:</strong> {currentRental.battery}</div>
                <div><strong>Km đã đi:</strong> {currentRental.km}</div>
                <div><strong>Bắt đầu thuê:</strong> {currentRental.startTime}</div>
                <button
                  className="mt-3 bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary/90"
                  onClick={() => setIsConfirmed(true)}
                >
                  Xác nhận trả xe
                </button>
              </div>
            </div>
          ) : (
            <ReturnFlow />
          )}
        </div>
      </div>
    </div>
  )
}
