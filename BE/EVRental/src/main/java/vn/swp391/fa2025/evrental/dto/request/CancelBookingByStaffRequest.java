package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CancelBookingByStaffRequest {
    @NotNull(message = "BOoking ID không được rông")
    private Long bookingId;
    @NotBlank(message = "Mã tham chiếu giao dịch không được để trống")
    private String referenceCode;
    @NotNull(message = "Thời gian giao dịch không được để trống")
    private LocalDateTime transactionDate;
    @NotNull(message = "Không được để trống lí do")
    private String reason;
}
