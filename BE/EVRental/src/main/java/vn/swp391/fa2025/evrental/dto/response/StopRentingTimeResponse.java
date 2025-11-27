package vn.swp391.fa2025.evrental.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Builder
public class StopRentingTimeResponse {
    private LocalDateTime endTime;
    private LocalDateTime actualEndTime;
    private BigDecimal extraFee;
    private BigDecimal totalAmount;
    private BigDecimal expectedTotalAmount;
    private BigDecimal tariffPrice;
    private BigDecimal depositAmount;
    private Long days;
    private Integer extraRate;
    private Long extraDay;
}
