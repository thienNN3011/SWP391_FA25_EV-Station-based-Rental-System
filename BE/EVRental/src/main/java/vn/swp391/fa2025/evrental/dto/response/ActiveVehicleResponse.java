package vn.swp391.fa2025.evrental.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActiveVehicleResponse {
    private Long vehicleId;
    private String color;
    private String stationName;
    private String plateNumber;

    private Long modelId;
    private String modelName;
    private String brand;
    private Integer batteryCapacity;
    private Integer range;
    private Integer seat;
    private String description;
    private List<ModelImageUrlResponse> imageUrls;

    private List<TariffResponse> tariffs;
}