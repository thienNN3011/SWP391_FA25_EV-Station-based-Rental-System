package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ShowStaffStatsRequest {

    @NotBlank(message = "Tên trạm không được để trống")
    private String stationName;

    @NotNull(message = "Tháng không được để trống")
    @Min(value = 1, message = "Tháng phải từ 1 đến 12")
    @Max(value = 12, message = "Tháng phải từ 1 đến 12")
    private Long month;

    @NotNull(message = "Năm không được để trống")
    @Min(value = 2000, message = "Năm phải lớn hơn hoặc bằng 2000")
    private Long year;
}
