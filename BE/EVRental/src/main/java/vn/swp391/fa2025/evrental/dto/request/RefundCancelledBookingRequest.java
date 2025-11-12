package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefundCancelledBookingRequest {
    @NotNull(message = "Mã booking không được rỗng")
    private Long bookingId;
    @NotNull(message = "Mã tham chiếu không được rỗng")
    private String referenceCode;
    @NotNull(message = "Thời gian không được rỗng")
    @PastOrPresent(message = "Thời gian giao dịch không được ở tương lai")
    private LocalDateTime transactionDate;
}
