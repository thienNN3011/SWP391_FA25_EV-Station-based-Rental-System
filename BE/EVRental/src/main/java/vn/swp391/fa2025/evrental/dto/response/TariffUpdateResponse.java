package vn.swp391.fa2025.evrental.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TariffUpdateResponse {
    private Long tariffId;
    private Long modelId;
    private String modelName;
    private String type;
    private BigDecimal price;
    private BigDecimal depositAmount;
    private String status;
}