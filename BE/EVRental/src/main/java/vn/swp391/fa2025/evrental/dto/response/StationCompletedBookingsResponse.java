package vn.swp391.fa2025.evrental.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StationCompletedBookingsResponse {
    private Long stationId;
    private String stationName;
    private int month;
    private int year;
    private Long completedBookings;
}

