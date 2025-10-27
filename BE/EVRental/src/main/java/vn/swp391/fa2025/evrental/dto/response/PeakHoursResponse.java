package vn.swp391.fa2025.evrental.dto.response;

import lombok.*;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PeakHoursResponse {
    private String stationName; // null nếu là toàn hệ thống
    private String period; // "ALL_TIME", "LAST_30_DAYS", "LAST_7_DAYS"

    // Thống kê theo giờ trong ngày (0-23)
    private List<HourlyStats> hourlyStats;

    // Top 5 giờ cao điểm
    private List<PeakHour> peakHours;

    // Thống kê theo ngày trong tuần
    private Map<String, Long> weekdayDistribution; // "MONDAY": 150, "TUESDAY": 120...

    // Tổng quan
    private Long totalBookings;
    private Integer peakHour; // Giờ cao điểm nhất (0-23)
    private String peakDay; // Ngày cao điểm nhất
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class HourlyStats {
    private Integer hour; // 0-23
    private Long bookingCount;
    private Long activeRentals; // Số xe đang được thuê trong giờ này
    private Double averageUtilization;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class PeakHour {
    private Integer hour;
    private Long bookingCount;
    private String timeRange; // "08:00-09:00"
}