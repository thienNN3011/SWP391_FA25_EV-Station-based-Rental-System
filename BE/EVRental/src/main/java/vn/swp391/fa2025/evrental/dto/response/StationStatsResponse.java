package vn.swp391.fa2025.evrental.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StationStatsResponse {
    private Long stationId;
    private String stationName;
    private String address;

    // Doanh thu
    private BigDecimal totalRevenue;
    private Long totalBookings;
    private BigDecimal averageRevenuePerBooking;

    // Tỷ lệ sử dụng
    private Integer totalVehicles;
    private Double utilizationRate; // Phần trăm
    private Long totalRentalHours;
    private Long totalAvailableHours;

    // Top xe được thuê nhiều nhất
    private List<VehicleUsageStats> topVehicles;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class VehicleUsageStats {
    private Long vehicleId;
    private String plateNumber;
    private String modelName;
    private String brand;
    private Long bookingCount;
    private Long totalHours;
    private Double utilizationRate;
}