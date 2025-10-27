package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class VehicleModelUpdateRequest {

    private String name;

    private String brand;

    private Long batteryCapacity;

    private Long range;

    private Integer seat;

    private String description;

    private List<ImageUrlRequest> imageUrls;
}