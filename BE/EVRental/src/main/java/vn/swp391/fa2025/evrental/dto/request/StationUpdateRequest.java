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
public class StationUpdateRequest {

    private String stationName;

    private String address;

    private String openingHours;

    @Pattern(
            regexp = "^(OPEN|CLOSED|MAINTENANCE)$",
            message = "Trạng thái phải là: OPEN, CLOSED hoặc MAINTENANCE"
    )
    private String status;
}