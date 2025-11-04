package vn.swp391.fa2025.evrental.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRejectedUpdateRequest {
    private String username;
    private String password;
    private String idCard;
    private String driveLicense;
    private String idCardPhoto;
    private String driveLicensePhoto;
}