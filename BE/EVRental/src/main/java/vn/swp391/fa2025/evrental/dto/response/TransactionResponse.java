package vn.swp391.fa2025.evrental.dto.response;

import lombok.Builder;
import lombok.Data;
import vn.swp391.fa2025.evrental.enums.PaymentMethod;
import vn.swp391.fa2025.evrental.enums.PaymentType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class TransactionResponse {
    private Long paymentId;
    private Long bookingId;
    private String customerName;
    private BigDecimal amount;
    private PaymentType paymentType;
    private LocalDateTime transactionDate;
    private PaymentMethod method;
    private String referenceCode;
    private String stationName;
}
