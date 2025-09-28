"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DigitalCheckin } from "@/components/digital-checkin"
import { ESignature } from "@/components/e-signature"
import { VehicleInspection } from "@/components/vehicle-inspection"
import type { Vehicle } from "@/lib/types"

// Mock vehicles giống bên VehicleList
const mockVehicles: Vehicle[] = [
  {
    id: "1",
    model: "VinFast VF 3",
    imageUrl: "/vf3.png",
    batteryLevel: 100,
    estimatedRange: 210,
    pricePerHour: 25,
    locationId: "1",
    isAvailable: true,
  },
  {
    id: "2",
    model: "VinFast VF 5",
    imageUrl: "/vf5.jpg",
    batteryLevel: 100,
    estimatedRange: 300,
    pricePerHour: 35,
    locationId: "1",
    isAvailable: true,
  },
  {
    id: "3",
    model: "VinFast VF 6",
    imageUrl: "/vf6-plus.jpg",
    batteryLevel: 100,
    estimatedRange: 460,
    pricePerHour: 52,
    locationId: "1",
    isAvailable: true,
  },
  {
    id: "4",
    model: "VinFast VF 7",
    imageUrl: "/vf7.jpg",
    batteryLevel: 100,
    estimatedRange: 490,
    pricePerHour: 70,
    locationId: "1",
    isAvailable: true,
  },
  {
    id: "5",
    model: "VinFast VF 8",
    imageUrl: "/vf8.jpg",
    batteryLevel: 100,
    estimatedRange: 470,
    pricePerHour: 70,
    locationId: "1",
    isAvailable: true,
  },
  {
    id: "6",
    model: "VinFast VF 9",
    imageUrl: "/vf9.jpg",
    batteryLevel: 100,
    estimatedRange: 580,
    pricePerHour: 110,
    locationId: "1",
    isAvailable: true,
  },
]

export function PickupFlow() {
  const searchParams = useSearchParams()
  const vehicleId = searchParams.get("vehicleId") 

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [currentStep, setCurrentStep] = useState<"checkin" | "signature" | "inspection" | "complete">("checkin")
  const [photos, setPhotos] = useState<string[]>([])

  useEffect(() => {
    if (vehicleId) {
      const found = mockVehicles.find((v) => v.id === vehicleId)
      setSelectedVehicle(found || null)
    }
  }, [vehicleId])

  const steps = [
    { id: "checkin", label: "Check-in" },
    { id: "signature", label: "E-Signature" },
    { id: "inspection", label: "Inspection" },
    { id: "complete", label: "Complete" },
  ]

  const handlePhotoUpload = (newPhoto: string) => {
    setPhotos((prev) => [...prev, newPhoto])
  }

  if (!selectedVehicle) {
    return <div className="text-center text-red-500">Không tìm thấy xe</div>
  }

  return (
    <div className="space-y-6">
      <Card className="border-secondary/20 bg-secondary/5">
        <CardHeader>
          <CardTitle>{selectedVehicle.model}</CardTitle>
          <CardDescription>
            Thuê xe #{selectedVehicle.id}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Progress */}
      <Progress
        value={((steps.findIndex((s) => s.id === currentStep) + 1) / steps.length) * 100}
      />

      {/* Các bước */}
      {currentStep === "checkin" && (
        <DigitalCheckin onComplete={() => setCurrentStep("signature")} />
      )}

      {currentStep === "signature" && (
  <ESignature
    onComplete={() => setCurrentStep("inspection")}
  />
)}


      {currentStep === "inspection" && (
        <VehicleInspection
          vehicle={selectedVehicle} 
          onComplete={() => setCurrentStep("complete")}
        />
      )}

      {currentStep === "complete" && <div>Pickup Complete! (lam trang cam on da thue xe sau)</div>}
    </div>
  )
}