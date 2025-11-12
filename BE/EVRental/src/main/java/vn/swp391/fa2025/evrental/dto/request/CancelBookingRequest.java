package vn.swp391.fa2025.evrental.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CancelBookingRequest {
    @NotNull(message = "BOoking ID không được rông")
    private Long bookingId;
    @NotBlank(message = "Tên ngân hàng không được rỗng")
    private String bankName;
    @NotBlank(message = "Sô tài khoản ngân hang không được rỗng")
    private String bankAccount;
}
