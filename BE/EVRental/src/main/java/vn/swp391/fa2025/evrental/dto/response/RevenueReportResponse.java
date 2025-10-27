package vn.swp391.fa2025.evrental.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueReportResponse {
    private LocalDate startDate;
    private LocalDate endDate;

    // Tổng doanh thu toàn hệ thống
    private BigDecimal totalRevenue;
    private Long totalBookings;
    private BigDecimal averageRevenuePerBooking;

    // Doanh thu theo station
    private List<StationRevenue> stationRevenues;

    // Top stations
    private List<StationRevenue> topStationsByRevenue;
    private List<StationRevenue> topStationsByBookings;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class StationRevenue {
    private Long stationId;
    private String stationName;
    private String address;
    private BigDecimal revenue;
    private Long bookingCount;
    private BigDecimal averageRevenuePerBooking;
    private Double revenuePercentage; // % so với tổng doanh thu
    private Integer ranking;
}