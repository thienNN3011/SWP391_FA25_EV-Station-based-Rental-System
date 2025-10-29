package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class RegisterCustomerRequest {

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

    @NotBlank(message = "ID Card is required")
    private String idCard;

    @NotBlank(message = "Driver license is required")
    private String driveLicense;

    @NotNull(message = "ID Card photo is required")
    private String idCardPhoto;

    @NotNull(message = "Driver license photo is required")
    private String driveLicensePhoto;
}

