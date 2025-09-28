// API Types for EcoRide Application

export interface Location {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  availableVehicles: number
}

export interface Vehicle {
  id: string
  model: string
  imageUrl: string
  batteryLevel: number
  estimatedRange: number
  pricePerHour: number
  locationId: string
  isAvailable: boolean
}

export interface Booking {
  id: string
  vehicleId: string
  userId: string
  startTime: string
  endTime: string
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled"
  totalCost?: number
  checkInPhotos: Photo[]     
  checkOutPhotos: Photo[]
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  isVerified: boolean
  createdAt: string
}

export interface RentalHistory {
  id: string
  vehicleModel: string
  startDate: string
  endDate: string
  duration: number
  cost: number
  location: string
}

export interface UserAnalytics {
  totalRentals: number
  totalDistance: number
  co2Saved: number
  favoriteVehicleType: string
  monthlyUsage: Array<{
    month: string
    rentals: number
    cost: number
  }>
}
export interface Photo {
  id: string
  bookingId: string
  type: "FRONT" | "BACK" | "LEFT" | "RIGHT" | "INTERIOR" | "DASHBOARD"
  url: string
  uploadedBy: string 
  uploadedAt: string
}

