package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateBookingVehicleRequest {
    @NotNull(message = "Mã booking không được để trống")
    private Long bookingId;
    @NotNull(message = "Mã xe không được để trống")
    private Long vehicleId;
}
