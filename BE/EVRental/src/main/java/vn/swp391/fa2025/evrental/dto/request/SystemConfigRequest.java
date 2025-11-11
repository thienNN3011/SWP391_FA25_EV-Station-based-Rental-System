package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SystemConfigRequest {
    @NotBlank(message = "Key cấu hình không được để trống")
    private String key;

    @NotBlank(message = "Giá trị cấu hình không được để trống")
    private String value;
}
