package vn.swp391.fa2025.evrental.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardMetricsResponse {
    private BigDecimal totalRevenue;        // Tổng doanh thu (DEPOSIT + FINAL_PAYMENT)
    private BigDecimal totalRefunds;        // Tổng hoàn tiền (REFUND_DEPOSIT)
    private BigDecimal netCashFlow;         // Dòng tiền ròng (Revenue - Refunds)
    private Long transactionCount;          // Số lượng giao dịch
    private String stationName;             // Tên trạm (nếu filter theo trạm)
    private String period;                  // Kỳ báo cáo (ví dụ: "Tháng 11/2025")
}
