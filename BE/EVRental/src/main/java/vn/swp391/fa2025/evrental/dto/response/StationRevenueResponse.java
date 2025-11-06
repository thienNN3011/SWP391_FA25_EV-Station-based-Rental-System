package vn.swp391.fa2025.evrental.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class StationRevenueResponse {
    private Long stationId;
    private String stationName;
    private int month;
    private int year;
    private BigDecimal revenue;
}
