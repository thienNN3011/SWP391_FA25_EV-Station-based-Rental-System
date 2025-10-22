package vn.swp391.fa2025.evrental.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Builder
public class RenterListResponse {
    private String fullName;
    private String phone;
    private String email;
    private String idCard;
    private String driveLicense;
    private String idCardPhoto;
    private String driveLicensePhoto;
    private String status;

}


