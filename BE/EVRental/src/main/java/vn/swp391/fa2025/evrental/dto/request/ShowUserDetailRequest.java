package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ShowUserDetailRequest {
    @NotBlank(message = "Tên đăng nhập không được để trống")
    private String username;
}
