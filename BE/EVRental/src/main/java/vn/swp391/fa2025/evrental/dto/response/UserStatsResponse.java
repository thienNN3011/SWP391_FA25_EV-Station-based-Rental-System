package vn.swp391.fa2025.evrental.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO chứa thống kê hoạt động của user
 * Response cho API GET /users/me/stats
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserStatsResponse {
    private long totalBookingCompleted;    // Tổng số booking đã hoàn thành
    private double totalDistanceKm;        // Tổng quãng đường (km)
    private long totalDurationMinutes;     // Tổng thời gian thuê (phút)
    private List<VehicleStatsResponse> vehicles;  // Top 10 xe được thuê nhiều nhất
}

