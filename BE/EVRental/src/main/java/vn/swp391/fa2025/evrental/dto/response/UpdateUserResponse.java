package vn.swp391.fa2025.evrental.dto.response;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UpdateUserResponse {
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private LocalDateTime updatedDate;
}
