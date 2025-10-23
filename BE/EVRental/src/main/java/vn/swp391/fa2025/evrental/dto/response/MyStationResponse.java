package vn.swp391.fa2025.evrental.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * MyStationResponse
 * Purpose: Response DTO for endpoint returning current user's station info
 * along with a list of vehicles at that station (short form + status).
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MyStationResponse {
    private String stationName;
    private String address;
    private String openingHours;
    private List<VehicleResponse> vehicles;
}

