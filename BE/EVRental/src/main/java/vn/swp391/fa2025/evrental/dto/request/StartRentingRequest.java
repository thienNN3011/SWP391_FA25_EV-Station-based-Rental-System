package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class StartRentingRequest {
    @NotNull(message = "Mã đặt xe không được để trống")
    private Long bookingId;

    @NotBlank(message = "Tình trạng xe khi bắt đầu không được để trống")
    private String vehicleStatus; // ví dụ: "GOOD", "DAMAGED", "NEEDS_MAINTENANCE"

    @NotNull(message = "Số công tơ mét khi bắt đầu không được để trống")
    @Min(value = 0, message = "Số công tơ mét phải lớn hơn hoặc bằng 0")
    private Long startOdo;
}
