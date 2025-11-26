import { Calendar, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  formatFullDateTime, 
  calculateDuration, 
  calculateVariance 
} from '@/lib/timeUtils'
import { VarianceBadge } from '@/components/ui/variance-badge'

interface BookingDetailRowProps {
  booking: {
    startTime: string
    endTime: string
    actualStartTime?: string | null
    actualEndTime?: string | null
    status: string
  }
}

/**
 * BookingDetailRow Component
 * Displays detailed time information in an expandable row
 * Shows both planned and actual times with variance indicators
 */
export function BookingDetailRow({ booking }: BookingDetailRowProps) {
  const variance = calculateVariance(booking)
  function getPlannedEnd(startTime: string, endTime: string) {
  const start = new Date(startTime)
  const end = new Date(endTime)
  const diffMs = end.getTime() - start.getTime()
  const rentalDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) // làm tròn lên
  const plannedEnd = new Date(start)
  plannedEnd.setDate(plannedEnd.getDate() + rentalDays)
  return plannedEnd
}


  return (
    <div className="p-4 bg-gray-50 border-t">
      <div className="grid grid-cols-2 gap-4">
        {/* Planned Time Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="size-4 text-blue-500" />
              Thời gian dự kiến
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Bắt đầu:</span>
              <div className="font-medium mt-1">
                {formatFullDateTime(booking.startTime)}
              </div>
            </div>
           <div>
  <span className="text-muted-foreground">Kết thúc:</span>
  <div className="font-medium mt-1">
    {formatFullDateTime(getPlannedEnd(booking.startTime, booking.endTime).toISOString())}
  </div>
</div>

            <div className="pt-2 border-t">
  <span className="text-muted-foreground">Thời gian thuê:</span>
  <div className="font-medium mt-1">
    {(() => {
      if (!booking.startTime || !booking.endTime) return '-';
      const start = new Date(booking.startTime);
      const end = new Date(booking.endTime);

      
      const diffMs = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      return `${diffDays} ngày`;
    })()}
  </div>
</div>

          </CardContent>
        </Card>

        {/* Actual Time Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="size-4 text-green-500" />
              Thời gian thực tế
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {booking.actualStartTime ? (
              <>
                <div>
                  <span className="text-muted-foreground">Bắt đầu:</span>
                  <div className="font-medium mt-1 flex items-center gap-2">
                    {formatFullDateTime(booking.actualStartTime)}
                    {variance.start && <VarianceBadge variance={variance.start} />}
                  </div>
                </div>
                
                {booking.actualEndTime ? (
                  <>
                    <div>
                      <span className="text-muted-foreground">Kết thúc:</span>
                      <div className="font-medium mt-1 flex items-center gap-2">
                        {formatFullDateTime(booking.actualEndTime)}
                        {variance.end && <VarianceBadge variance={variance.end} />}
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <span className="text-muted-foreground">
                        Thời gian thuê thực tế:
                      </span>
                      <div className="font-medium mt-1">
                        {calculateDuration(
                          booking.actualStartTime,
                          booking.actualEndTime
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <span className="text-muted-foreground">Kết thúc:</span>
                    <div className="font-medium mt-1 text-muted-foreground italic">
                      Chưa kết thúc
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground italic">
                Chưa bắt đầu thuê
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

