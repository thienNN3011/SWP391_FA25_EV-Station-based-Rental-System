package vn.swp391.fa2025.evrental.dto.request;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class StartRentingRequest {
    private Long bookingId;
    private String vehicleStatus;
    private Long starOdo;
}
