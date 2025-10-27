package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
    private String type;

    @NotNull(message = "Giá không được để trống")
    @Positive(message = "Giá phải lớn hơn 0")
    private BigDecimal price;

    @NotNull(message = "Số lượng hợp đồng áp dụng không được để trống")
    @PositiveOrZero(message = "Số lượng hợp đồng phải lớn hơn hoặc bằng 0")
    private Long numberOfContractAppling;

    @NotNull(message = "Tiền đặt cọc không được để trống")
    @PositiveOrZero(message = "Tiền đặt cọc phải lớn hơn hoặc bằng 0")
    private BigDecimal depositAmount;

    private String status = "ACTIVE";
}
