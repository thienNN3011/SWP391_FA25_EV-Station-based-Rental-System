package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class ShowBookingRequest {
    @NotNull(message = "Mã đặt xe không được để trống")
    private Long bookingId;

    @NotBlank(message = "Trạng thái không được để trống")
    private String status;
}
