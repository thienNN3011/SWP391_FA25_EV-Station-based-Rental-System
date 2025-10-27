package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
<<<<<<< HEAD
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

=======
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TariffUpdateRequest {

    private Long modelId;

    private String type;


    private BigDecimal price;


    private Long numberOfContractAppling;


    private BigDecimal depositAmount;

    @Pattern(
            regexp = "^(ACTIVE|INACTIVE)$",
            message = "Trạng thái phải là: ACTIVE hoặc INACTIVE"
    )
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
    private String status;
}