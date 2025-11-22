import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { getErrorMessage } from "@/lib/error-utils"
import toast from "react-hot-toast"

export interface Booking {
  bookingId: number
  vehicleModel: string
  vehicleColor: string
  plateNumber: string
  stationName: string
  stationAddress: string
  startTime: string
  endTime: string
  totalAmount: number
  status: string
}

export interface PagedBookingResponse {
  bookings: Booking[]
  currentPage: number
  totalPages: number
  totalElements: number
  pageSize: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface BookingFilters {
  status: string
  page?: number
  size?: number
  searchQuery?: string
}

export interface CancelBookingRequest {
  bookingId: number
  bankAccount: string
  bankName: string
}

// Fetch bookings with pagination
export function useBookings(filters: BookingFilters) {
  return useQuery({
    queryKey: ["bookings", filters],
    queryFn: async () => {
      const res = await api.post("/bookings/showbookingbystatus/paged", {
        status: filters.status,
        page: filters.page || 0,
        size: filters.size || 20,
        searchQuery: filters.searchQuery || null,
      })
      
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch bookings")
      }
      
      const data = res.data.data
      
      // Transform backend response to frontend format
      const transformedBookings = data.bookings.map((b: any) => ({
        bookingId: b.bookingId,
        vehicleModel: b.vehicle.modelName,
        vehicleColor: b.vehicle.color,
        plateNumber: b.vehicle.plateNumber,
        stationName: b.station.stationName,
        stationAddress: b.station.address,
        startTime: b.startTime,
        endTime: b.endTime,
        totalAmount: b.totalAmount,
        status: b.status,
      }))
      
      return {
        bookings: transformedBookings,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
        pageSize: data.pageSize,
        hasNext: data.hasNext,
        hasPrevious: data.hasPrevious,
      } as PagedBookingResponse
    },
    staleTime: 30000, // 30 seconds
  })
}

// Fetch booking detail
export function useBookingDetail(bookingId: number | null) {
  return useQuery({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      if (!bookingId) return null
      
      const res = await api.post("/bookings/showdetailbooking", { bookingId })
      
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch booking detail")
      }
      
      return res.data.data
    },
    enabled: !!bookingId,
    staleTime: 60000, // 1 minute
  })
}

// Cancel booking mutation
export function useCancelBooking() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CancelBookingRequest) => {
      const res = await api.post("/bookings/cancelbooking", data)
      
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to cancel booking")
      }
      
      return res.data
    },
    onSuccess: (data, variables) => {
      // Invalidate all booking queries to refetch
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
      queryClient.invalidateQueries({ queryKey: ["booking", variables.bookingId] })
      
      toast.success(data.message || "Hủy booking thành công!")
    },
    onError: (error) => {
      const message = getErrorMessage(error)
      toast.error(message)
    },
  })
}

