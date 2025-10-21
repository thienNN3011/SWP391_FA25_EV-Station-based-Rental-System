package vn.swp391.fa2025.evrental.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude (JsonInclude.Include.NON_NULL)
@Builder
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

