package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.NotBlank;
<<<<<<< HEAD
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StationCreateRequest {

    @NotBlank(message = "Tên trạm không được để trống")
    private String stationName;

    @NotBlank(message = "Địa chỉ không được để trống")
    private String address;

    @NotBlank(message = "Giờ mở cửa không được để trống")
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
public class StationCreateRequest {


    private String stationName;

    private String address;

    private String openingHours;

    @Pattern(
            regexp = "^(OPEN|CLOSED|MAINTENANCE)$",
            message = "Trạng thái phải là: OPEN, CLOSED hoặc MAINTENANCE"
    )
    private String status = "OPEN";
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
}