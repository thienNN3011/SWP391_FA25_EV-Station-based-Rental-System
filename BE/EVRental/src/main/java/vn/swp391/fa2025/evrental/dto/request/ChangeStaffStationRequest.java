package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChangeStaffStationRequest {
    @NotBlank(message = "Tên trạm không được để trống")
    private String stationName;

    @NotNull(message = "Mã nhân viên không được để trống")
    private Long staffId;
}
