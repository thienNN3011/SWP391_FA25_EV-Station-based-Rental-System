package vn.swp391.fa2025.evrental.dto.request;

<<<<<<< HEAD
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StationUpdateRequest {

    private String stationName;
    private String address;
    private String openingHours;
=======
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
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
    private String status;
}