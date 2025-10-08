package vn.swp391.fa2025.evrental.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RenterDetailResponse {
    private String username;
    private String password;
    private String fullName;
    private String email;
    private String phone;
    private String idCard;
    private String idCardPhoto;
    private String driveLicense;
    private String driveLicensePhoto;
    private LocalDateTime createdDate;
}
