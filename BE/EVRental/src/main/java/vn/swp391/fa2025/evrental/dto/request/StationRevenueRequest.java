package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StationRevenueRequest {
    @NotBlank(message = "Tên trạm không được để trống")
    private String stationName;

    @NotNull(message = "Năm không được để trống")
    @Min(value = 2000, message = "Năm phải lớn hơn hoặc bằng 2000")
    @Max(value = 3000, message = "Năm không hợp lệ")
    private Integer year;
}
