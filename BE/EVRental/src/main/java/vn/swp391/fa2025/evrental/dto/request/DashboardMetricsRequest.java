package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DashboardMetricsRequest {
    private LocalDate startDate;
    private LocalDate endDate;
    private Long stationId;
    
    @Min(value = 2000, message = "Năm phải lớn hơn hoặc bằng 2000")
    @Max(value = 3000, message = "Năm không hợp lệ")
    private Integer year;
    
    @Min(value = 1, message = "Tháng phải từ 1-12")
    @Max(value = 12, message = "Tháng phải từ 1-12")
    private Integer month;
}
