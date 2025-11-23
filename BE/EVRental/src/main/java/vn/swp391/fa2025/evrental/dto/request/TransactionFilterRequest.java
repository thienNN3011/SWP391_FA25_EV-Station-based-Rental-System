package vn.swp391.fa2025.evrental.dto.request;

import lombok.Data;
import vn.swp391.fa2025.evrental.enums.PaymentType;

import java.time.LocalDate;

@Data
public class TransactionFilterRequest {
    private LocalDate startDate;
    private LocalDate endDate;
    private Long stationId;
    private PaymentType paymentType;
    private int page = 0;
    private int size = 10;
}
