package vn.swp391.fa2025.evrental.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StationBookingStatsDTO {
    private Long stationId;
    private String stationName;
    private Long completedBookings;
}

