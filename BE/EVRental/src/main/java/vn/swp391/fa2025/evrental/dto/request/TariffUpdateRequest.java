package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.Pattern;
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
    private String status;
}