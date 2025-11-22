import { Calendar, Clock, PlayCircle, CheckCircle, StopCircle } from 'lucide-react'
import { formatDateTime, calculateVariance } from '@/lib/timeUtils'
import { VarianceBadge } from '@/components/ui/variance-badge'

interface TimeDisplayProps {
  booking: {
    startTime: string
    endTime: string
    actualStartTime?: string | null
    actualEndTime?: string | null
    status: string
  }
}

/**
 * TimeDisplay Component
 * Displays booking time information based on booking status
 * - BOOKING/UNCONFIRMED: Shows only planned times
 * - RENTING: Shows actual start time with variance + planned end time
 * - COMPLETED: Shows actual start and end times with variance
 * - Other statuses: Shows planned times
 */
export function TimeDisplay({ booking }: TimeDisplayProps) {
  const variance = calculateVariance(booking)

  // BOOKING or UNCONFIRMED status - show only planned times
  if (booking.status === 'BOOKING' || booking.status === 'UNCONFIRMED') {
    return (
      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-1 text-sm">
          <Calendar className="size-4 text-blue-500" />
          {formatDateTime(booking.startTime)}
        </span>
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="size-4" />
          {formatDateTime(booking.endTime)}
        </span>
      </div>
    )
  }

  // RENTING status - show actual start time + planned end time
  if (booking.status === 'RENTING') {
    return (
      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-2 text-sm">
          <PlayCircle className="size-4 text-green-500" />
          {formatDateTime(booking.actualStartTime)}
          {variance.start && <VarianceBadge variance={variance.start} />}
        </span>
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="size-4" />
          Dự kiến: {formatDateTime(booking.endTime)}
        </span>
      </div>
    )
  }

  // COMPLETED status - show actual start and end times
  if (booking.status === 'COMPLETED') {
    return (
      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-2 text-sm">
          <CheckCircle className="size-4 text-green-600" />
          {formatDateTime(booking.actualStartTime)}
        </span>
        <span className="flex items-center gap-2 text-sm">
          <StopCircle className="size-4 text-gray-600" />
          {formatDateTime(booking.actualEndTime)}
          {variance.end && <VarianceBadge variance={variance.end} />}
        </span>
      </div>
    )
  }

  // CANCELLED or NO_SHOW - show planned times
  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-1 text-sm text-muted-foreground">
        <Calendar className="size-4" />
        {formatDateTime(booking.startTime)}
      </span>
      <span className="flex items-center gap-1 text-sm text-muted-foreground">
        <Clock className="size-4" />
        {formatDateTime(booking.endTime)}
      </span>
    </div>
  )
}

