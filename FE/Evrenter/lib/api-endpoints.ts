// API Endpoints Documentation for EcoRide Frontend

/**
 * Authentication Endpoints
 */

// POST /api/auth/signup
// Body: { name: string, email: string, phone: string }
// Response: { userId: string, status: "unverified" | "verified", message: string }

// POST /api/auth/signin
// Body: { email: string, password: string }
// Response: { userId: string, token: string, user: User }

// POST /api/auth/verify
// Body: { userId: string, verificationCode: string }
// Response: { success: boolean, user: User }

/**
 * Location & Vehicle Endpoints
 */

// GET /api/locations
// Response: Location[]
// Example: [{ id: "1", name: "Downtown Station", address: "123 Main St", lat: 40.7128, lng: -74.0060, availableVehicles: 8 }]

// GET /api/vehicles?locationId=<ID>
// Response: Vehicle[]
// Example: [{ id: "1", model: "Tesla Model 3", imageUrl: "...", batteryLevel: 95, estimatedRange: 280, pricePerHour: 25, locationId: "1", isAvailable: true }]

// GET /api/vehicles/<vehicleId>
// Response: Vehicle

/**
 * Booking Endpoints
 */

// POST /api/bookings
// Body: { vehicleId: string, userId: string, startTime?: string, endTime?: string, type: "reserve" | "rent-now" }
// Response: { bookingId: string, status: "pending" | "confirmed", estimatedCost: number }

// GET /api/bookings/<bookingId>
// Response: Booking

// PUT /api/bookings/<bookingId>/status
// Body: { status: "confirmed" | "active" | "completed" | "cancelled" }
// Response: { success: boolean, booking: Booking }

/**
 * Pickup Process Endpoints
 */

// POST /api/bookings/<bookingId>/checkin
// Body: { userId: string, locationId: string }
// Response: { success: boolean, message: string, nextStep: "signature" }

// POST /api/bookings/<bookingId>/signature
// Body: { signatureData: string, userId: string }
// Response: { success: boolean, signatureId: string, nextStep: "inspection" }

// POST /api/bookings/<bookingId>/inspection
// Body: { checklist: string[], images: File[], userId: string }
// Response: { success: boolean, inspectionId: string, vehicleUnlocked: boolean }

/**
 * Return Process Endpoints
 */

// POST /api/bookings/<bookingId>/return
// Body: { userId: string, locationId: string, finalMileage: number, batteryLevel: number }
// Response: { success: boolean, returnId: string, status: "parked" }

// GET /api/returns/<returnId>/status
// Response: { status: "parked" | "inspecting" | "processing" | "complete", estimatedCompletion: string }

// GET /api/returns/<returnId>/payment
// Response: {
//   baseRate: number,
//   duration: number,
//   mileage: number,
//   mileageRate: number,
//   subtotal: number,
//   tax: number,
//   total: number,
//   paymentMethod: string,
//   co2Saved: number,
//   fuelSavings: number
// }

/**
 * User Dashboard Endpoints
 */

// GET /api/users/<userId>/rentals
// Response: RentalHistory[]
// Example: [{ id: "1", vehicleModel: "Tesla Model 3", startDate: "2024-01-15T09:00:00Z", endDate: "2024-01-15T12:24:00Z", duration: 3.4, cost: 112.37, location: "Downtown Station" }]

// GET /api/users/<userId>/analytics
// Response: UserAnalytics
// Example: {
//   totalRentals: 24,
//   totalDistance: 1247,
//   co2Saved: 342,
//   favoriteVehicleType: "Tesla Model 3",
//   monthlyUsage: [{ month: "Jan", rentals: 7, cost: 487 }]
// }

// GET /api/users/<userId>/profile
// Response: User

/**
 * Error Response Format
 */
// All endpoints return errors in this format:
// { error: string, message: string, statusCode: number }

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export const endpoints = {
  // Auth
  signup: "/api/auth/signup",
  signin: "/api/auth/signin",
  verify: "/api/auth/verify",

  // Locations & Vehicles
  locations: "/api/locations",
  vehicles: "/api/vehicles",
  vehicleById: (id: string) => `/api/vehicles/${id}`,

  // Bookings
  bookings: "/api/bookings",
  bookingById: (id: string) => `/api/bookings/${id}`,
  updateBookingStatus: (id: string) => `/api/bookings/${id}/status`,

  // Pickup Process
  checkin: (bookingId: string) => `/api/bookings/${bookingId}/checkin`,
  signature: (bookingId: string) => `/api/bookings/${bookingId}/signature`,
  inspection: (bookingId: string) => `/api/bookings/${bookingId}/inspection`,

  // Return Process
  return: (bookingId: string) => `/api/bookings/${bookingId}/return`,
  returnStatus: (returnId: string) => `/api/returns/${returnId}/status`,
  returnPayment: (returnId: string) => `/api/returns/${returnId}/payment`,

  // User Dashboard
  userRentals: (userId: string) => `/api/users/${userId}/rentals`,
  userAnalytics: (userId: string) => `/api/users/${userId}/analytics`,
  userProfile: (userId: string) => `/api/users/${userId}/profile`,
} as const
