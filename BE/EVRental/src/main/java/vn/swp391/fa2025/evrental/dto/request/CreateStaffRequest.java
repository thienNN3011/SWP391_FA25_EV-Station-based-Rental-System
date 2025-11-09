package vn.swp391.fa2025.evrental.dto.request;

// Purpose: capture admin -> create staff payload; Tests: MockMvc POST /admin/staffs with JWT ADMIN

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CreateStaffRequest {

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone is required")
    @Pattern(
        regexp = "^[+]?[0-9]{7,15}$",
        message = "Invalid phone format"
    )
    private String phone;

    private String idCard;

    private String driveLicense;

    private String idCardPhoto;

    private String driveLicensePhoto;

    /**
     * Station to assign the staff to. Optional for now.
     */
    private Long stationId;
}
