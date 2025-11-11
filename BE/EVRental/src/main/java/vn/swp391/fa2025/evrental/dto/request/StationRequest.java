package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StationRequest {
    @NotBlank(message = "Tên trạm không được để trống")
    private String stationName;
}
