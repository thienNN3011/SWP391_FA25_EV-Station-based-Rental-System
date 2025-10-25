package vn.swp391.fa2025.evrental.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * UserStatsResponse
 * Purpose: Top-level DTO for user activity statistics exposed via /users/me/stats.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserStatsResponse {
    private long totalBookingCompleted;
    private double totalDistanceKm;
    private long totalDurationMinutes;
    private List<VehicleStatsResponse> vehicles;
}

