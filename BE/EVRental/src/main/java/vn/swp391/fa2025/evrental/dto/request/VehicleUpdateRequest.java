package vn.swp391.fa2025.evrental.dto.request;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class VehicleUpdateRequest {
    private Long modelId;

    private Long stationId;

    private String color;

    private String plateNumber;

    @Pattern(
            regexp = "^(AVAILABLE|BOOKED|IN_USE|MAINTENANCE|INACTIVE)$",
            message = "Trạng thái phải là: AVAILABLE, BOOKED, IN_USE, MAINTENANCE hoặc INACTIVE"
    )
    private String status;
}
