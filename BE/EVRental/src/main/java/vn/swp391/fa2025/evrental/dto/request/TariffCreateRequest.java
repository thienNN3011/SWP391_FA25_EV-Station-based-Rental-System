package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
<<<<<<< HEAD
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
=======
import jakarta.validation.constraints.Positive;
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
public class TariffCreateRequest {

    @NotNull(message = "Model ID không được để trống")
    private Long modelId;

    @NotBlank(message = "Loại bảng giá không được để trống")
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
    private String type;

    @NotNull(message = "Giá không được để trống")
    @Positive(message = "Giá phải lớn hơn 0")
    private BigDecimal price;

<<<<<<< HEAD
    @NotNull(message = "Số tiền đặt cọc không được để trống")
    @Positive(message = "Số tiền đặt cọc phải lớn hơn 0")
    private BigDecimal depositAmount;
}
=======
    @NotNull(message = "Số lượng hợp đồng áp dụng không được để trống")
    @PositiveOrZero(message = "Số lượng hợp đồng phải lớn hơn hoặc bằng 0")
    private Long numberOfContractAppling;

    @NotNull(message = "Tiền đặt cọc không được để trống")
    @PositiveOrZero(message = "Tiền đặt cọc phải lớn hơn hoặc bằng 0")
    private BigDecimal depositAmount;

    private String status = "ACTIVE";
}
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
