package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TariffUpdateRequest {
    @Pattern(
            regexp = "^(HOURLY|DAILY|WEEKLY|MONTHLY)$",
            message = "Trạng thái phải là: HOURLY, DAILY, WEEKLY hoặc MONTHLY"
    )
    private String type;

    @Positive(message = "Giá phải lớn hơn 0")
    private BigDecimal price;

    @Positive(message = "Số tiền đặt cọc phải lớn hơn 0")
    private BigDecimal depositAmount;

    private String status;
}