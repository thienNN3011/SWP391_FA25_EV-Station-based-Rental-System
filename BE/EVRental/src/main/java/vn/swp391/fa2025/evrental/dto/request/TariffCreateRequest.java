package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class TariffCreateRequest {
    @NotNull(message = "Model ID không được để trống")
    private Long modelId;

    @NotBlank(message = "Loại tariff không được để trống")
    @Pattern(
            regexp = "^(HOURLY|DAILY|WEEKLY|MONTHLY)$",
            message = "Trạng thái phải là: HOURLY, DAILY, WEEKLY hoặc MONTHLY"
    )
    private String type;

    @NotNull(message = "Giá không được để trống")
    @Positive(message = "Giá phải lớn hơn 0")
    private BigDecimal price;

    @NotNull(message = "Số tiền đặt cọc không được để trống")
    @Positive(message = "Số tiền đặt cọc phải lớn hơn 0")
    private BigDecimal depositAmount;
}