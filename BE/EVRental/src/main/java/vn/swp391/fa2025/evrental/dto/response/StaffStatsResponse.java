package vn.swp391.fa2025.evrental.dto.response;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffStatsResponse {

    private Long staffId;
    private String fullName;
    private Long totalCompletedBookings;
    private BigDecimal totalFinalPayment;

    public StaffStatsResponse(Long staffId, String staffName, Long totalCompletedBookings, Number totalFinalPayment) {
        this.staffId = staffId;
        this.fullName = staffName;
        this.totalCompletedBookings = totalCompletedBookings;
        this.totalFinalPayment = totalFinalPayment == null ? BigDecimal.ZERO : new BigDecimal(totalFinalPayment.toString());
    }

}
