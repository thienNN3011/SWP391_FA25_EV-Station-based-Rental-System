package vn.swp391.fa2025.evrental.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.swp391.fa2025.evrental.entity.Booking;
import vn.swp391.fa2025.evrental.enums.PaymentMethod;
import vn.swp391.fa2025.evrental.enums.PaymentType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentResponse {
    private Long paymentId;
    private Long bookingId;
    private PaymentType paymentType;
    private BigDecimal amount;
    private String referenceCode;
    private LocalDateTime transactionDate;
    private PaymentMethod method;
}
