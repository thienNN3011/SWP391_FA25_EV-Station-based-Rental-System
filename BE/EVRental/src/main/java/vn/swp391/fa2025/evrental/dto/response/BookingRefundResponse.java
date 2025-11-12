package vn.swp391.fa2025.evrental.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BookingRefundResponse {
    private Long bookingId;
    private String status;
    private LocalDateTime actualEndTime;
    private LocalDateTime startTime;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private String bankAccount;
    private String bankName;
    private BigDecimal originalDeposit;
    private Integer refundRate;
    private BigDecimal refundAmount;
}