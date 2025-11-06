package vn.swp391.fa2025.evrental.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StationVehicleStatsResponse {
    private Long stationId;
    private String stationName;
    private Integer totalVehicles;
    private Integer availableVehicles;
    private Integer inUseVehicles;
    private Integer maintenanceVehicles;
    private List<VehicleResponse> availableVehicleList;
    private List<VehicleResponse> inUseVehicleList;
    private List<VehicleResponse> maintenanceVehicleList;
}