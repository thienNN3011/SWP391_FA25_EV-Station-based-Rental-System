package vn.swp391.fa2025.evrental.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import vn.swp391.fa2025.evrental.entity.Tariff;

import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VehicleModelResponse {
    private Long modelId;
    private String stationName;
    private String name;
    private String brand;
    private Long batteryCapacity;
    private Long range;
    private Integer seat;
    private String description;
    private List<ModelImageUrlResponse> imageUrl;
    private List<TariffResponse> tariffs;
    private Set<String> colors;
}
