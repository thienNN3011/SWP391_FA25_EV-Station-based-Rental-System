/**
 * Time Utilities for Booking Management
 * Handles time formatting, variance calculation, and duration computation
 */

export interface TimeVariance {
  minutes: number
  label: string
  type: 'success' | 'warning' | 'destructive'
}

export interface BookingVariance {
  start: TimeVariance | null
  end: TimeVariance | null
}

/**
 * Format datetime string to Vietnamese format
 * @param dateTimeStr - ISO datetime string or formatted string
 * @returns Formatted string like "15/01 10:00"
 */
export function formatDateTime(dateTimeStr: string | null | undefined): string {
  if (!dateTimeStr) return '—'
  
  try {
    const date = new Date(dateTimeStr)
    if (isNaN(date.getTime())) return dateTimeStr // Return as-is if invalid
    
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    
    return `${day}/${month} ${hours}:${minutes}`
  } catch (error) {
    return dateTimeStr
  }
}

/**
 * Format datetime string to full Vietnamese format
 * @param dateTimeStr - ISO datetime string or formatted string
 * @returns Formatted string like "15/01/2024 10:00:00"
 */
export function formatFullDateTime(dateTimeStr: string | null | undefined): string {
  if (!dateTimeStr) return '—'
  
  try {
    const date = new Date(dateTimeStr)
    if (isNaN(date.getTime())) return dateTimeStr
    
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
  } catch (error) {
    return dateTimeStr
  }
}

/**
 * Calculate difference in minutes between two datetime strings
 * @param actualTime - Actual time
 * @param plannedTime - Planned time
 * @returns Positive if late, negative if early
 */
export function getMinutesDiff(
  actualTime: string | null | undefined,
  plannedTime: string | null | undefined
): number {
  if (!actualTime || !plannedTime) return 0
  
  try {
    const actual = new Date(actualTime)
    const planned = new Date(plannedTime)
    
    if (isNaN(actual.getTime()) || isNaN(planned.getTime())) return 0
    
    const diffMs = actual.getTime() - planned.getTime()
    return Math.round(diffMs / (1000 * 60)) // Convert to minutes
  } catch (error) {
    return 0
  }
}

/**
 * Format time difference to hours and minutes
 * @param diffMinutes - Difference in minutes
 * @returns Formatted string like "2 giờ 30 phút" or "45 phút"
 */
function formatTimeDifference(diffMinutes: number): string {
  const absDiff = Math.abs(diffMinutes)
  const hours = Math.floor(absDiff / 60)
  const minutes = absDiff % 60

  if (hours > 0 && minutes > 0) {
    return `${hours} giờ ${minutes} phút`
  } else if (hours > 0) {
    return `${hours} giờ`
  } else {
    return `${minutes} phút`
  }
}

/**
 * Calculate variance between actual and planned times
 * @param booking - Booking object with time fields
 * @returns Variance object with start and end variance
 */
export function calculateVariance(booking: {
  startTime: string
  endTime: string
  actualStartTime?: string | null
  actualEndTime?: string | null
}): BookingVariance {
  const result: BookingVariance = { start: null, end: null }

  // Calculate start time variance
  if (booking.actualStartTime && booking.startTime) {
    const diffMinutes = getMinutesDiff(booking.actualStartTime, booking.startTime)

    // Only show variance if difference >= 15 minutes
    if (Math.abs(diffMinutes) >= 15) {
      const formattedTime = formatTimeDifference(diffMinutes)
      result.start = {
        minutes: diffMinutes,
        label: diffMinutes > 0
          ? `Trễ ${formattedTime}`
          : `Sớm ${formattedTime}`,
        type: getVarianceType(diffMinutes)
      }
    }
  }

  // Calculate end time variance
  if (booking.actualEndTime && booking.endTime) {
    const diffMinutes = getMinutesDiff(booking.actualEndTime, booking.endTime)

    // Only show variance if difference >= 15 minutes
    if (Math.abs(diffMinutes) >= 15) {
      const formattedTime = formatTimeDifference(diffMinutes)
      result.end = {
        minutes: diffMinutes,
        label: diffMinutes > 0
          ? `Trễ ${formattedTime}`
          : `Sớm ${formattedTime}`,
        type: getVarianceType(diffMinutes)
      }
    }
  }

  return result
}

/**
 * Get variance type based on minutes difference
 * @param diffMinutes - Difference in minutes (positive = late, negative = early)
 * @returns Variance type for styling
 */
function getVarianceType(diffMinutes: number): 'success' | 'warning' | 'destructive' {
  if (diffMinutes <= 0) {
    // Early or on-time
    return 'success'
  } else if (diffMinutes <= 30) {
    // Late but within 30 minutes
    return 'warning'
  } else {
    // Late more than 30 minutes
    return 'destructive'
  }
}

/**
 * Calculate duration between two datetime strings
 * @param startTime - Start datetime
 * @param endTime - End datetime
 * @returns Formatted duration string like "2 ngày 3 giờ 30 phút"
 */
export function calculateDuration(
  startTime: string | null | undefined,
  endTime: string | null | undefined
): string {
  if (!startTime || !endTime) return '—'
  
  try {
    const start = new Date(startTime)
    const end = new Date(endTime)
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return '—'
    
    const diffMs = end.getTime() - start.getTime()
    if (diffMs < 0) return 'Không hợp lệ'
    
    const totalMinutes = Math.floor(diffMs / (1000 * 60))
    const totalHours = Math.floor(totalMinutes / 60)
    const days = Math.floor(totalHours / 24)
    const hours = totalHours % 24
    const minutes = totalMinutes % 60
    
    const parts: string[] = []
    if (days > 0) parts.push(`${days} ngày`)
    if (hours > 0) parts.push(`${hours} giờ`)
    if (minutes > 0) parts.push(`${minutes} phút`)
    
    return parts.length > 0 ? parts.join(' ') : '0 phút'
  } catch (error) {
    return '—'
  }
}

/**
 * Check if a datetime is in the past
 * @param dateTimeStr - Datetime string to check
 * @returns True if the datetime is in the past
 */
export function isPast(dateTimeStr: string | null | undefined): boolean {
  if (!dateTimeStr) return false
  
  try {
    const date = new Date(dateTimeStr)
    if (isNaN(date.getTime())) return false
    
    return date.getTime() < Date.now()
  } catch (error) {
    return false
  }
}

/**
 * Get hours until a specific datetime
 * @param dateTimeStr - Target datetime
 * @returns Hours until the datetime (negative if past)
 */
export function getHoursUntil(dateTimeStr: string | null | undefined): number {
  if (!dateTimeStr) return 0
  
  try {
    const date = new Date(dateTimeStr)
    if (isNaN(date.getTime())) return 0
    
    const diffMs = date.getTime() - Date.now()
    return diffMs / (1000 * 60 * 60) // Convert to hours
  } catch (error) {
    return 0
  }
}

