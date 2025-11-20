package vn.swp391.fa2025.evrental.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyBookingStatsResponse {
    
    private Integer month;
    private Integer year;
    private Long totalCompletedBookings;
    private String stationName;  // null if all stations
    
    // Optional: Breakdown by station (only if stationId was null in request)
    private List<StationBookingStats> stationBreakdown;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StationBookingStats {
        private Long stationId;
        private String stationName;
        private Long completedBookings;
    }
}

