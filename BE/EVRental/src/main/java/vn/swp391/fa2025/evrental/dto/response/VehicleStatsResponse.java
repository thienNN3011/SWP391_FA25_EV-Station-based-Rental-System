package vn.swp391.fa2025.evrental.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO chứa thống kê của 1 xe trong báo cáo hoạt động user
 * Phần tử trong mảng vehicles của UserStatsResponse
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VehicleStatsResponse {
    private String plateNumber;     // Biển số xe
    private String stationName;     // Tên trạm
    private String modelName;       // Tên model
    private String brand;           // Hãng xe
    private long bookingsCount;     // Số lần user thuê xe này
    private double distanceKm;      // Tổng km đã đi với xe này
}

