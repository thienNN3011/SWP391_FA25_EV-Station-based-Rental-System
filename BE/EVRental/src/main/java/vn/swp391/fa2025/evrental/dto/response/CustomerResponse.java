package vn.swp391.fa2025.evrental.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerResponse {
    private Long userId;
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private String idCard;
    private String driveLicense;
    private String role;
    private String status;
    private String idCardPhoto;
    private String driveLicensePhoto;
    private LocalDateTime createdDate;
}

