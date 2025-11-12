package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StopRentingRequest {
    @NotNull(message = "BOoking ID không được rông")
    private Long bookingId;
}
