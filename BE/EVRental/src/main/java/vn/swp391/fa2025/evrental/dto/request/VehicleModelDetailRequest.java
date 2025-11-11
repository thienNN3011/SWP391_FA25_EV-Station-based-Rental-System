package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VehicleModelDetailRequest {
    @NotBlank(message = "Tên trạm không được để trống")
    private String stationName;

    @NotNull(message = "Mã mẫu xe không được để trống")
    private Long modelId;
}
