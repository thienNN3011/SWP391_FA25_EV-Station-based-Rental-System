package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class VehicleModelUpdateRequest {

    private String name;

    private String brand;

    @Positive(message = "Dung lượng pin phải lớn hơn 0")
    private Long batteryCapacity;

    @Positive(message = "Quãng đường di chuyển phải lớn hơn 0")
    private Long range;

    @Min(value = 1, message = "Số ghế phải ít nhất là 1")
    private Integer seat;

    private String description;
}