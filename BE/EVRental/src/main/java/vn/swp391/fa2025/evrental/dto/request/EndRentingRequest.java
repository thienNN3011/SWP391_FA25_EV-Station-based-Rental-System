package vn.swp391.fa2025.evrental.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class EndRentingRequest {
    @NotNull(message = "Mã đặt xe không được để trống")
    private Long bookingId;

    @NotNull(message = "Số công tơ mét khi trả xe không được để trống")
    private Long endOdo;

    @NotBlank(message = "Tình trạng xe không được để trống")
    private String vehicleStatus; // ví dụ: "GOOD", "DAMAGED", "NEEDS_MAINTENANCE"

    @NotBlank(message = "Mã tham chiếu giao dịch không được để trống")
    private String referenceCode;

    @NotNull(message = "Thời gian giao dịch không được để trống")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime transactionDate;
}
