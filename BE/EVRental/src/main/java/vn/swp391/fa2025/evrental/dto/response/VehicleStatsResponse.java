package vn.swp391.fa2025.evrental.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * VehicleStatsResponse
 * Purpose: Aggregate statistics for a single vehicle in user activity reports.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VehicleStatsResponse {
    private String plateNumber;
    private String stationName;
    private String modelName;
    private String brand;
    private long bookingsCount;
    private double distanceKm;
}

