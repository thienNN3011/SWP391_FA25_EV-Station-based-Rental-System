package vn.swp391.fa2025.evrental.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VehicleResponse {
    private Long vehicleId;
    private Long modelId;
    private String modelName;
    private String brand;
    private Long stationId;
    private String stationName;
    private String color;
    private String status;
    private String plateNumber;

    public VehicleResponse(String plateNumber, String color, String modelName, String brand) {
        this.plateNumber = plateNumber;
        this.color = color;
        this.modelName = modelName;
        this.brand = brand;
    }
}