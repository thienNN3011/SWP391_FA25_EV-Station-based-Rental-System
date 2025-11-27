package vn.swp391.fa2025.evrental.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude (JsonInclude.Include.NON_NULL)
public class BookingResponse {
    private Long bookingId;
    private CustomerResponse user;
    private VehicleResponse vehicle;
    private StationResponse station;
    private TariffResponse tariff;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime actualStartTime;
    private LocalDateTime actualEndTime;
    private String beforeRentingStatus;
    private String afterRentingStatus;
    private Long startOdo;
    private Long endOdo;
    private BigDecimal expectedTotalAmount;
    private BigDecimal penaltyAmount;
    private BigDecimal totalAmount;
    private String status;
}
