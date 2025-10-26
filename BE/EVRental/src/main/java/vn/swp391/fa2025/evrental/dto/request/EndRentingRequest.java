package vn.swp391.fa2025.evrental.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class EndRentingRequest {
    private Long bookingId;
    private Long endOdo;
    private String vehicleStatus;
    private String referenceCode;
    private LocalDateTime transactionDate;
}
